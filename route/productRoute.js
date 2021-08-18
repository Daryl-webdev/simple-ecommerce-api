const express = require('express');
const { getAllProduct, deleteAllProd, retrieveActiveProducts, getProduct, createProduct, updateProduct, archiveProduct } = require("../controller/productController");
const router = express.Router();
const { verifyToken, verifyIsAdmin, newVerifyToken } = require('../auth');

router.get("/",verifyToken, verifyIsAdmin, getAllProduct ); 

router.delete("/", deleteAllProd); //use only for testing (for faster deletion)

router.get("/all", retrieveActiveProducts ); //#4 get all active

router.get("/:productId", newVerifyToken, getProduct);

router.post("/add", verifyToken, verifyIsAdmin, createProduct); //#6 Add product

router.put("/update/:prodId", verifyToken, verifyIsAdmin, updateProduct); //#7 update product

router.delete("/archive/:prodId", verifyToken, verifyIsAdmin, archiveProduct ); //#8 archive product

module.exports = router;