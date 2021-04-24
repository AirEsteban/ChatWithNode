// Bring it express
var express = require('express');
var path = require('path');
// For getting the server
var app = express();
var http = require('http').Server(app);
// Getting mongoose ready
var mongoose = require('mongoose');
// With this below, we have now the http server bounded with the express framework and with sockets.
var io = require('socket.io')(http);

var port = process.env.PORT || 5000;

// Connection string, must be on a configuration file
const uri = "mongodb+srv://esteban:esteban@cluster0.viwoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// We need the schema to let mongoose create the map.
var Message = mongoose.model("message", {
    name: String,
    message: String
});

app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));

app.get("/messages", (req,res) => {
    console.log("Getting the messages ready");
    Message.find({},(err, messages) => {
        console.log(messages.map((msg) => {console.log(msg)}));
        res.send(messages);
    });
});

app.post("/messages", (req, res) => {
    // Creating the mongoose model
    var msj = new Message(req.body);
    // Saving into mongodb via mlab
    msj.save((err) => {
        if(err)
            sendStatus(500);
        io.emit("message", req.body);
        res.sendStatus(200);
    });
});

// We send a message every time an user joins the conversation
io.on("connection",(socket) => {
    console.log("A new user has arrived!");
});

// Connect to mongodb via mlab and mongoose ORM.
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
   console.log("Connection to the database established."); 
});

// We used to write app.listen, but we now have the http bounded to the express app.
var server = http.listen(port, () => {
    console.log("Server is listening on port %d", port);
});

