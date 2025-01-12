#!/bin/bash

# Variables
USERNAME="apokryphos97"
VERSION="latest"

# Login a Docker Hub
docker login

# Construir imágenes individuales
echo "Construyendo imágenes de Docker..."
docker build -t $USERNAME/promtior-frontend:$VERSION -f frontend/Dockerfile .
docker build -t $USERNAME/promtior-backend:$VERSION -f backend/Dockerfile .

# Publicar imágenes
echo "Publicando imágenes en Docker Hub..."
docker push $USERNAME/promtior-frontend:$VERSION
docker push $USERNAME/promtior-backend:$VERSION

echo "¡Publicación completada!"