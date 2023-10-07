const router = require("express").Router();
const thoughtRoutes = require("./thoughtRoutes");
const userRoutes = require("./userRoutes");

router.use("/courses", thoughtRoutes);
router.use("/courses", userRoutes);

module.exports = router;
