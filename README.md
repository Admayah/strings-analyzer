# Strings Analyzer API

  A simple NestJS API for storing, retrieving, filtering, and analyzing string data — including natural language queries like _“strings longer than 10 characters”._

---

## Features
  - Create and retrieve strings
  - Delete specific strings
  - Query strings with natural language (e.g., _"strings longer than 5 characters"_)
  - Filter and count results
  - Express + TypeScript + NestJS structure

---

##  Tech Stack
  - **Node.js** (v18+)
  - **NestJS**
  - **TypeScript**
  - **Express** (via NestJS)
  - **dotenv** for environment configuration

## Setup Instructions

###  Clone the repository

git clone https://github.com/<your-username>/string-api.git
  cd string-api
  npm install
  cp .env.example .env

### Example .env.example file
  # .env
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_USER=postgres
  DATABASE_PASSWORD=your_password_here
  DATABASE_NAME=string_analyzer
  PORT=3005

### Run the server locally
  npm run start:dev

