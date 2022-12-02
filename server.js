const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const UserRoute = require("./routes/api/UserRoute");
const AuthRoute = require("./routes/api/AuthRoute");
const ProductRoute = require("./routes/api/ProductRoute");
const CategoryRoute = require("./routes/api/CategoryRoute");
const cookieParser = require("cookie-parser");
dotenv.config();

const port = process.env.PORT || 3000;
const corsOptions = {
  origin:'http://localhost:3000',
  credentials:true,
};
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(cookieParser());
/*
app.use(function (req, res, next) {
    // // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods','GET','POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent to the API(e.g in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/
app.get("/", (req, res)=> {
    res.send({"message":"connected sucess"});
})

/*
app.get("/:name", (req, res)=> {
    let name = req.params.name;

    res.json({
        message:`Hello ${name}`
    });
});
*/
app.listen(port, ()=> {
    console.log(`Server is running on PORT: ${port}`);
})

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
    }
  });

  // Routes
  app.use(UserRoute);
  app.use(AuthRoute);
  app.use(ProductRoute);
  app.use(CategoryRoute);
 
