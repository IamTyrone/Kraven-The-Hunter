from pydantic import BaseModel
import joblib
import pandas as pd
from features.features import Cleaner
from utils.predictor import predict
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session
import sqlalchemy
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse




app = FastAPI()

origins = ["http://localhost:5174"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = sqlalchemy.orm.declarative_base()


# Database model
class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True) # User's  Email
    url = Column(String) # The reported URL
    threat_category = Column(String) # The reported URL

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# Pydantic model for request data
class ReportCreate(BaseModel):
    email: str
    url: str
    threat_category: str

# Pydantic model for response data
class ReportResponse(BaseModel):
    id: int
    email: str
    url: str
    threat_category: str

class URL(BaseModel):
    url: str

model = joblib.load("models/DecisionTree.pkl")

def valid_url(url: str) -> bool:
    parsed_url = urlparse(url)
    return all([parsed_url.scheme, parsed_url.netloc])

def is_shopping_website(url: str) -> bool:
    try:
        with open('myshopping.txt', 'r') as file:
            websites = file.read().splitlines()
            return url in websites
    except FileNotFoundError:
        print("The file 'myshopping.txt' was not found.")
        return False
    

@app.post("/prediction")
async def root(url: URL, db: Session = Depends(get_db)):
    url_is_valid = valid_url(url.url)

    if url_is_valid is False: return {"error": "Invalid URL.", "category":"invalid"}
    if is_shopping_website(url.url): return {"error": "Shopping websites are not allowed.", "category":"shopping"}

    url_reported = db.query(Report).filter(Report.url == url.url).first()

    if url_reported is not None:
        return {"status": True, "category": url_reported.threat_category}

    cleaner = Cleaner("")
    
    url_length = [len(url.url)]
    digit_quantity = [cleaner.digit_quantity(url.url)]
    numerical_percantage = [cleaner.digit_quantity(url.url)/len(url.url)]
    special_character_count = [cleaner.special_character_count(url.url)]
    special_character_percantge = [cleaner.special_character_count(url.url)/len(url.url)]
    has_shortining_service = [cleaner.shortining_service(url.url)]

    new_data= pd.Series({"url_length": url_length[0], "digit_quantity": digit_quantity[0], "numerical_percantage": numerical_percantage[0], "special_character_count": special_character_count[0], "special_character_percantge": special_character_percantge[0], "has_shortining_service": has_shortining_service[0]})

    prediction = predict(model, new_data)

    data = {"status": False, "category":"Benign"}
    if prediction == 0:
        return data
    
    return {"status": True, "category":"Malicious"}

# API endpoint to create a report
@app.post("/reports", response_model=ReportResponse)
async def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = Report(**report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

# API endpoint to get all reports
@app.get("/reports")
async def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()