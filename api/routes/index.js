const express = require("express");

const router = express.Router();

const usersRoutes = require("./users.routes");
// const productRoutes = require("./products.routes");
// const adminsRoutes = require("./admin.routes");

router.get("/", function (req, res) {
  res.render("index", {
    title: "E-commerce boilerplate",
    body: "Thank you for visiting E-commerce boilerplate 👋🏻 !",
  });
});

router.use("/users", usersRoutes);
// router.use("/admin", adminsRoutes);
// router.use("/products", productRoutes);

module.exports = router;
