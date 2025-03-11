# gestion_PFE_backend

## Description
The `gestion_PFE_backend` project is a backend application for managing "PFE" (Projet de Fin d'Études).

## Prerequisites
- Node.js (version 14 or higher)
- npm (version 6 or higher)
- MySQL database (version 8.0 or higher)

## Technologies Used
- TypeScript (for static typing)
- Express.js
- TypeORM (ORM for database interactions)
- Zod (for data validation)
- dotenv
- swagger-ui (for API documentation)
- eslint (for linting)
- nodemon (for hot reloading)
- prettier (for code formatting)
- morgan (for logging)

## Project Folder Structure
gestion_PFE_backend/
src/
├── controllers/  
├── entities/  
├── middleware/  
├── dtos/  
├── routes/  
├── datasource.ts  # Database connection configuration  
├── index.ts  # Entry point of the application  
package.json  
nodemon.json  # Nodemon configuration  
tsconfig.json  
README.md


## Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory and add the following environment variables example :
    ```
    PORT=3000
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=password
    DB_NAME=gestion_pfe
    ```
   
3. create public and private key for jwt token in the root directory
    ```
openssl genpkey -algorithm RSA -out private.pem
openssl rsa -pubout -in private.pem -out public.pem

    ```
4. Run `npm run dev` to start the development server

## Rules and Guidelines
1. Use `camelCase` for variable names and function names
2. Define handlers functions in the `controllers` directory
3. Define data transfer objects (DTOs) in the `dtos` directory
4. Define functions that intercept requests in the `middleware` directory
5. Define database entities in the `entities` directory
6. Document API endpoints using Swagger and jsDoc
