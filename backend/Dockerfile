FROM python:3.9.13-slim

# Set the working directory
WORKDIR /app

# Install build dependencies and PostgreSQL development files
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker cache
COPY ./backend/requirements.txt ./

# Install dependencies with pip cache cleanup
RUN pip3 install --no-cache-dir -r requirements.txt \
    && rm -rf /root/.cache/pip/*

# Create necessary directories with proper permissions
RUN mkdir -p /app/app/data /app/app/cache/faiss \
    && chmod -R 777 /app/app/cache

# Copy the rest of the application code
COPY ./backend ./

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Ensure data files are in the correct location
RUN if [ -d "/app/backend/app/data" ]; then \
    cp -r /app/backend/app/data/* /app/app/data/; \
    fi

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
ENTRYPOINT ["python", "-m"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]