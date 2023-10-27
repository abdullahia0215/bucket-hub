const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");





router.get('/checkUserGroupAccess', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const queryText = 'SELECT * FROM "user_groups" WHERE "user_id" = $1';
  
  pool.query(queryText, [userId])
    .then((result) => {
      if (result.rows.length > 0) {
        res.send({ hasAccess: true });
      } else {
        res.send({ hasAccess: false });
      }
    })
    .catch((error) => {
      console.error('Error checking user group access', error);
      res.sendStatus(500);
    });
});

/**
 * Get all of the items on the shelf
 */
router.get("/", rejectUnauthenticated, (req, res) => {
  console.log("req.user:", req.user);
  pool
    .query(`SELECT * FROM "group_list";`)
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error in the GET / request for authorçized users", err);
      res.sendStatus(500);
    });
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post('/addTaskGroup', rejectUnauthenticated, (req, res) => {
  const newItem = req.body;
  newItem.complete = false;
  const group_id = newItem.group_id;

  console.log("Adding item:", newItem);  // Debugging log

  const queryText = 'INSERT INTO "group_list" ("group_id", "user_id", "task", "complete") VALUES ($1, $2, $3, $4);';
  pool.query(queryText, [group_id, req.user.id, newItem.task, newItem.complete])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log('Error in POST myShelf', error);
      res.sendStatus(500);
    });
});


/**
 * Delete an item if it's something the logged in user added
 */
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  // endpoint functionality
  pool
    .query(`DELETE FROM "group_list" WHERE "id" = $1 AND "user_id" = $2`, [
      req.params.id,
      req.user.id,
    ])
    .then((results) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in DELETE with id", error);
      res.sendStatus(500);
    });
});

/**
 * Update an item if it's something the logged in user added
 */
router.put("/:id", (req, res) => {
  console.log(req.body)
  const item = req.body;
  const queryText = `UPDATE "group_list" SET "description" = $1 WHERE "id" = $2`;
  pool
    .query(queryText, [item.description, item.id])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error saving to database", err);
      res.sendStatus(500);
    });
});


/**
 * Return all users along with the total number of items
 * they have added to the shelf
 */
router.get("/count", (req, res) => {
  // endpoint functionality
});

/**
 * Return a specific item by id
 */
router.get("/:id", (req, res) => {
  // endpoint functionality
});

module.exports = router;