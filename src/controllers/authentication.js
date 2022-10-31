const User = require('../models/user');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, UnauthorizedError, BadRequestError} = require('../errors');

class UserController {

    //[POST] /auth/login
    async loginUser(req, res, next) {
        try {
            let token;
            const username = req.body.username;        
            
            const user = await User.findOne({username});
            if (!user) {
                //user not exist
                throw new UnauthorizedError('Username not exist');
            }                            
            if (user.password === '') {
                //return create password page
                
                res.status(StatusCodes.OK).send({token:undefined});
            }    
            else {        
                const isValidUser = await User.checkCredentials(user, req.body.password);
                if (isValidUser) {
                    token = await user.generateAuthToken();
                    res.status(StatusCodes.OK).json({user, token});

                }            
                else {
                    throw new UnauthorizedError('Authentication failed');
                }
            }    
        } catch(err) {
            next(err);
        }
    }
    //[POST] /auth/logout
    async logoutUser(req, res, next) {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            })
            await req.user.save();
            res.status(StatusCodes.OK).send();
        } catch(err) {
            next(err);
        }
    }
    
    
    
}


module.exports = new UserController;