const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, UnauthorizedError, BadRequestError} = require('../errors');

class UserController {

    //[POST] /users/
    async createUser(req, res, next) {
        try {                    
            const user = new User(req.body);
            await user.save();            
            res.status(StatusCodes.CREATED).json(user);              
        } catch(err) {
            next(err);
        }
    };

    
    //[POST] /users/addMoney
    async addMoney(req, res, next) {
        try {                         
            const moneyAdded = req.body.moneyAdded;
            req.user.remainingBalance += moneyAdded;
            await req.user.save();
            res.status(StatusCodes.OK).send();
        } catch(err) {
            next(err);
        }
    }
    //[GET] /users/remainingBalance
    async getRemainingBalance(req, res, next) {
        try {                         
            res.status(StatusCodes.OK).json({remainingBalance: req.user.remainingBalance});
        } catch(err) {
            next(err);
        }
    }

    //[GET] /users/:username/remainingBalance
    async getRemainingBalanceByUsername(req, res, next) {
        try {                    
            const username = req.params.username;
            const user = await User.findOne({username});
            if (!user) {
                //user not exist
                throw new UnauthorizedError('Username not exist');
            }            
            res.status(StatusCodes.OK).json({remainingBalance: user.remainingBalance});
        } catch(err) {
            next(err);
        }
    }

    //[DELETE] /users/:username
    async deleteUserByUsername(req, res, next) {
        try {            
            const username = req.params.username;       
            const user = await User.findOneAndDelete({username});
            if (!user) {
                throw new NotFoundError("User not found");
            }
            res.status(StatusCodes.OK).json(user);            
        } catch(err) {
            next(err);
        }
    }
    

  

    //[PATCH] /users/:username/transferToAdmin
    async transferToAdminByUsername(req, res, next) {
        try {
            const username = req.params.username;         
            const user = await User.findOne({username});
            if (!user) {
                //user not exist
                throw new UnauthorizedError('Username not exist');
            }                             
            const moneyTransfer = req.body.moneyTransfer;            
            if (moneyTransfer <= user.remainingBalance) {
                //update current user
                user.remainingBalance -= moneyTransfer;
                await user.save();
                //update user admin
                const userAdmin = await User.findOne({isAdmin: true});
                userAdmin.remainingBalance += moneyTransfer;
                await userAdmin.save();
            } else {
                throw new BadRequestError('Not enough money in account');
            }     
            res.status(StatusCodes.OK).send();
        } catch(err) {
            next(err);
        }
    }

    
    //[PATCH] /users/:username/updatePassword
    async updatePassword(req, res, next) {		
        try {
          const { username } = req.params;
					const user = await User.findOne({ username });
					if (user) {
						user.password = req.body.password;
						await user.save();
						res.status(StatusCodes.OK).send();
					}
        } catch(err) {
            next(err);
        }
    } 
    
}


module.exports = new UserController;