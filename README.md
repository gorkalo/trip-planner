
# Bizaway trip-planner API with Swagger documentation

This project is an Express.js-based RESTful API for trip planification

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Running the API](#running-the-api)
  - [Accessing Swagger UI](#accessing-swagger-ui)
- [API Endpoints](#api-endpoints)
- [Testing with Swagger](#testing-with-swagger)
- [Contributing](#contributing)
- [License](#license)
- [Additional Notes](#additional-notes)

---

## Overview

This is a RESTful API built using Express.js, The API is fully documented using Swagger, and you can easily interact with the API directly from Swagger UI.

The API supports multiple HTTP methods (`GET`, `POST`, `DELETE`) for various endpoints. Swagger provides a user-friendly interface for exploring and testing these endpoints.

---

## Getting Started

To set up the project on your local machine, follow the instructions below.

### Prerequisites

Ensure you have the following software installed:

- [Node.js](https://nodejs.org/) (version 22 or later)
- [npm](https://www.npmjs.com/) (Node.js package manager)

You can verify if Node.js and npm are installed by running the following commands in your terminal:

```bash
node -v
npm -v
```

If Node.js or npm are not installed, download and install them from the official websites.

### Installation

1. **Clone the repository:**

   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/gorkalo/trip-planner.git
   cd trip-planner
   ```

2. **Install dependencies:**

   Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   The application relies on environment variables for various configurations (e.g., port number, database connection string). You can create a `.env` file in the root directory of the project, based on the example below:

   ```env
    TRIPS_API_KEY=trip-api-key
    PORT=8000
    DATABASE_URL='postgres://user:password@host:port/database'
    DATABASE_URL_SHADOW='postgres://user:password@host:port/database?schema=shadow_schema'
    JWT_SECRET='jwt-secret-key'
    NODE_ENV='development'
   ```
---

## Usage

### Running the API

Once the dependencies are installed and configuration is set, you can run the API server.

To start the Express server:

```bash
npm start
```

This will start the server on the port specified in the `.env` file (default is `8000` if not set).

You should see a message like this indicating the server is running:

```bash
Server is running on http://localhost:8000
```

---

### Accessing Swagger UI

Once the server is running, you can access the Swagger UI to interact with the API endpoints.

1. Open your web browser.
2. Go to `http://localhost:8000/docs`.

This will load Swagger UI, where you can see and interact with all available API endpoints. The interface allows you to test each endpoint directly from the browser, send requests, and view the responses.

## Testing with Swagger

Swagger UI provides a convenient way to test the API without writing any code. Here's how to test the API:

1. **Open Swagger UI**: Go to `http://localhost:8000/docs` in your browser.
2. **Select an endpoint**: Find the endpoint you want to test.
3. **Fill in parameters**: For endpoints that require parameters or request bodies, use the **"Try it out"** button to input the necessary data.
4. **Authentication (if required)**:
   - Some endpoints are **protected** and require authentication (e.g. /save-trip, /saved-trips, /delete-trip).
   - You need to first **sign up** or **log in** to get your JWT token.
     - Use the `POST /api/signup` endpoint to create a new user, or the `POST /api/login` endpoint to log in if you already have an account.
     - After a successful login/signup, you will receive a token in the response body.
5. **Authorize with the token**:
   - Once you have the JWT token, click on the **"Authorize"** button in Swagger UI (located at the top right).
   - In the dialog that appears, enter your token and click **"Authorize"**.
6. **Send the request**: After you have authorized, click **"Execute"** to send the request to the API.
7. **View the response**: Swagger will display the response, including status codes, headers, and the body.

Testing with Swagger is easy and allows you to experiment with all the available endpoints. Just ensure you're authenticated for the protected routes!

---

## Contributing

Contributions to the project are always welcome! If you want to contribute, please follow these steps:

1. **Fork the repository**: Create your own fork of this repository.
2. **Create a branch**: For each new feature or bug fix, create a new branch from `master`:

   ```bash
   git checkout -b feature-branch
   ```

3. **Make your changes**: Implement your feature or fix the bug.
4. **Commit your changes**: Write a descriptive commit message and commit your changes:

   ```bash
   git commit -am 'Add new feature or fix bug'
   ```

5. **Push your changes**: Push your branch to your fork:

   ```bash
   git push origin feature-branch
   ```

6. **Open a pull request**: Go to the original repository and open a pull request with a description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## Additional Notes

- **Cross-Origin Resource Sharing (CORS)**: If you plan to use the API with a frontend application hosted on a different domain, ensure that CORS is properly configured. You can use the `cors` package to enable CORS.
  
  Example:
  ```bash
  npm install cors
  ```

  And in your Express app:
  ```js
  const cors = require('cors');
  app.use(cors());
  ```
