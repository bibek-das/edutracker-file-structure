const express = require("express");
const router = express.Router();
const dept = require("../../controllers/admin/addDeptController");

router.get("/", dept.addDept);

module.exports = router;
