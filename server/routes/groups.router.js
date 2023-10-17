const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// Create a new group
router.post("/create", rejectUnauthenticated, (req, res) => {
  const group = req.body;
  const queryText = `INSERT INTO "groups" ("group_name", "creator_id")
    VALUES ($1, $2) RETURNING *`;
  const queryValues = [group.group_name, req.user.id];
  pool
    .query(queryText, queryValues)
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      console.log("Error in POST /groups/create:", error);
      res.sendStatus(500);
    });
});

// Get all groups
router.get("/", (req, res) => {
  const queryText = `SELECT * FROM "groups"`;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Error in GET /groups:", error);
      res.sendStatus(500);
    });
});

// Join a group
router.post("/join", rejectUnauthenticated, (req, res) => {
  const group = req.body;
  const queryText = `INSERT INTO "user_groups" ("group_id", "user_id")
    VALUES ($1, $2) RETURNING *`;
  const queryValues = [group.group_id, req.user.id];
  pool
    .query(queryText, queryValues)
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      console.log("Error in POST /groups/join:", error);
      res.sendStatus(500);
    });
});

// Leave a group
router.post("/leave", rejectUnauthenticated, (req, res) => {
  const group = req.body;
  const queryText = `DELETE FROM "user_groups"
    WHERE "group_id" = $1 AND "user_id" = $2`;
  const queryValues = [group.group_id, req.user.id];
  pool
    .query(queryText, queryValues)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in POST /groups/leave:", error);
      res.sendStatus(500);
    });
});

// Delete a group
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const groupId = req.params.id;
  const queryText = `DELETE FROM "groups" WHERE "id" = $1`;
  pool
    .query(queryText, [groupId])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in DELETE /groups/:id:", error);
      res.sendStatus(500);
    });
});

module.exports = router;