import os
import logging
from urllib.parse import urlparse

import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.orm import sessionmaker, Session
import sqlalchemy
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from features.features import extract_features
from train import FEATURE_COLUMNS, MODEL_PATH

logger = logging.getLogger("kraven")

# ---------------------------------------------------------------------------
# Config from environment
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
RETRAIN_THRESHOLD = int(os.getenv("RETRAIN_THRESHOLD", "5"))

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="Kraven Threat Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = sqlalchemy.orm.declarative_base()


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    url = Column(String)
    threat_category = Column(String)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class URL(BaseModel):
    url: str


class ReportCreate(BaseModel):
    email: str
    url: str
    threat_category: str


class ReportResponse(BaseModel):
    id: int
    email: str
    url: str
    threat_category: str


class PredictionResponse(BaseModel):
    status: bool
    category: str
    confidence: float
    source: str


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------
_model = None
_model_mtime = 0.0


def _load_model():
    global _model, _model_mtime
    try:
        mtime = os.path.getmtime(MODEL_PATH)
        if _model is None or mtime > _model_mtime:
            _model = joblib.load(MODEL_PATH)
            _model_mtime = mtime
            logger.info("Model loaded from %s", MODEL_PATH)
    except FileNotFoundError:
        logger.warning("Model file not found at %s — predictions will fail", MODEL_PATH)
        _model = None
    return _model


# ---------------------------------------------------------------------------
# Shopping list cache
# ---------------------------------------------------------------------------
_shopping_sites: set = set()


def _load_shopping_list():
    global _shopping_sites
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "myshopping.txt")
    try:
        with open(path, "r") as f:
            _shopping_sites = {line.strip() for line in f if line.strip()}
    except FileNotFoundError:
        _shopping_sites = set()


# ---------------------------------------------------------------------------
# Retrain tracking
# ---------------------------------------------------------------------------
_reports_since_retrain = 0


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
@app.on_event("startup")
def startup():
    _load_shopping_list()
    _load_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _valid_url(url: str) -> bool:
    parsed = urlparse(url)
    return all([parsed.scheme, parsed.netloc])


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": _model is not None}


@app.post("/prediction", response_model=PredictionResponse)
async def predict_url(payload: URL, db: Session = Depends(get_db)):
    url = payload.url

    # Invalid URL
    if not _valid_url(url):
        return PredictionResponse(
            status=False, category="invalid", confidence=1.0, source="validation"
        )

    # Shopping site
    if url in _shopping_sites:
        return PredictionResponse(
            status=True, category="Shopping", confidence=1.0, source="shopping_list"
        )

    # Community report lookup
    reported = db.query(Report).filter(Report.url == url).first()
    if reported is not None:
        return PredictionResponse(
            status=True,
            category=reported.threat_category,
            confidence=1.0,
            source="community_report",
        )

    # ML prediction
    model = _load_model()
    if model is None:
        raise HTTPException(status_code=503, detail="Model not available")

    features = extract_features(url)
    X = pd.DataFrame([features])[FEATURE_COLUMNS]
    proba = model.predict_proba(X)[0]
    pred_class = int(np.argmax(proba))
    confidence = float(proba[pred_class])

    if pred_class == 1:
        return PredictionResponse(
            status=True, category="Malicious", confidence=confidence, source="ml_model"
        )

    return PredictionResponse(
        status=False, category="Benign", confidence=confidence, source="ml_model"
    )


@app.post("/reports", response_model=ReportResponse)
async def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    global _reports_since_retrain

    db_report = Report(**report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    # Check if retrain threshold reached
    _reports_since_retrain += 1
    if _reports_since_retrain >= RETRAIN_THRESHOLD:
        _reports_since_retrain = 0
        _trigger_retrain(db)

    return db_report


@app.get("/reports")
async def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()


# ---------------------------------------------------------------------------
# Celery retrain trigger
# ---------------------------------------------------------------------------
def _trigger_retrain(db: Session):
    try:
        from celery_worker import retrain_model

        # Export community reports to CSV for the training pipeline
        reports = db.query(Report).all()
        if not reports:
            return

        rows = [{"url": r.url, "label": "bad"} for r in reports]
        csv_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "community_reports.csv"
        )
        pd.DataFrame(rows).to_csv(csv_path, index=False)

        retrain_model.delay(csv_path)
        logger.info("Retrain task dispatched with %d community reports", len(rows))
    except Exception as e:
        logger.error("Failed to dispatch retrain task: %s", e)