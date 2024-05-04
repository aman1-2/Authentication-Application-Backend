//express instance creation
const express = require('express');
const app = express();

//Importing the dbconnection function.
const dbConnect = require('./config/database');

require('dotenv').config();
const port = process.env.PORT || 4000;

//Middle-ware
app.use(express.json());
//Since we are going to play with cookies therefore cookie parser is needed for reading the data from teh cookies.
const cookie_parser = require('cookie-parser');
app.use(cookie_parser());

//Default route creation.
const auth = require('./routes/Auth'); //In this only all the routes are defiend.
//Mount
app.use("/api/v1",auth);

app.get('/',(req,res)=>{
    res.send("<Div>Jai Shree Ram!!!<br/>Radhe Radhe!!!!!!</Div>");
});
  
//Launching the server(Starting)
app.listen(port,()=>{
    console.log("The server is established Succesfully.\nJai Shree Ram!!!");
});

//Making a db connection call.
dbConnect();
