FROM python:3.9-slim

WORKDIR /app

# Copy requirements first (optimize layer caching)
COPY api/requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and manage.py
COPY api /app/api
COPY manage.py /app/

# Expose the default Django port
EXPOSE 8000

# Run the development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
