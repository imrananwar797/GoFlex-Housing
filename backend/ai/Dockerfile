# Use Python 3.11 base image
FROM python:3.11-slim

# Prevent Python from writing pyc files to disk and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install native packages required for image analysis and biometrics (OpenCV dependencies)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy microservice code
COPY . .

# Expose Port 8000 (User specified AI API port)
EXPOSE 8000

# Run Uvicorn server reloadless for production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
