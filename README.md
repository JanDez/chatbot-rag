# Project Overview

## Introduction
This project is a web application designed to provide AI-driven chatbot solutions for businesses. It leverages modern technologies to enhance user interaction and streamline communication processes. The application is built using React, TypeScript, Tailwind, Radix, React-Query, React-Router and Vite for the frontend, while the backend is powered by Python with FastAPI, Transformers, Huggingface, TinyLlama, SQLAlchemy, Neon for the PostgreSQL DB.

## Project Structure

### Frontend
The frontend is structured to provide a responsive and interactive user experience. Here’s a breakdown of the key directories and files:

- **`src/`**: Contains the main source code for the application.
  - **`components/`**: Reusable UI components such as `ChatWindow`, `EmailValidationDialog`, and `ChatItem`.
  - **`hooks/`**: Custom hooks like `useChat` for managing chat interactions with the backend.
  - **`pages/`**: Contains the main pages of the application, including `Home` and `AdminDashboard`.
  - **`types/`**: TypeScript interfaces and types for better type safety across the application.
  - **`lib/`**: Utility functions like sentiment analysis.
  
- **`public/`**: Static assets like images and icons.

- **`package.json`**: This file lists dependencies and scripts for building, running, and testing the application.

- **`README.md`**: Documentation for setting up and running the project.

### Backend
The backend is designed to handle API requests and manage data interactions. Key components include:

- **`app/`**: Main application directory.
  - **`api/`**: Contains API routes for handling chatbot interactions.
  - **`services/`**: Business logic and services, including `ChatService` for chat data and behavior.
  - **`data/`**: JSON files for logging conversations and storing company information.
  - **`db/`**: Database models and connection logic.

- **`main.py`**: Entry point for the FastAPI application.

- **`requirements.txt`**: Lists Python dependencies required for the backend.

## Technologies Used
- **Frontend**:
  - **React**: A JavaScript library for building user interfaces.
  - **TypeScript**: A superset of JavaScript that adds static types.
  - **Vite**: A build tool that provides a fast development environment.
  - **Tailwind CSS**: A utility-first CSS framework for styling.
  - **React Query**: For managing server state and caching.

- **Backend**:
  - **FastAPI**: A modern web framework for building APIs with Python.
  - **SQLAlchemy**: For database interactions and ORM.
  - **Pydantic**: For data validation and settings management.

- **Development Tools**:
  - **ESLint**: For linting and maintaining code quality.
  - **Prettier**: For code formatting.
  - **Docker**: For containerization and deployment.

## Features
- **Chatbot Interaction**: Users can interact with a chatbot that responds based on user queries.
- **User Validation**: Users must validate their email before starting a chat.
- **Admin Dashboard**: Admins can view chat activity and user interactions.
- **Sentiment Analysis**: The application analyzes user messages to determine sentiment.

## Getting Started
To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the directory:
   ```bash
   cd repo folder
   ```

3. Build and run the container:
   ```bash
   docker-compose up --build                                           
   ```

4. For the backend, navigate to the backend directory, install dependencies, and run the server.

## Conclusion
This project aims to provide a robust solution for businesses looking to enhance their customer interaction through an RAG GenAI-driven chatbot
