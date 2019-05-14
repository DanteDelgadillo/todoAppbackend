const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongooose = require("mongoose")
const todoRoutes = express.Router();
const PORT = process.env.PORT || 4000;

let Todo = require("./todo.model");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongooose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true })
const connection = mongooose.connection;

connection.once("open", function () {
    console.log('mongodb connection is working')
})


todoRoutes.route("/").get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    })
})

todoRoutes.route("/:id").get(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        res.json(todo);
    })
})

todoRoutes.route('/add').post(function (req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({ "todo": 'todo added successfully' })
        })
        .catch(err => {
            res.status(400).json.send('adding new to do failed')
        })

})

todoRoutes.route("/update/:id").put(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo) {
            res.status(404).send('data notfound')
        } else {
            todo.todoDescription = req.body.todoDescription;
            todo.todoResponsibility = req.body.todoResponsibility;
            todo.todoPriority = req.body.todoPriority;
            todo.todoCompleted = req.body.todoCompleted;

            todo.save().then(todo => {
                res.json('todo updated');
            })
                .catch(err => {
                    res.status(400).send("update no possible")
                })
        }
    })
})


todoRoutes.route("/delete/:id").delete(function (req, res) {
    const id = req.params.id;

    Todo.findByIdAndDelete(id)
        .then(todo => {
            res.json('todo deleted');
        })
        .catch(err => {
            res.status(400).send("delete no possible")
        })
})


app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log(`port running on ${PORT}`)
})
