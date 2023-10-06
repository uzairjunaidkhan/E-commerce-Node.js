const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan")

const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const categoryRoute = require("./routes/categories.js");
const orderRoute = require("./routes/order.js");
const authJwt = require('./helper/jwt.js');
const errorHandler = require('./helper/error-handler.js');
const port = process.env.port || 5000;
dotenv.config();

mongoose
  .connect(process.env.mongo_url, {
      useNewUrlParser: true,
      dbName: 'eshop-database'
  })
  .then(() => console.log("mongo db is connectd successfully!"))
  .catch((err) => {
    console.log(err);
  });
  
//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/order", orderRoute);

app.listen(port, () => {
  console.log("server running on", { port });
});

