var express = require("express");
var http = require("http");
var path = require("path");
var fs = require("fs");
var exphbs = require("express-handlebars");
const Handlebars = require('handlebars');
var notes = require("./notes");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static("views"));

app.set('public', path.join(__dirname, 'public'));
app.use(express.static("public"));

var handlebars = exphbs.create({defaultLayout: 'main'});
app.engine('.handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// escape all html and then replace linebreaks in
// txt buffer with <br> and preserve indentation
// should move to dedicated helper file
Handlebars.registerHelper('nl2br', function(text){
    var escaped = Handlebars.escapeExpression(text);
    return new Handlebars.SafeString(escaped.replace(/\n/g, '<br>')
                                            .replace(/  /g, "&ensp;&ensp;")
                                            .replace(/\t/g, "&emsp;&emsp;"));
});

// use FilesNotes class to get 1. styled folder names, 
// 2. paths of those folders, 3. filenames of notes (nested arr)
let mynotes = notes.getNotes();
console.log(mynotes);
console.log(mynotes.noteText);

app.get("/", (request, response, next) => {
    response.render("folderblock.handlebars", 
                    {notes:mynotes})
});

app.listen(3000);