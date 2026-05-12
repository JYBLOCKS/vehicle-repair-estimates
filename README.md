# Vehicle Repair Estimates

## How to run the project (candidate steps)

Inside of api folder and client folder, create the required files, including:

.env (you can copy from .env.sample)

Once your setup is ready, run the application using Docker:

```shell
docker-compose up --build
```

The application should expose:

API docs at: <http://localhost:8000/docs>

Frontend at: <http://localhost:5173>

> [!IMPORTANT] If Docker is not available, you may run the backend and frontend locally.

download [node.js](https://nodejs.org/en/download) and [python](https://www.python.org/downloads/).

### backend

```shell
cd api
python3 -m venv .venv
source .venv/bin/activate  # on Windows, use .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### frontend

```shell
cd client
npm install
npm run dev
```

## AWS Deployment Outline

- Backend runtime: deploy FastAPI as either ECS Fargate service (containerized, long-running API) or Lambda behind API Gateway (serverless, bursty traffic).
- Frontend hosting: build `client` and publish static assets to S3, then serve globally through CloudFront with HTTPS and cache policies.
- Database: use Amazon RDS (PostgreSQL recommended for production) in private subnets with automated backups and Multi-AZ if higher availability is required.
- Networking: place compute in VPC private subnets; expose only the load balancer/API Gateway and CloudFront to the internet.
- IAM: apply least-privilege roles for CI runner, ECS tasks/Lambda execution role, and deployment automation; avoid long-lived access keys.
- Secrets: store DB credentials, JWT keys, and API secrets in AWS Secrets Manager (or SSM Parameter Store) and inject at runtime.
- CI/CD: use GitHub Actions to run `pytest`, `npm test`, `npm run lint`, `npm run build`, then deploy via IaC (Terraform/CloudFormation/CDK) with separate dev/staging/prod environments.
