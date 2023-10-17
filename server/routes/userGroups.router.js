const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// Add a member to a group
router.post("/addMember", rejectUnauthenticated, (req, res) => {
  const { group_id, user_id, admin } = req.body;
  const queryText = `INSERT INTO "user_groups" ("group_id", "user_id", "admin")
    VALUES ($1, $2, $3) RETURNING *`;
  const queryValues = [group_id, user_id, admin];
  pool
    .query(queryText, queryValues)
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      console.log("Error in POST /userGroups/addMember:", error);
      res.sendStatus(500);
    });
});

// Remove a member from a group
router.post("/removeMember", rejectUnauthenticated, (req, res) => {
  const { group_id, user_id } = req.body;
  const queryText = `DELETE FROM "user_groups"
    WHERE "group_id" = $1 AND "user_id" = $2`;
  const queryValues = [group_id, user_id];
  pool
    .query(queryText, queryValues)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in POST /userGroups/removeMember:", error);
      res.sendStatus(500);
    });
});

// Update admin status of a member in a group
router.put("/updateAdminStatus", rejectUnauthenticated, (req, res) => {
  const { group_id, user_id, admin } = req.body;
  const queryText = `UPDATE "user_groups" SET "admin" = $1
    WHERE "group_id" = $2 AND "user_id" = $3`;
  const queryValues = [admin, group_id, user_id];
  pool
    .query(queryText, queryValues)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in PUT /userGroups/updateAdminStatus:", error);
      res.sendStatus(500);
    });
});

module.exports = router;