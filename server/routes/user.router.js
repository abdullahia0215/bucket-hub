const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

// Fetch the group ID for the authenticated user
router.get('/groups', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  
  // Your SQL query might look different depending on the structure of your user_groups table
  const queryText = `SELECT group_id FROM user_groups WHERE user_id = $1`;

  pool
    .query(queryText, [userId])
    .then((result) => {
      // Assuming the user is part of only one group
      const groupId = result.rows[0]?.group_id;
      if (groupId) {
        res.send({ groupId });
      } else {
        // Handle cases where the user isn't associated with any group
        res.status(404).send({ error: 'No group found for this user' });
      }
    })
    .catch((err) => {
      console.log('Error fetching group for user:', err);
      res.sendStatus(500);
    });
});

module.exports = router;
