import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

from features.features import extract_features, Cleaner

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MALWARE_CSV = os.path.join(BASE_DIR, "features", "data", "Malware.csv")
PHISHING_CSV = os.path.join(BASE_DIR, "features", "data", "phishing.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "RandomForest.pkl")

FEATURE_COLUMNS = [
    "url_length", "digit_quantity", "numerical_percantage",
    "special_character_count", "special_character_percantge",
    "has_shortining_service", "url_entropy", "has_ip_address",
    "subdomain_count", "path_depth", "has_at_symbol",
    "has_double_slash_redirect", "domain_length", "is_https",
]


def _load_and_normalize(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df.columns = [c.strip().lower() for c in df.columns]
    if "label" not in df.columns:
        raise ValueError(f"CSV {csv_path} missing 'label' column. Found: {list(df.columns)}")
    return df[["url", "label"]]


def run_training(extra_csv: str = None) -> dict:
    print("=" * 60)
    print("  KRAVEN — Model Training Pipeline")
    print("=" * 60)

    # Load and merge datasets
    print("\n[1/4] Loading datasets...")
    df_malware = _load_and_normalize(MALWARE_CSV)
    df_phishing = _load_and_normalize(PHISHING_CSV)
    df = pd.concat([df_malware, df_phishing], ignore_index=True)
    print(f"  Malware:  {len(df_malware):,} rows")
    print(f"  Phishing: {len(df_phishing):,} rows")

    # Merge community reports if provided
    if extra_csv and os.path.exists(extra_csv):
        df_extra = pd.read_csv(extra_csv)
        df_extra.columns = [c.strip().lower() for c in df_extra.columns]
        df = pd.concat([df, df_extra[["url", "label"]]], ignore_index=True)
        print(f"  Community: {len(df_extra):,} rows")

    df = df.drop_duplicates(subset=["url"]).reset_index(drop=True)
    print(f"  Total (deduplicated): {len(df):,} rows")

    # Extract features
    print("\n[2/4] Extracting features...")
    features = df["url"].apply(extract_features)
    X = pd.DataFrame(features.tolist())[FEATURE_COLUMNS]
    y = df["label"].apply(lambda x: 1 if x == "bad" else 0)

    # Train/test split
    print("\n[3/4] Training RandomForest...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    # Evaluate
    print("\n[4/4] Evaluation")
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["benign", "malicious"])
    print(f"  Accuracy: {acc:.4f}")
    print(report)

    # Save model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\n  Model saved to {MODEL_PATH}")
    print("=" * 60)

    return {"accuracy": acc, "model_path": MODEL_PATH}


if __name__ == "__main__":
    run_training()