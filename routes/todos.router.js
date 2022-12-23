const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    res.send("Say Hi!");
})

module.exports = router;