const express = require('express');
const connectDB = require('./db/db-connect');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const route = require('./routers');
const cors = require('cors');
const config = require('./config')


const app = express();


//parse req.body to js object
app.use(express.json()); 

//CORS
app.use(cors());

//init routers
route(app);

//error handlers
app.use(errorHandlerMiddleware); 


const port = config.port;
console.log(port);
const startServer = async () => {    
    try {
		await(connectDB(config.mongodb_url));      
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);    
	} catch(err) {
		console.log(err);
	}
};
  
startServer();

