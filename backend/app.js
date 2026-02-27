const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const devRoutes = require("./routes/dev.routes");
const taskRoutes = require("./routes/task.routes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(cookieParser());

app.use("/api/dev", devRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => {
    res.send("Hello World!");
});


module.exports = app;