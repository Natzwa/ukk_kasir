const express = require('express')

const app = express()

app.use(express.json())

const mejaController = require('../controllers/mejaController')
const  auth  = require(`../controllers/authController`)

app.get("/",auth.authVerify,  mejaController.getAllMeja)

app.post("/",auth.authVerify, mejaController.addMeja)

app.post("/find", mejaController.findMeja)

app.put("/:id",auth.authVerify, mejaController.updateMeja)

app.delete("/:id",auth.authVerify, mejaController.deleteMeja)
module.exports = app