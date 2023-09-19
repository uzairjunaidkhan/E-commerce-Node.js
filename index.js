const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan")

// const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const categoryRoute = require("./routes/categories.js");
const orderRoute = require("./routes/order.js");
const authJwt = require('./helper/jwt.js')
const errorHandler = require('./helper/error-handler.js')
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
app.use(errorHandler);
// app.use((err, req, res, next) => {
//   if (err.name === "UnauthorizedError") {
//     return res.status(401).json({ Message: err });
//   }
//   console.error(err);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// api routes
// app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/order", orderRoute);

app.listen(port, () => {
  console.log("server running on", { port });
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDc4YmQ2ODUyZDkzM2VkNWY3YjNlYmMiLCJpYXQiOjE2ODY3NDA3NDIsImV4cCI6MTY4NjgyNzE0Mn0.1DMkdh5T-W8BVPUNFpSlADQKADY5uHHyJKcJVRjTeiU