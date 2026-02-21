import os
from celery import Celery

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")

app = Celery("kraven", broker=CELERY_BROKER_URL, backend="rpc://")

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_concurrency=1,
)


@app.task(name="retrain_model", bind=True, max_retries=1)
def retrain_model(self, extra_csv: str = None):
    try:
        from train import run_training

        result = run_training(extra_csv=extra_csv)
        return {"status": "success", "accuracy": result["accuracy"]}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)
