import { connectToDatabase } from "../../configuration/database_config.js";

async function createTask(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const taskData = JSON.parse(body);
            // user id from jwt token
            const userId = req.user.id;

            // get db connection
            const connection = await connectToDatabase();

            // insert task to db
            const [result] = await connection.execute(
                'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
                [taskData.title, taskData.description, userId]
            );

            // close connection once done
            await connection.end();

            // respond to client
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id: result.insertId, ...taskData }));

        } catch (err) {
            console.error('Error creating task: ', err.stack);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'An error occurred' }));
        }
    })
}

async function getTasks(req, res) {  
  try {

      // Default values for pagination
      const queryParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
      const page = parseInt(queryParams.get('page')) || 1;
      const limit = parseInt(queryParams.get('limit')) || 10;
      const offset = (page - 1) * limit;

      console.log("check limit "+limit);
      console.log("check offset "+offset);

      const userId = req.user.id;

      // get db connection
      const connection = await connectToDatabase();

       // Fetch total count of tasks for the user
       const [totalRows] = await connection.execute(
        'SELECT COUNT(*) AS count FROM tasks WHERE user_id = ?',
        [userId]
      );
      const totalTasks = totalRows[0].count;

      // Fetch paginated tasks (use template literals for limit and offset)
      const [tasks] = await connection.execute(
        `SELECT id, title, description FROM tasks WHERE user_id = ? LIMIT ${limit} OFFSET ${offset}`,
        [userId]
      );

      await connection.end();

      // Send paginated response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
          tasks,
          page: page,
          limit: limit,
          total: totalTasks
         
      }));
    } catch (err) {
        console.error('Error getting all task: ', err.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred' }));
    }
  
}

async function deleteTaskById(req, res) {
    // get id from url
    const urlParts = req.url.split('/');
    const id = urlParts[3];
    const userId = req.user.id;

    if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ID is required' }));
        return;
      }
    
    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
          'DELETE FROM tasks WHERE id = ? AND user_id = ?', 
          [id, userId]);
    
        // if task with that id does not exist
        if (result.affectedRows === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Forbidden' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Task deleted successfully' }));
        }

        await connection.end();

    } catch (err) {
        console.error('Error when deleting task: ', err.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred' }));
    }
}

async function updateTask(req, res) {
    const urlParts = req.url.split('/');
    const id = urlParts[3];
    
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ID is required' }));
      return;
    }
  
    let body = '';
  
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
        try {
          const updatedTaskData = JSON.parse(body);
          // get user id from token
          const userId = req.user.id;
         
          const connection = await connectToDatabase();
    
          // Update the task in the database
          const [result] = await connection.execute(
            'UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?',
            [updatedTaskData.title, updatedTaskData.description, id, userId]
          );

          // check if there are no change to result
          if (result.affectedRows === 0) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Forbidden' }));
            return;
          }
    
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Task updated successfully' }));
    
          await connection.end();
        } catch (err) {
          console.error('Error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'An error occurred' }));
        }
      });


  
}


export {createTask, getTasks, updateTask, deleteTaskById};
