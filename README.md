# rest-todo-app

A simple REST-based ToDo app built using Node.js.
- Project URL: https://roadmap.sh/projects/todo-list-api


## Features

- Create, Read, Update, and Delete (CRUD) tasks
- User authentication using JWT
- Password hashing with Argon2
- MySQL database integration

## Installation

To get started with this project, follow these steps:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/SurenRaj30/rest-todo-app.git
    cd rest-todo-app
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**

    Create a `.env` file in the root directory and add the following environment variables:

    ```env
    DB_HOST=your-database-host
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=your-database-name
    JWT_SECRET=your-jwt-secret
    ```

4. **Run Migrations**

    Ensure you have set up the database schema. If there are migration scripts, run them to set up the database structure.

5. **Start the Application**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## API Endpoints

### Tasks

- **GET /tasks**
  
  Get a list of all tasks.

- **POST /tasks**
  
  Create a new task. Requires authentication.

- **PUT /tasks/:id**
  
  Update an existing task by ID. Requires authentication.

- **DELETE /tasks/:id**
  
  Delete a task by ID. Requires authentication.

### Authentication

- **POST /register**
  
  Register a new user.

- **POST /login**
  
  Authenticate a user and receive a JWT.

## Usage

After starting the application, you can interact with the API using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/). Make sure to include the JWT in the `Authorization` header for endpoints that require authentication.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Argon2](https://github.com/argon2/argon2)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)
