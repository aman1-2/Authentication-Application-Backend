const mongoose = require('mongoose');

//Making the schema of the model.
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Student","Visitor","Admin"] //Now it can take values form these three itself.
    }
});

module.exports = mongoose.model("User",userSchema);
/*A module is exported with its alias name and schema-name.*/