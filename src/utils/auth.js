import { verifyToken } from './jwtUtil.js'

// next helps to pass control to route handler aka endpoint
function authenticate(req, res, next) {
    const authHeader =  req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    
    if (token == null) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
    }
    
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to the request object
    next(); // Pass control to the next handler
  } catch (err) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Unauthorized' }));
  }

}

export {authenticate};