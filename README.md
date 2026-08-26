# About this Project


This Project implements a shared notes mobile app
The goal is to deepen my knowledge with Kubernetes and Docker while learning NodeJS
I use React native for the Frontend


# Database (Postgres)

## Credentials
Database:  mydb
User:      admin
Password:  password
Port:      5432

## Connect to Database
psql -h localhost -p 5432 -U admin -d tododb


# Build Docker Image
docker build -t hinrikk/todo-api:latest .              
docker push hinrikk/todo-api:latest  


# Automatic Deployment Workflow

## Start Runner on Mac - Needed to run deployment step on my Mac
cd ~/actions-runner
./run.sh

- Push feature branch
- Github notices push -> checks if specified workflow fits branch
   - workflows are speciified under ./github/workflows
- deploy workflow starts
   - build job:
      - runs on temporary GitHub machine
      - builds and pushed docker image with feature branch as tag
   - deploy job:
      - runs on self hosted GitHub runner
      - executes kubectl commands
         - create namespace, apply, set image, rollout

Note: API is connected to shared database
