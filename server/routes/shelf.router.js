const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ADDED BY MARK FOR IMAGE UPLOAD, UNTESTED




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
      console.log("error in the GET / request for authorized users", err);
      res.sendStatus(500);
    });
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  const item = req.body;
  const user = req.user;
  console.log(`item: ${item} - user: ${user}`);
  const queryText = `INSERT INTO "group_list" ("description", "user_id")
  VALUES ($1, $2, $3);`;
  pool
    .query(queryText, [item.description, item.image_url, user.id])
    .then(() => {
      res.status(201).json({ message: "Values inserted!" });
    })
    .catch((error) => {
      console.log("Error in POST: ", error);
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
