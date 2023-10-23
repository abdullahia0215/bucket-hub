const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// POST route to create a new group
router.post('/', rejectUnauthenticated, (req, res) => {
    // Extract group data from the request body
    const { group_name } = req.body;
  
    // Get the ID of the user who created the group
    const creator_id = user_id; // Assuming req.user.id contains the user's ID
  
    // Define the SQL query to insert a new group into the "groups" table
    const queryText = 'INSERT INTO "groups" ("group_name", "creator_id") VALUES ($1, $2) RETURNING *';
  
    // Execute the SQL query with the group name and creator_id as parameters
    pool.query(queryText, [group_name, creator_id])
      .then((result) => {
        // Send the newly created group as the response
        res.status(201).json(result.rows[0]);
      })
      .catch((error) => {
        console.error('Error creating group:', error);
        res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
      });
  });
  
  
module.exports = router;
