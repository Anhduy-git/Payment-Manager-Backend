const userRouter = require('./user');


function route(app) {
    //routers
    app.use('/users', userRouter);
}

module.exports = route;