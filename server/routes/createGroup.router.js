const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// POST route to create a new user group
router.post('/', (req, res) => {
  const { group_name, user_id, admin } = req.body;

  // Fixed query to include both group_name and user_id
  const createGroupQueryText = 'INSERT INTO "groups" ("group_name", "creator_id") VALUES ($1, $2) RETURNING id';
  const createGroupQueryValues = [group_name, user_id];

  pool.query(createGroupQueryText, createGroupQueryValues)
    .then((groupResult) => {
      const group_id = groupResult.rows[0].id;

      // Removed extra comma from the query string
      const createUserGroupQueryText = 'INSERT INTO "user_groups" ("group_id", "user_id", "admin") VALUES ($1, $2, $3) RETURNING *';
      const createUserGroupQueryValues = [group_id, user_id, admin];

      pool.query(createUserGroupQueryText, createUserGroupQueryValues)
        .then((userGroupResult) => {
          res.status(201).json(userGroupResult.rows[0]);
        })
        .catch((error) => {
          console.error('Error creating user group:', error);
          res.sendStatus(500);
        });
    })
    .catch((error) => {
      console.error('Error creating group:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
