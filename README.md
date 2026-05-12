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
