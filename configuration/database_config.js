import mysql from 'mysql2/promise'; // allows to use promise based API

async function connectToDatabase() {
    try {
        // create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Connected to database with ID: ', connection.threadId);
        return connection;

    } catch (err) {
        console.error('Error connecting to database: ', err.stack);
    }
}

// export
export {connectToDatabase};