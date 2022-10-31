const authRouter = require('./authentication');
const userRouter = require('./user');


function route(app) {
    //routers
    app.use('/users', userRouter);
		app.use('/auth', authRouter);
}

module.exports = route;
