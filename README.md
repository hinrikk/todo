# About this Project

This Project implements a shared todo or shopping list

The goal is to deepen my knowledge with Kubernetes and Docker while learning NodeJS


# How to Start

## API
In /todo/api:
node server.js


## Database (Postgres)

### Credentials
Database:  mydb
User:      admin
Password:  password
Port:      5432

### Run Docker
docker run --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres

### Connect to Database
psql -h localhost -p 5432 -U admin -d tododb




# Start on cluster

## Build Api on Minikube Docker
In /api:
eval $(minikube docker-env)
docker build -t todo-api .

kubectl rollout restart deployment todo-api

