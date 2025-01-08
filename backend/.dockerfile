FROM python:3.10
WORKDIR /app
COPY ./backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY ./backend ./
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
