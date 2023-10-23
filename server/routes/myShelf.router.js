
const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

// GET all items for the logged in user
router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * FROM "my_list" WHERE "user_id" = $1 ORDER BY "id" ASC;';
  pool.query(queryText, [req.user.id])
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log('Error in GET myShelf', error);
      res.sendStatus(500);
    });
});


// POST a new item
router.post('/', rejectUnauthenticated, (req, res) => {
  const newItem = req.body;
  const queryText = 'INSERT INTO "my_list" ("user_id", "task") VALUES ($1, $2);';
  pool.query(queryText, [req.user.id, newItem.task])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log('Error in POST myShelf', error);
      res.sendStatus(500);
    });
});

// PUT to edit an existing item
router.put('/:id', rejectUnauthenticated, (req, res) => {
  const updatedItem = req.body;
  const queryText = 'UPDATE "my_list" SET "task" = $1 WHERE "id" = $2;';
  pool.query(queryText, [updatedItem.task, req.params.id])
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('Error in PUT myShelf', error);
      res.sendStatus(500);
    });
});

// PUT to mark an item as complete
router.put('/complete/:id', rejectUnauthenticated, (req, res) => {
  const queryText = 'UPDATE "my_list" SET "complete" = TRUE WHERE "id" = $1;';
  pool.query(queryText, [req.params.id])
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('Error in PUT complete myShelf', error);
      res.sendStatus(500);
    });
});

// DELETE an item
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const queryText = 'DELETE FROM "my_list" WHERE "id" = $1;';
  pool.query(queryText, [req.params.id])
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('Error in DELETE myShelf', error);
      res.sendStatus(500);
    });
});

module.exports = router;
