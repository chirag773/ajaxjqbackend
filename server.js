var express = require("express"),
app     = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require('method-override');

mongoose.connect(process.env.DATABASEURL||"mongodb://localhost/todo_app");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
require('dotenv').load();
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var todoSchema = new mongoose.Schema({
  text: String,
  description:String
});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/", function(req, res){
  res.redirect("/todos");
});

app.get("/todos", function(req, res){
  Todo.find({}, function(err, todos){
    if(err){
      console.log(err);
    } else {
      if(req.xhr) {
        res.json(todos);
      } else {
        res.render("index", {todos: todos}); 
      }
    }
  })
});

// app.get("/todos/new", function(req, res){
//  res.render("new"); 
// });

app.post("/todos", function(req, res){
 // req.body.todo.text = req.sanitize(req.body.todo.text);
 // var text = req.body.text;
 // var description = req.body.description;
 var formData =req.body.todo
 Todo.create(formData, function(err, newTodo){
    if(err){
      res.render("new");
    } else {
      res.json(newTodo);
    }
  });
});

// app.get("/todos/:id/edit", function(req, res){
//  Todo.findById(req.params.id, function(err, todo){
//    if(err){
//      console.log(err);
//      res.redirect("/")
//    } else {
//       res.render("edit", {todo: todo});
//    }
//  });
// });

app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, {new: true}, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.json(todo);
   }
 });
});

app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.json(todo);
   }
 }); 
});


// app.listen(3001, function() {
//   console.log('Server running on port 3000');
// });

 
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});