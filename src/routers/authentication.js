const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/authentication');
const authController = require('../controllers/authentication')


router.post('/login', authController.loginUser);
router.post('/logout', auth, authController.logoutUser);



module.exports = router;