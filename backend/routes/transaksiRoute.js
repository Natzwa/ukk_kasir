const express = require(`express`)
const app = express()

app.use(express.json())

// call transaksiController
let transaksiController = require("../controllers/transaksiController")
const  auth = require(`../controllers/authController`)

app.get("/", auth.authVerify, transaksiController.getAlltransaksi)
app.get("/:id", auth.authVerify, transaksiController.getTransaksiById)
app.get("/detail", auth.authVerify, transaksiController.getAlldetail)
app.post("/", auth.authVerify, transaksiController.addtransaksi)
app.post("/save", auth.authVerify, transaksiController.save)
app.post("/find", auth.authVerify, transaksiController.findTransaksi)
app.put("/:id", auth.authVerify, transaksiController.updatetransaksi)
app.delete("/:id", auth.authVerify, transaksiController.deletetransaksi)


module.exports = app