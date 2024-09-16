import http from 'http';
import {createTask, getTasks, deleteTaskById, updateTask} from './src/routes/tasks.js';
import {register, login} from './src/routes/users.js'
import {authenticate} from './src/utils/auth.js';
import dotenv from 'dotenv';

// load env variables
dotenv.config();

const port = process.env.HTTP_SERVER_PORT;

// create http server
const server = http.createServer((req, res) => {
    const urlParts = req.url.split('/');
    const method = req.method;
    const path = urlParts.slice(0, 3).join('/'); // Extract base path (e.g., "/tasks")
    // checks for request type
    if (method === 'POST' && path === '/tasks/create') {
        authenticate(req, res, () => createTask(req, res));
    }else if (method === 'GET' && path.startsWith('/tasks/get')) {
        authenticate(req, res, () => getTasks(req, res));
    }else if (method === 'DELETE' && path.startsWith('/tasks/delete')) {
        authenticate(req, res, () => getTasks(req, res));
    }else if (method === 'PUT' && path.startsWith('/tasks/update')) {
        authenticate(req, res, () => updateTask(req, res));
    }else if (method === 'POST' && path === '/users/register') {
        register(req, res);
    }else if (method === 'POST' && path === '/users/login') {
        login(req, res);
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});