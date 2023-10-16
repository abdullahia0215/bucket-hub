const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * Get all of the tasks in the group list
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
 * Add a task to the group list
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  const task = req.body;
  console.log(`task: ${task}`);
  const queryText = `INSERT INTO "group_list" ("task", "complete")
  VALUES ($1, $2);`;
  pool
    .query(queryText, [task.task, task.complete])
    .then(() => {
      res.status(201).json({ message: "Values inserted!" });
    })
    .catch((error) => {
      console.log("Error in POST: ", error);
      res.sendStatus(500);
    });
});

/**
 * Mark a task as complete in the group list
 */
router.put("/:id", rejectUnauthenticated, (req, res) => {
  console.log(req.body)
  const task = req.body;
  const queryText = `UPDATE "group_list" SET "complete" = $1 WHERE "id" = $2`;
  pool
    .query(queryText, [task.complete, task.id])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("error saving to database", err);
      res.sendStatus(500);
    });
});

module.exports = router;
