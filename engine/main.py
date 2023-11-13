from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from features.features import Cleaner

app = FastAPI()


class URL(BaseModel):
    url: str

model = joblib.load("models/decision_tree_classifier.pkl")

def validate_url(url: str) -> bool:
    return True

@app.post("/prediction")
async def root(url: URL):
    url_is_valid = validate_url(url.url)

    if url_is_valid is False: return {"error": "Invalid URL."}
    
    df = pd.DataFrame()
    cleaner = Cleaner("")
    df["url_length"] = [len(url.url)]
    df["digit_quantity"] = [cleaner.digit_quantity(url.url)]
    df["numerical_percantage"] = [cleaner.digit_quantity(url.url)/len(url.url)]
    df["special_character_count"] = [cleaner.special_character_count(url.url)]
    df["special_character_percantge"] = [cleaner.special_character_count(url.url)/len(url.url)]
    df["has_shortining_service"] = [cleaner.shortining_service(url.url)]

    prediction = model.predict(df)

    data = {"status": False, "message":"Benign"}
    if prediction[0] == 0:
        return data
    
    return {"status": True, "message":"Malicious"}