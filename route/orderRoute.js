const express = require('express')
const { deleteAllOrders, createOrder, getOrder, getAllOrder } = require("../controller/orderController");
const router = express.Router();
const { verifyToken, verifyNonAdmin, verifyIsAdmin } = require('../auth')


router.delete("/", deleteAllOrders)

router.post("/add-order/:prodId", verifyToken, verifyNonAdmin, createOrder) //#9 create order

router.get("/get-order", verifyToken, verifyNonAdmin, getOrder ) //#10 retrieve users order

router.get("/all", verifyToken, verifyIsAdmin, getAllOrder) //#11 retrieve all oriders

module.exports = router;