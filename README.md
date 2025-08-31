
📦 Order Service (Swift Logistics)

The Order Service is a core microservice in the Swift Logistics system.
It handles customer orders, manages their lifecycle (creation, status updates), and publishes events to other services using the Outbox Pattern and RabbitMQ.

🚀 Features

Create new orders with validation (Joi schema).
Update order status (PROCESSING, DELIVERED, etc.).
Fetch order details by ID.
Outbox pattern for reliable event publishing.
Prisma ORM with PostgreSQL.
RabbitMQ integration for async communication.
Structured logging with Pino.
Prometheus metrics for observability.

order-service/
 ├── src/
 │   ├── config/        # DB, RabbitMQ, env
 │   ├── controller/    # Business logic (orders)
 │   ├── routes/        # Express routes
 │   ├── utils/         # Logger, metrics
 │   └── index.js       # App entrypoint
 ├── prisma/
 │   ├── schema.prisma  # DB models
 │   └── migrations/    # DB migrations
 ├── Dockerfile
 ├── docker-compose.yml
 ├── .env
 └── README.md

🛠️ Tech Stack

Runtime: Node.js (JavaScript, ES Modules)
Framework: Express.js
Database: PostgreSQL (via Prisma ORM)
Messaging: RabbitMQ
Logging: Pino
Monitoring: Prometheus client

Clone the repository >>>

Make the DATABASE_URL inorder to your configurations in .env file(.env.example)

Run in docker
docker-compose up --build

📖 API Reference
Health Check
GET /health

Create Order
POST /orders

Request Body:

{
  "clientId": "C1",
  "pickupAddress": { "street": "A", "city": "X", "postalCode": "1000" },
  "deliveryAddress": { "street": "B", "city": "Y", "postalCode": "2000" },
  "packageDetails": { "weightKg": 2.5 }
}


Get Order by ID
GET /orders/:id


Response:

{
  "id": "uuid",
  "clientId": "C1",
  "pickupAddress": { "street": "A", "city": "X", "postalCode": "1000" },
  "deliveryAddress": { "street": "B", "city": "Y", "postalCode": "2000" },
  "packageDetails": { "weightKg": 2.5 },
  "status": "PROCESSING",
  "createdAt": "2025-08-30T...",
  "updatedAt": "2025-08-30T..."
}

Update Order Status
PUT /orders/:id/status


Request Body:

{ "status": "DELIVERED" }


Response:

{
  "orderId": "uuid",
  "status": "DELIVERED"
}

📊 Metrics

Exposed at:

GET /metrics


Prometheus-compatible metrics, e.g.:

orders_created_total 5
orders_failed_total 1

🧪 Testing

Use Postman
