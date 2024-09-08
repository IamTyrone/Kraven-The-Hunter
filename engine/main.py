from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from features.features import Cleaner
from utils.predictor import predict

app = FastAPI()


class URL(BaseModel):
    url: str

model = joblib.load("models/DecisionTree.pkl")

def validate_url(url: str) -> bool:
    return True

@app.post("/prediction")
async def root(url: URL):
    url_is_valid = validate_url(url.url)

    if url_is_valid is False: return {"error": "Invalid URL."}

    cleaner = Cleaner("")
    
    url_length = [len(url.url)]
    digit_quantity = [cleaner.digit_quantity(url.url)]
    numerical_percantage = [cleaner.digit_quantity(url.url)/len(url.url)]
    special_character_count = [cleaner.special_character_count(url.url)]
    special_character_percantge = [cleaner.special_character_count(url.url)/len(url.url)]
    has_shortining_service = [cleaner.shortining_service(url.url)]

    new_data= pd.Series({"url_length": url_length[0], "digit_quantity": digit_quantity[0], "numerical_percantage": numerical_percantage[0], "special_character_count": special_character_count[0], "special_character_percantge": special_character_percantge[0], "has_shortining_service": has_shortining_service[0]})

    prediction = predict(model, new_data)

    print(f"Predicted class: {prediction}")

    data = {"status": False, "message":"Benign"}
    if prediction == 0:
        return data
    
    return {"status": True, "message":"Malicious"}