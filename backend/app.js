const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const devRoutes = require("./routes/dev.routes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/dev", devRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
    res.send("Hello World!");
});


module.exports = app;