const express = require("express")

const router = express.Router();

const { login, signup } = require("../controllers/Auth")
const { auth, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/login", login)
router.post("/signup", signup)

// protected routes => the one with the assigned role can access the route

router.get("/test", auth, (req, res) => {
    res.json({
        success: true, message: "logged in"
    })
})
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true, message: "logged in as student"
    })
})
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true, message: "logged in as admin"
    })
})

module.exports = (router);
