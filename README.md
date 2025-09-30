# Intelli-Task AI (Java / Spring Boot Edition)

This repository contains the complete source code for Intelli-Task AI, a secure, full-stack task management application, built with a robust and scalable Java/Spring Boot architecture.

## Live Demo & Project Status

Check out the deployed version of Intelli-Task AI:  
🌐 [Deployed Website](https://intelli-task-ai.onrender.com/)  
📽️ [Watch the Live Demo Video](https://drive.google.com/file/d/1253PgBkMQorTb5uiOfDaRMCxyyyl43Y7/view?usp=sharing)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [How to Use](#how-to-use)
- [Project Overview & Key Learnings](#project-overview--key-learnings)
- [Key Technical Challenges](#key-technical-challenges)
- [License](#license)

## Features

- **User Authentication:** Secure signup and login functionality with JWT
- **Multi-User Support:** Each user has their own private to-do list
- **Full CRUD Functionality:** Add, view, complete, and delete to-do items
- **AI Assistant:** Integration with Google Gemini API for:
  - Daily task summaries
  - Distributed, intelligent task priority suggestions
- **Responsive UI:** A modern, mobile-first user interface built with React and Tailwind CSS
- **Persistent Storage:** Reliable data storage in a relational database (MySQL)

## Tech Stack

### Backend
- **Language/Framework:** Java (JDK 17), Spring Boot
- **Security:** Spring Security (for JWT Authentication)
- **Database:** Spring Data JPA, MySQL
- **Build Tool:** Maven
- **Testing:** JUnit
- **DevOps:** Docker, Cloud Deployment (Render, AWS), CI/CD with GitHub Actions

### Frontend
- **Library/Framework:** React, Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API

## Project Structure

The project follows a standard Maven architecture to ensure a clean separation of concerns:

```
intellitask-backend/
├── src/main/java/com/taskpilot/intellitask_backend/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── repository/
│   ├── service/
│   └── security/
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Setup & Installation

### Prerequisites
- Java JDK (v17+)
- Apache Maven
- Node.js (v18+) for the frontend
- A MySQL-compatible database (local server or cloud instance from PlanetScale/TiDB Cloud/AWS RDS)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/SACHDEVA-GARV/Intelli-Task-AI-Java.git
cd intelli-task-backend

# Create your application.properties file in src/main/resources/
# and fill in your database and API key details

# Run the application
mvn spring-boot:run
### Frontend Setup

```bash
# In a new terminal
git clone <your-frontend-repo-link>
cd todo-frontend
npm install
npm run dev
```
## Environment Variables

Create an `application.properties` file in `src/main/resources/` with the following keys:

```properties
# Server Configuration
server.port=3001

# Database Configuration
spring.datasource.url=your_mysql_jdbc_connection_string

# Security Configuration
jwt.secret=your_strong_jwt_secret_key

# API Configuration
gemini.api.key=your_google_ai_studio_api_key
```

## How to Use

1. Sign up for a new account
2. Log in with your credentials
3. Add, complete, or delete to-do items
4. Click "Summarize My Day" to get AI-powered prioritization and summaries

## Project Overview & Key Learnings

This project was undertaken to build an enterprise-grade application by migrating a successful MERN stack prototype to the Java/Spring Boot ecosystem. Key learnings include:

- Architecting a highly scalable, type-safe backend
- Implementing robust security patterns with Spring Security and JWT
- Mastering containerization with Docker and cloud deployment workflows
- Applying SDLC best practices, including unit testing with JUnit and automation with CI/CD pipelines
- Deepening knowledge of relational database design and Object-Relational Mapping (ORM) with Spring Data JPA

## License

This project is for educational and portfolio purposes.