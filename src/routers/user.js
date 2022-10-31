const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/authentication');
const userController = require('../controllers/user')

router.post('/', userController.createUser);
router.get('/remainingBalance', auth, userController.getRemainingBalance);
router.get('/:username/remainingBalance', userController.getRemainingBalanceByUsername);
router.delete('/:username', userController.deleteUserByUsername);
// router.patch('/transferToAdmin', auth, userController.transferToAdmin);
router.patch('/:username/transferToAdmin', userController.transferToAdminByUsername);
router.post('/addMoney', auth, userController.addMoney);
router.patch('/:username/updatePassword', userController.updatePassword);


module.exports = router;