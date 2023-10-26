const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

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
        res.status(400).send({ message: "User can only create one group." });
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

router.post("/join", rejectUnauthenticated, (req, res) => {
  const { groupId, userId } = req.body;
  console.log("Joining group", groupId, "with user", userId);
  // First, check if the user is already part of a group
  pool
    .query("SELECT * FROM user_groups WHERE user_id = $1", [userId])
    .then((result) => {
      if (result.rows.length > 0) {
        console.log("User is already part of a group. Rows returned are:", result.rows);
        // The user is already part of a group, return a message
        res.status(400).send({ message: "User already in a group." });
      } else {
        // If the user isn't part of a group, insert them into the user_groups table
        const insertQuery =
          "INSERT INTO user_groups (group_id, user_id) VALUES ($1, $2)";
        pool
          .query(insertQuery, [groupId, userId])
          .then(() => {
            res.sendStatus(201); // Successfully inserted
          })
          .catch((insertError) => {
            console.error("Error adding user to group:", insertError);
            res.sendStatus(500); // Internal server error
          });
      }
    })
    .catch((error) => {
      console.error("Error checking user membership:", error);
      res.sendStatus(500); // Internal server error
    });
});

router.post("/leave", rejectUnauthenticated, (req, res) => {
  const { groupId, userId } = req.body;

  // Delete the entry from the user_groups table for the specific user and group
  const deleteQuery = "DELETE FROM user_groups WHERE group_id = $1 AND user_id = $2";
  pool
    .query(deleteQuery, [groupId, userId])
    .then(() => {
      res.sendStatus(200); // Successfully left the group
    })
    .catch((error) => {
      console.error("Error removing user from group:", error);
      res.sendStatus(500); // Internal server error
    });
});


router.get("/groupItems"),
  rejectUnauthenticated,
  (req, res) => {
    const { groupId, userId } = req.body;
    const queryText = "SELECT FROM group_list WHERE id = $1 AND group_id = $2;";
    pool
      .query(queryText, [groupId, userId])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error("Error executing groupItems query:", error);
        res.sendStatus(500);
      });
  };
  router.get("/check", rejectUnauthenticated, (req, res) => {
    const userId = req.user.id; // Assuming the user ID is stored in req.user.id
  
    // Define the SQL query to check if the user is part of any group
    const checkQueryText =
      'SELECT EXISTS(SELECT 1 FROM "user_groups" WHERE user_id = $1)';
    pool
      .query(checkQueryText, [userId])
      .then((result) => {
        // Extract the boolean value from the result
        const isPartOfGroup = result.rows[0].exists;
  
        // Send the response indicating whether the user is part of any group or not
        res.status(200).json({ hasCreatedGroup: isPartOfGroup }); // Keep the response key the same for compatibility with the frontend
      })
      .catch((error) => {
        console.error("Error checking user's group:", error);
        res.sendStatus(500); // Send a 500 Internal Server Error status in case of an error
      });
  });
  

module.exports = router;
