# About this Project

This Project implements a shared todo or shopping list
The goal is to deepen my knowledge with Kubernetes and Docker while learning NodeJS


# Database (Postgres)

### Credentials
Database:  mydb
User:      admin
Password:  password
Port:      5432

### Connect to Database
psql -h localhost -p 5432 -U admin -d tododb

# Start on cluster

## Build Api on Minikube Docker
In /api:
eval $(minikube docker-env)
docker build -t todo-api .
kubectl rollout restart deployment todo-api

### Get URL
minikube service todo-api-service --url 

### Get Logs
kubectl logs deployment/todo-api

# Build Docker Image

# GitHub

## Start Runner on Mac - Needed to run deployment step on my Mac
cd ~/actions-runner
./run.sh

## Actions
git push dev
   ↓
GitHub Actions workflow starts
   ↓
build job runs on GitHub's temporary Ubuntu runner
   ↓
Docker image is built
   ↓
Image is pushed to Docker Hub
   ↓
build job succeeds
   ↓
deploy job starts because of: needs: build
   ↓
deploy job runs on your self-hosted runner on your Mac
   ↓
kubectl rollout restart deployment todo-api
   ↓
Minikube recreates the API Pod
   ↓
new Pod pulls hinrikk/todo-api:latest from Docker Hub


# Mobile
## Run on IOS Simulator
npm run ios 