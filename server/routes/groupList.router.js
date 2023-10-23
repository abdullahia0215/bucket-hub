const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require("../modules/authentication-middleware");

// GET all groups
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = "SELECT * FROM groups";
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching groups:", error);
      res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  // Extract group data from the request body
  const { group_name } = req.body;
  const creator_id = req.user.id; // Assuming the user ID is stored in req.user.id

  // Check if the user has already created a group
  const checkQueryText = 'SELECT * FROM "groups" WHERE creator_id = $1';
  pool
    .query(checkQueryText, [creator_id])
    .then((result) => {
      if (result.rows.length > 0) {
        // User has already created a group
        res.status(400).send({ message: 'User can only create one group.' });
        return;
      }

      // Define the SQL query to insert a new group into the "groups" table
      const insertQueryText =
        'INSERT INTO "groups" ("group_name", "creator_id") VALUES ($1, $2) RETURNING *';

      // Execute the SQL query with the group name and creator_id as parameters
      pool
        .query(insertQueryText, [group_name, creator_id])
        .then((insertResult) => {
          // Send the newly created group as the response
          res.status(201).json(insertResult.rows[0]);
        })
        .catch((error) => {
          console.error("Error creating group:", error);
          res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
        });
    })
    .catch((error) => {
      console.error("Error checking user's group:", error);
      res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
    });
});
router.put("/join", rejectUnauthenticated, (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  // First, check if the user is already a member of a group
  pool
    .query('SELECT * FROM user_groups WHERE user_id = $1', [userId])
    .then((result) => {
      if (result.rows.length > 0) {
        // User is already a member of a group
        res.status(400).send({ message: 'User already in a group.' });
        return;
      }

      // If user is not a member of any group, proceed to join them to the new group
      const queryText = "UPDATE user_groups SET group_id = $1 WHERE user_id = $2;";
      pool
        .query(queryText, [groupId, userId])
        .then(() => {
          res.sendStatus(201); // Send a 201 Created status upon successful join
        })
        .catch((error) => {
          console.error("Error joining group:", error);
          res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
        });

    })
    .catch((error) => {
      console.error("Error checking user membership:", error);
      res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
    });
});

router.get("/groupItems"), rejectUnauthenticated, (req, res) => {
    const { groupId, userId } = req.body;
    const queryText = "SELECT FROM group_list WHERE id = $1 AND user_id = $2;";
    pool
        .query(queryText, [groupId, userId])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error("Error executing groupItems query:", error);
            res.sendStatus(500);
        })
    
}
router.get('/check', rejectUnauthenticated, (req, res) => {
    const creatorId = req.user.id; // Assuming the user ID is stored in req.user.id
  
    // Define the SQL query to check if the user has created a group
    const checkQueryText = 'SELECT EXISTS(SELECT 1 FROM "groups" WHERE creator_id = $1)';
    pool
      .query(checkQueryText, [creatorId])
      .then((result) => {
        // Extract the boolean value from the result
        const hasCreatedGroup = result.rows[0].exists;
  
        // Send the response indicating whether the user has created a group or not
        res.status(200).json({ hasCreatedGroup });
      })
      .catch((error) => {
        console.error('Error checking user\'s group:', error);
        res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
      });
  });






module.exports = router;
