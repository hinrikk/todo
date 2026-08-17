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

