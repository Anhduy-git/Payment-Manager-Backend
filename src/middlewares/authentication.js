const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {BadRequestError, UnauthorizedError} = require('../errors');
const config = require('../config');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, config.jwt_secret);
        //check if user exist and token is included in tokens array
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});                 

        if (!user) {
            throw new BadRequestError("User not exist");
        } else {
            req.user = user;
            if (user.isAdmin) {
                req.priority = 0                    
            } 
            //is normal user
            else {
                req.priority = 1     
            }
        }    
        req.token = token;        
        next();
    } catch(err) {
        next(err);
    }
}
module.exports = auth;
