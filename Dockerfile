FROM python:3.11-slim

WORKDIR /app

COPY python-ai/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY python-ai/ .

EXPOSE 5000

CMD ["python", "app.py"]
