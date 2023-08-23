const express = require(`express`)
const app = express()
app.use(express.json())
const menuController = require(`../controllers/menuController`)
// const { authorizeAdmin } = require(`../controllers/authController`)
const auth = require(`../controllers/authController`)

app.get("/getmenu",auth.authVerify, menuController.getAllMenu)
app.post("/postmenu",auth.authVerify, menuController.addMenu)
app.post("/findmenu", menuController.findMenu)
app.put("/:id",auth.authVerify, menuController.updateMenu)
app.delete("/:id", menuController.deleteMenu)

module.exports = app