# BookBay Microservices - Complete Setup Guide

## 🚀 Step-by-Step Setup Instructions

### Prerequisites
1. Install **Node.js 18+** from [nodejs.org](https://nodejs.org)
2. Install **Docker Desktop** from [docker.com](https://docker.com)
3. Install **VS Code** (recommended)

### Step 1: Create Project Structure
```bash
mkdir bookbay-microservices
cd bookbay-microservices

# Create all directories
mkdir -p services/user-service/src/{models,controllers,services,routes,middleware}
mkdir -p services/catalog-service/src/{models,schema,resolvers,services}
mkdir -p services/order-service/src/{models,controllers,services,routes}
mkdir -p services/review-service/src/{models,controllers,services,routes}
mkdir -p services/api-gateway/src/{routes,middleware}
```

### Step 2: Initialize Each Service
```bash
# Initialize user-service
cd services/user-service
npm init -y
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install -D @types/node @types/express @types/bcrypt @types/jsonwebtoken typescript ts-node nodemon

# Initialize catalog-service
cd ../catalog-service
npm init -y
npm install express mongoose apollo-server-express graphql redis cors dotenv
npm install -D @types/node @types/express @types/redis typescript ts-node nodemon

# Initialize order-service
cd ../order-service
npm init -y
npm install express mongoose amqplib cors dotenv
npm install -D @types/node @types/express @types/amqplib typescript ts-node nodemon

# Initialize review-service
cd ../review-service
npm init -y
npm install express mongoose cors dotenv
npm install -D @types/node @types/express typescript ts-node nodemon

# Initialize api-gateway
cd ../api-gateway
npm init -y
npm install express http-proxy-middleware express-rate-limit jsonwebtoken cors dotenv
npm install -D @types/node @types/express @types/jsonwebtoken typescript ts-node nodemon

cd ../..
```

### Step 3: Run Services in Development

**Terminal 1 - Databases:**
```bash
docker-compose up mongodb redis rabbitmq
```

**Terminal 2 - User Service:**
```bash
cd services/user-service && npm run dev
```

**Terminal 3 - Catalog Service:**
```bash
cd services/catalog-service && npm run dev
```

**Terminal 4 - Order Service:**
```bash
cd services/order-service && npm run dev
```

**Terminal 5 - Review Service:**
```bash
cd services/review-service && npm run dev
```

**Terminal 6 - API Gateway:**
```bash
cd services/api-gateway && npm run dev
```

### Step 4: Test the APIs

**1. Register a User:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"John Doe"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**3. Query Books (GraphQL):**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query":"{ books { id title author price } }"}'
```

**4. Create Order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"bookIds":["book1","book2"],"total":49.98}'
```

### Step 5: Production Deployment
```bash
# Build and run all services
docker-compose up --build

# Services will be available at:
# - API Gateway: http://localhost:3000
# - User Service: http://localhost:3001
# - Catalog Service: http://localhost:3002
# - Order Service: http://localhost:3003
# - Review Service: http://localhost:3004
```

## 🎯 Service Endpoints

### API Gateway (Port 3000)
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `POST /graphql` - GraphQL queries for books
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user orders
- `POST /api/reviews` - Add review
- `GET /api/reviews/book/:bookId` - Get book reviews

### Direct Service Access (Development Only)
- User Service: `http://localhost:3001`
- Catalog Service: `http://localhost:3002`
- Order Service: `http://localhost:3003`
- Review Service: `http://localhost:3004`

## 📁 Project Structure
```
bookbay-microservices/
├── services/
│   ├── user-service/
│   ├── catalog-service/
│   ├── order-service/
│   ├── review-service/
│   └── api-gateway/
├── docker-compose.yml
└── README.md
```

## 🔧 Common Issues & Solutions

**MongoDB Connection Issues:**
- Make sure Docker is running
- Check if MongoDB container is healthy: `docker ps`
- Restart containers: `docker-compose restart mongodb`

**Port Already in Use:**
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or change port in service configuration

**JWT Token Issues:**
- Make sure to use the token from login response
- Include "Bearer " prefix in Authorization header

**Redis Connection Failed:**
- Restart Redis container: `docker-compose restart redis`
- Check Redis logs: `docker logs bookbay_redis`

