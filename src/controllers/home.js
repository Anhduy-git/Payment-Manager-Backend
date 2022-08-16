const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

class HomeController {
    //[GET] /
    async getHomePage (req, res, next) {
        try {
            //create new admin if not already existing
            console.log("this is home page");
            res.status(StatusCodes.OK).send();
        } catch(err) {
            next(err);
        }
    };
}

module.exports = new HomeController;