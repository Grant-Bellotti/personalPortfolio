var express = require('express');
var bodyParser = require('body-parser');
var routes = require("./routes");
let http = require('http');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/js', express.static('./public/js'));
app.use('/',express.static('./public'));
app.use(routes);

app.use('/favicon.ico', express.static('public/favicon.webp'));
app.use('/style.css', express.static('public/css/style.css'));

var port = process.env.PORT || 3000;
server.listen(port);
