let path = require("path");
let express = require("express");
var formidable = require('formidable');
var mv = require('mv');

//Look at below web page for info on express.Router()
//https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
let router = express.Router();

//request is info sending to server from client.
//response is info sending to client from server.

router.get("/",function(req,res){
  res.sendFile(path.resolve(__dirname + "/public/views/home.html"));  //changed
});
router.get("/aboutme",function(req,res){
  res.sendFile(path.resolve(__dirname + "/public/views/aboutme.html"));  //changed
});

module.exports = router;
