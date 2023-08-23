const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require(`../controllers/userController`)
const  auth  = require(`../controllers/authController`)

//endpoint
app.post("/login",userController.login)
app.get("/", auth.authVerify, userController.getAllUser)
app.post("/",auth.authVerify, userController.addUser)
app.put("/:id",auth.authVerify, userController.updateUser)
app.delete("/:id",auth.authVerify, userController.deleteUser);

module.exports = app