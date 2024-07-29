# Supply Chain Management System

## Overview

This project is a web-based Supply Chain Management System built using React for the frontend and Node.js with Express for the backend. It incorporates blockchain technology to ensure transparency and immutability of supply chain data.

## Features

- User Authentication (Login/Register)
- Product Management
- Order Tracking
- Blockchain Integration for Data Integrity
- RESTful API

## Technologies Used

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: PostgreSQL
- Blockchain: Custom implementation
- Authentication: JSON Web Tokens (JWT)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   cd backend
   Copy2. Install dependencies:
   npm install
   Copy3. Set up your PostgreSQL database and update the `.env` file with your database credentials.
2. Run database migrations (if applicable).
3. Start the backend server:
   npm start
   Copy

### Frontend Setup

1. Navigate to the frontend directory:
   cd frontend
   Copy2. Install dependencies:
   npm install
   Copy3. Start the React development server:
   npm start
   Copy

## Usage

After starting both the backend and frontend servers:

1. Open your browser and go to `http://localhost:3000`
2. Register a new user account or log in with existing credentials
3. Explore the various features of the application

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/products - Get all products
- POST /api/products - Add a new product
- GET /api/orders - Get all orders
- POST /api/orders - Create a new order
- GET /api/blockchain - Get blockchain entries
- POST /api/blockchain - Add a new blockchain entry

## Future Enhancements

- Implement more advanced blockchain features
- Add user roles and permissions
- Improve UI/UX
- Implement comprehensive error handling and form validation
- Add data visualization for supply chain analytics

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License

[MIT License](https://opensource.org/licenses/MIT)

## Contact

Your Name - [Your Email]

Project Link: [https://github.com/Ferrisama/Supply-chain-project](https://github.com/Ferrisama/Supply-chain-project)
