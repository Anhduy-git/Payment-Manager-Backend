const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {BadRequestError, UnauthorizedError} = require('../errors');
const config = require('../config');
const userSchema = new mongoose.Schema({      
    isAdmin: {
        type: Boolean,        
        default: false
    },
    remainingBalance: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        required: true,        
        minlength: 5,
        trim: true,
        unique: true,
        validate(value) {
            if (value.toLowerCase().includes('username')) {
                throw new Error('Username cannot contain "username"');
            }
        }
    },
    password: {
        type: String,        
        default: '',
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }

    },    
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    
});



userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, config.jwt_secret);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.checkCredentials = async(user, password) => {
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}


//Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); //go to save the user
})



const User = mongoose.model('User', userSchema);

module.exports = User;