import { connectToDatabase } from "../../configuration/database_config.js";
import argon2 from 'argon2';
import { generateToken, verifyToken } from '../utils/jwtUtil.js';

// register user
async function register(req, res) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const {username, email, password} = JSON.parse(body);
            // hash password
            const hashedPassword = await argon2.hash(password);

            const connection = await connectToDatabase();
            // insert to db
            const [result] = await connection.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );
            
            await connection.end();
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: generateToken(result.id)}));

        } catch (err) {
            console.error('Error registering user:', err.stack);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'An error occurred' }));
        }
    })
}

// login and generate jwt token
async function login(req, res) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const {username, password} = JSON.parse(body);

            const connection = await connectToDatabase();
            const [result] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
            
            //close db connection
            connection.end();

            // check for if user cred does not exist
            if (result.length === 0) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
                return;
            }

            const user = result[0];
            const match = await argon2.verify(user.password, password);

            // check for if user cred is invalid
            if (!match) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
                return;
            }

            // generate jwt token
            const token = generateToken(user.id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token }));

        } catch (err) {
            console.error('Error registering user:', err.stack);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'An error occurred' }));
        }
    })


}

export {register, login};