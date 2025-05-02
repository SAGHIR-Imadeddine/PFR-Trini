# Gym Management System - Docker Setup

This guide explains how to run the Gym Management System using Docker.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git (to clone the repository)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gym-management-system
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   NEXTAUTH_SECRET=your-secret-key-here
   ```
   
   Replace `your-secret-key-here` with a secure random string.

3. Build and start the Docker containers:
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the Next.js application container
   - Start a MongoDB container
   - Connect them via a Docker network

4. The application will be available at: http://localhost:3000

## Using MongoDB Atlas Instead of Local MongoDB

If you prefer to use MongoDB Atlas:

1. Update the `docker-compose.yml` file:
   ```yaml
   environment:
     - DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-address>/gym-management?retryWrites=true&w=majority
     - NEXTAUTH_URL=http://localhost:3000
     - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
   ```

2. Remove the MongoDB service from the `docker-compose.yml` file.

## Managing the Application

- To stop the containers:
  ```bash
  docker-compose down
  ```

- To view logs:
  ```bash
  docker-compose logs -f
  ```

- To restart the application:
  ```bash
  docker-compose restart app
  ```

## Data Persistence

The MongoDB data is stored in a Docker volume named `mongo-data`, ensuring your data persists between container restarts.

## Production Deployment

For production deployment, make sure to:

1. Use a proper domain for the `NEXTAUTH_URL`
2. Generate a strong, unique `NEXTAUTH_SECRET`
3. Set up proper authentication for your MongoDB instance
4. Consider using a managed MongoDB service like MongoDB Atlas 