
# Community TimeBank Backend

This is the Node.js, Express, and MongoDB backend for the Community TimeBank application.

## Features

-   **JWT Authentication**: Secure user registration and login.
-   **RESTful API**: Endpoints for managing users, services, jobs, and feedback.
-   **Feedback Analysis**: Automatically detects negative feedback (ratings of 2 stars or less).
-   **Admin Email Alerts**: Sends an email to the site administrator when negative feedback is flagged.
-   **Admin Controls**: Special routes for administrators to manage users (suspend, reactivate, update time balance).

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
-   An email service for sending alerts (e.g., [SendGrid](https://sendgrid.com/), or Gmail with an App Password).

## Setup Instructions

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    -   Rename the `.env.example` file to `.env`.
    -   Open the `.env` file and fill in the required values:
        -   `MONGO_URI`: Your connection string from MongoDB Atlas.
        -   `JWT_SECRET`: A long, random, secret string for signing tokens.
        -   `ADMIN_EMAIL`: The email address where you want to receive alerts.
        -   `EMAIL_*`: Your email provider's SMTP credentials. **If using Gmail, you must use an App Password.**

4.  **Run the server:**
    -   For development (with automatic reloading):
        ```bash
        npm run dev
        ```
    -   For production:
        ```bash
        npm start
        ```

The server will start on the port specified in your `.env` file (default is 5000). The frontend application can now make requests to this server.