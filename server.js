const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@ditya@1234",
    database: "aditydb",
    port: 3306  
});

db.connect(err => {
    if (err) {
        console.log(" Can't connect to the database:", err);
        return;
    }
    console.log(" Connected to MySQL database");
});

app.post("/add", (req, res) => {
    const name = req.body.name;
    const date = req.body.date || null;

    if (!name) return res.send("Please enter the task name");

    const sql = "INSERT INTO tasks(name, date, completed, flag) VALUES(?, ?, 0, 0)";
    db.query(sql, [name, date], (err, result) => {
        if (err) {
            console.log(" Error adding task:", err);
            return res.send("Task not added");
        }
        res.send("Task added successfully");
        console.log("✅ Task added:", result);
    });
});

app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, result) => {
        if (err) {
            console.log(" Error fetching tasks:", err);
            return res.send("Error fetching tasks");
        }
        res.send(result);
    });
});

app.put("/update/:id", (req, res) => {
    const taskId = req.params.id;
    const taskCompleted = req.body.completed;
    const taskFlag = req.body.flag;

    const sql = "UPDATE tasks SET completed = ?, flag = ? WHERE id = ?";
    db.query(sql, [taskCompleted, taskFlag, taskId], (err, result) => {
        if (err) {
            console.log(" Error updating task:", err);
            return res.send("Task not updated");
        }
        res.send("Task updated successfully");
        console.log(" Task updated:", result);
    });
});

app.delete("/clear", (req, res) => {
    db.query("DELETE FROM tasks WHERE completed = 1", (err, result) => {
        if (err) {
            console.log(" Error clearing tasks:", err);
            return res.send("Error clearing tasks");
        }
        res.send("Completed tasks cleared");
        console.log("Completed tasks deleted:", result);
    });
});

app.listen(3000, () => console.log(" Server running on port 3000"));
