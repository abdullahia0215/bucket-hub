const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
    console.log("req.user:", req.user);
    pool
      .query(`SELECT * FROM "my_list" WHERE "user_id" = ${req.user.id};`)
      .then((result) => {
        console.log(result.rows);
        res.send(result.rows);
      })
      .catch((err) => {
        console.log("error in the GET / request for authorized users", err);
        res.sendStatus(500);
      });
  });
 
module.exports = router;
