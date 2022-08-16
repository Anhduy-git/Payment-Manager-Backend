const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/authentication');
const userController = require('../controllers/user')

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);
router.get('/getRemainingBalance', auth, userController.getRemainingBalance);
router.get('/:username/getRemainingBalance', userController.getRemainingBalanceByUsername);
router.delete('/:username/delete', userController.deleteUserByUsername);
// router.patch('/transferToAdmin', auth, userController.transferToAdmin);
router.patch('/:username/transferToAdmin', userController.transferToAdminByUsername);
router.post('/addMoney', auth, userController.addMoney);
router.patch('/updatePassword', auth, userController.updatePassword);


module.exports = router;