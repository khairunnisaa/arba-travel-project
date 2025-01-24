# Arba Travel Project

## Overview
**Arba Travel** is a web application that allows users to create posts with captions and images, interact with other users through comments, and manage their data securely using JWT-based authentication. The project is containerized using Docker for easy deployment and scalability.

## Features
- **User Authentication**: Register, login, and token-based authentication using JWT.
- **Post Management**: Users can create, edit, delete, and view posts with captions and images.
- **Comment Management**: Users can comment on posts, edit, and delete their comments.
- **Interactive Dashboard**: A user-friendly interface to manage posts and comments.
- **Docker Support**: Fully containerized using Docker Compose for seamless setup and deployment.

## Technologies Used
- **Backend**: Python, Django, Django REST Framework
- **Frontend**: React.js, Axios, Bootstrap
- **Database**: SQLite 
- **Containerization**: Docker, Docker Compose

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your machine:
- Docker
- Docker Compose
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/khairunnisaa/arba-travel-project.git
cd arba-travel-project
```

### Step 2: Setup Environment Variables
Create a `.env` file in the project root and add the following variables:
```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=*
DATABASE_URL=sqlite:///db.sqlite3
```

### Step 3: Build and Run the Docker Containers
Use Docker Compose to build and run the project:
```bash
docker-compose up --build
```

This will:
- Start the Django backend server on `http://127.0.0.1:8000/`
- Start the React frontend server on `http://localhost:3000/`

### Step 4: Access the Application
1. Navigate to the frontend: [http://localhost:3000](http://localhost:3000)
2. Test the API using tools like Postman at: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

### Step 5: Run Migrations
Inside the backend container, run the migrations to set up the database:
```bash
docker exec -it <backend_container_id> bash
python manage.py migrate
```

### Step 6: Collect Static Files
Run the following to collect static files:
```bash
docker exec -it <backend_container_id> bash
python manage.py collectstatic --noinput
```

## API Endpoints
Here are the key endpoints:

### Authentication
- `POST /api/register/`: Register a new user.
- `POST /api/token/`: Obtain a JWT token for authentication.

### Posts
- `GET /api/posts/`: List all posts.
- `POST /api/posts/`: Create a new post.
- `PUT /api/posts/<post_id>/`: Update a post.
- `DELETE /api/posts/<post_id>/`: Delete a post.

### Comments
- `GET /api/posts/<post_id>/comments/`: List comments on a post.
- `POST /api/posts/<post_id>/comments/`: Add a comment to a post.
- `PUT /api/comments/<comment_id>/`: Update a comment.
- `DELETE /api/comments/<comment_id>/`: Delete a comment.
