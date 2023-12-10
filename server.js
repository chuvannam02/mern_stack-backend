const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const UserRoute = require("./routes/api/UserRoute");
const AuthRoute = require("./routes/api/AuthRoute");
const ProductRoute = require("./routes/api/ProductRoute");
const CategoryRoute = require("./routes/api/CategoryRoute");
const InventoryRoute = require("./routes/api/InventoryRoute");
const StripeRoute = require("./routes/api/StripeRoute");
const WebhookRoute = require("./routes/api/webhook");
const OrderRoute = require("./routes/api/OrderRoute");
// const StripeRoute = require("./routes/api/Stripe");
const cookieParser = require("cookie-parser");
dotenv.config();
const port = process.env.PORT || 3000;
const corsOptions = {
  // origin: "http://localhost:3001",
  // origin: "http://127.0.0.1:5173",
 // origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  origin:'https://front-end-web-ecommerce.onrender.com',
  // origin: 'https://mern-stack-frontend.onrender.com',
};
const client = require("./Redis");

// console.log(client);
// console.log(`node-redis version is ${require("redis/package.json").version}`);

const app = express();
// Add raw body middleware before other body parsers
// app.use((req, res, next) => {
//   express.raw({ type: 'application/json' })(req, res, (err) => {
//     if (err) return next(err);
//     next();
//   });
// });
app.use("/api/v1", express.raw({ type: "application/json" }), WebhookRoute);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
/*
app.use(function (req, res, next) {
    // // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', 'https://mern-stack-frontend.onrender.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods','GET','POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE');


// app.use(function (req, res, next) {
//   // // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET",
//     "POST",
//     "OPTIONS",
//     "PUT",
//     "PATCH",
//     "DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // // Set to true if you need the website to include cookies in the requests sent to the API(e.g in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

app.get("/", (req, res) => {
  res.send({ message: "connected sucess" });
});

/*
app.get("/:name", (req, res)=> {
    let name = req.params.name;

    res.json({
        message:`Hello ${name}`
    });
});
*/
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});

//Connection mongoDB use mongoose
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected to MongoDB");
      }
    }
  )
);

//test redis if it returns value
app.get("/test_redis", async (req, res) => {
  const hello = await client.get(
    "635bfe3ed3396503ca31f938",
    function (err, reply) {
      console.log(JSON.parse(reply).token);
      return res.send(JSON.parse(reply).token);
    }
  );
});

// Routes
app.use("/api/v1", UserRoute);
app.use(AuthRoute);
app.use("/api/v1", ProductRoute);
app.use("/api/v1", CategoryRoute);
app.use("/api/v1", InventoryRoute);
app.use("/api/v1", StripeRoute);
app.use("/api/v1", OrderRoute);
