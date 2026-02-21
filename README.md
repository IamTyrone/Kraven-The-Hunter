# Kraven The Hunter

Kraven is an open-source, ML-powered threat detection platform that protects users against phishing, malware, and other malicious websites. It combines a **RandomForest classifier**, a **FastAPI backend**, a **React web dashboard**, and a **Chrome extension** that scans URLs in real time and warns users before they visit dangerous sites.

---

## Features

- **Real-time URL scanning** — 14 engineered features (entropy, IP detection, subdomain count, path depth, shortener detection, HTTPS check, and more) fed into a scikit-learn RandomForest model with confidence scores.
- **Chrome extension** — Content script auto-scans every page; popup lets you scan on demand and view results (category, confidence, source) inline without leaving the browser.
- **Community reporting** — Users can report malicious URLs via the web dashboard or extension. Reports are stored in SQLite and feed back into the model.
- **Async retraining** — After a configurable number of community reports, a Celery task (via RabbitMQ) automatically retrains the model with the new data.
- **Hot-reload** — The API detects when the model file changes on disk and reloads it without restarting.
- **Confidence gating** — The extension only redirects to the warning page when confidence ≥ 85%.

---

## Tech Stack

| Layer                | Technology                                               |
| -------------------- | -------------------------------------------------------- |
| **ML Model**         | scikit-learn RandomForestClassifier (`predict_proba`)    |
| **Backend API**      | FastAPI, Uvicorn, SQLAlchemy, SQLite                     |
| **Async Workers**    | Celery 5 + RabbitMQ                                      |
| **Frontend**         | React 18, Vite, TailwindCSS, Flowbite, Framer Motion     |
| **Extension**        | Chrome Manifest V3 (content script + popup)              |
| **Containerisation** | Docker Compose (`python:3.11-slim`, `rabbitmq:3-alpine`) |
| **Deployment**       | Vercel (frontend), Docker Compose (backend)              |

---

## Project Structure

```
Kraven/
├── engine/                  # Backend + ML
│   ├── main.py              # FastAPI app — /prediction, /reports, /health
│   ├── train.py             # Training pipeline (merge datasets, RandomForest)
│   ├── celery_worker.py     # Celery app with retrain_model task
│   ├── features/
│   │   ├── features.py      # Feature extraction (extract_features)
│   │   └── data/            # Malware.csv, phishing.csv datasets
│   ├── models/              # Saved model (RandomForest.pkl)
│   ├── utils/               # Legacy decision tree utilities
│   ├── myshopping.txt       # Known shopping site list
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React web dashboard
│   ├── src/
│   │   ├── components/      # Scanner, Warning, ReportingForm, Landing, Navbar
│   │   ├── config.js        # API_URL from environment
│   │   └── App.jsx
│   ├── vercel.json
│   └── package.json
├── extension/               # Chrome extension (Manifest V3)
│   ├── manifest.json
│   ├── index.html           # Popup UI
│   ├── index.js             # Popup logic (inline scan + results)
│   ├── navigate.js          # Content script (auto-scan on page load)
│   ├── service-worker.js
│   └── style.css
├── docker-compose.yml       # engine, worker, rabbitmq services
├── .env                     # Environment variables
└── README.md
```

---

## Getting Started

### Prerequisites

- **Docker** & **Docker Compose** (for the backend)
- **Node.js** ≥ 18 (for the frontend)
- **Google Chrome** (for the extension)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Kraven.git
cd Kraven
```

### 2. Configure environment

The `.env` file at the project root contains:

```env
CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672//
DATABASE_URL=sqlite:///./test.db
RETRAIN_THRESHOLD=5
```

Adjust values as needed. The defaults work out of the box with Docker Compose.

### 3. Start the backend (Docker Compose)

```bash
docker compose up -d --build
```

This starts three services:

| Service    | Description                        | Port             |
| ---------- | ---------------------------------- | ---------------- |
| `engine`   | FastAPI API server                 | `localhost:8000` |
| `worker`   | Celery worker for async retraining | —                |
| `rabbitmq` | Message broker                     | `localhost:5672` |

### 4. Train the model

The model must be trained before predictions will work:

```bash
docker compose exec engine python train.py
```

This merges the Malware and Phishing datasets, extracts features, trains a RandomForest, prints a classification report, and saves the model to `models/RandomForest.pkl`.

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

To point the frontend at a different API host, set the `VITE_API_URL` environment variable:

```bash
VITE_API_URL=https://your-api.example.com npm run dev
```

### 6. Load the Chrome extension

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `extension/` folder.
4. The Kraven shield icon will appear in your toolbar.

---

## API Endpoints

| Method | Path          | Description                                                   |
| ------ | ------------- | ------------------------------------------------------------- |
| `POST` | `/prediction` | Scan a URL — returns `{status, category, confidence, source}` |
| `POST` | `/reports`    | Submit a community threat report                              |
| `GET`  | `/reports`    | List all community reports                                    |
| `GET`  | `/health`     | Health check — returns model load status                      |

### Example

```bash
curl -X POST http://localhost:8000/prediction \
  -H "Content-Type: application/json" \
  -d '{"url": "http://suspicious-site.example.com"}'
```

```json
{
  "status": true,
  "category": "Malicious",
  "confidence": 0.94,
  "source": "ml_model"
}
```

---

## License

This project is open source. See the repository for license details.
