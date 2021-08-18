const express = require('express')
const { getAllUsers, deleteAll,toNonAdmin, registerUser, login, toAdmin } = require("../controller/userController");
const router = express.Router();
const { verifyToken, verifyIsAdmin } = require("../auth")

router.get('/', getAllUsers)
router.delete('/delete', deleteAll)
router.put('/to-non-admin/:id', toNonAdmin)

router.post('/register', registerUser) //#1 User registration 
router.post('/login', login) //#2 login to authenticate
router.put('/to-admin/:id', verifyToken, verifyIsAdmin, toAdmin ) //#2-3 set user to admin


module.exports = router;