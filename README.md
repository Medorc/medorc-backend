# Medorc Backend ⚙️

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

This repository contains the backend server for the Medorc application. It's responsible for handling all API requests, managing the database, and implementing the core business logic for user authentication, medical record management, and data security.

***

### ## Key Features ✨

* **User Management**: Secure registration and authentication for Patients, Doctors, Hospitals, and Externs using JWT.
* **Medical Records CRUD**: Full create, read, update, and delete functionality for patient medical records.
* **Role-Based Access Control**: Different user roles have distinct permissions to ensure data privacy.
* **Secure File Uploads**: Manages uploads for documents and photos via a cloud service.
* **NLP Query Engine**: An endpoint to process natural language queries about medical data.

***

### ## Tech Stack 🛠️

* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: JSON Web Tokens (JWT)
* **Containerization**: Docker

***

### ## Project Structure

<details>
<summary>Click to view the folder structure</summary>

```
medorc-backend/
├── .github/
│   └── workflows/          # CI/CD pipeline
├── docs/
│   └── ERD.png  
├── prisma/
│   ├── schema.prisma       # Your Prisma schema file
│   └── migrations/         # Database migration history
├── src/
│   ├── api/
│   │   ├── routes/
│   │   └── controllers/
│   ├── services/
│   ├── middleware/
│   └── config/
├── .env.example
├── .gitignore
├── Dockerfile
└── README.md
```

</details>

***

### ## Getting Started 🚀

#### **Prerequisites**

* Node.js (v18.x or later)
* npm
* PostgreSQL
* Docker (Optional)

#### **Running the Server**

1.  After cloning and installing dependencies, create a `.env` file from the `.env.example` and update your database credentials.
2.  Apply the database schema using Prisma Migrate:
    ```sh
    npx prisma migrate dev
    ```
3.  Start the server:

    * For development mode:
        ```sh
        npm run dev
        ```
    * For production mode:
        ```sh
        npm start
        ```
The server should now be running on `http://localhost:3001`.

***

### ## API Documentation 📖

The complete API documentation, including all available endpoints, request bodies, and response examples, is available at the following link:

**[Medorc API Documentation](https://docs.google.com/document/d/1_0VqE66-1hCNpXX5OjxllHPozxGuecFO5q1P0cgRfts/edit?usp=sharing)**

***

### ## Contributing 🤝

Please refer to our contribution guidelines before submitting a pull request. We follow the GitFlow branching model. All pull requests must be reviewed and approved by at least one other team member.
