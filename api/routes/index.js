const express = require("express");

const router = express.Router();

const usersRoutes = require("./users.routes");

router.get("/", function (req, res) {
  res.render("index", {
    title: "E-commerce boilerplate",
    body: "Thank you for visiting E-commerce boilerplate 👋🏻 !",
  });
});

router.use("/users", usersRoutes);

module.exports = router;
