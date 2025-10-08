# Geo Processor Microservice

## Overview

This is a simple FastAPI-based microservice that processes a list of geographical coordinates (latitude and longitude). The service calculates the centroid and bounding box of the provided points.

## Endpoints

### `POST /process_geo`

This endpoint receives a JSON object with a list of points (latitude and longitude), validates the data, and returns the centroid and bounding box of the points.

**Request body:**
```json
{
  "points": [
    {"lat": 40.7128, "lng": -74.0060},
    {"lat": 34.0522, "lng": -118.2437}
  ]
}
```

**Response (Success) (status code 200):**
```json
{
  "message": "Results found successfully",
  "results": [
    {
      "centroid": {"lat": 37.3825, "lng": -96.1248},
      "bounds": {
        "north": 40.7128,
        "south": 34.0522,
        "east": -74.0060,
        "west": -118.2437
      }
    }
  ]
}
```

**Response (Validation Error) (status code 400,500):**
```json
{
    "success": false,
    "message": "Value error, Invalid decimal value: . Expected a valid number.",
    "results": {}
}
```

### How to Run

#### Prerequisites

- Python 3.9+ installed
- Docker (optional, for containerization)

#### Docker Setup (Recommended)
1. Clone the repository or download the code.
2. Navigate to the project folder.
3. Build and Start the Service


```bash
docker-compose up --build
```

4. The service will be available at `http://localhost:8000`.
5. Test the Endpoints: You can test the POST /process_geo endpoint using a tool like Postman or cURL.

Example cURL request:
```json
curl -X 'POST' \
  'http://localhost:8000/process_geo' \
  -H 'Content-Type: application/json' \
  -d '{
    "points": [
      {"lat": 40.7128, "lng": -74.0060},
      {"lat": 34.0522, "lng": -118.2437}
    ]
  }'
```

#### Local Development Setup

1. Clone the repository or download the code.
2. Navigate to the project folder.
3. Install the required dependencies:

```bash
pip install -r requirements.txt
```
4. Start the FastAPI app locally with Uvicorn:

```bash
uvicorn app.main:app --reload
```

5. The service will be running at `http://127.0.0.1:8000`. You can test the endpoints using a tool like Postman or cURL.

### Project Structure

The project structure is as follows:

```
geo_processor/
│
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI application setup
│   ├── models/                # Pydantic models for validation
│   │   ├── geo.py
│   │   ├── response.py
│   ├── services/              # Business logic
│   │   ├── geo_service.py
│   ├── controller/             # FastAPI routes
│   │   ├── geo_endpoints.py
│   ├── helpers/               # Helper functions like error handling
│   │   ├── error_handler.py
│   ├── README.md              # Documentation
│   └── requirements.txt       # Dependencies
└── Dockerfile                 # Docker setup for the microservice
└── docker-compose.yml         # Docker Compose configuration
```
