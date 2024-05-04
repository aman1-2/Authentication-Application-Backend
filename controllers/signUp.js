const bcrypt = require('bcrypt'); //Helps in Password Hashing.
const User = require("../models/User"); /*Imported model so that can make interaction with Db with the help of model.*/

//Route handler
exports.signUp = async (req,res) =>{
    try{
        //Fetching the data from the request body.
        const {name, email, password, role} = req.body;

        //Check if this user is already registred or not.
        const existingUser = await User.findOne({email});
        //If its a valid user then return in that case.
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already Exists.",
            });
        }

        //If user dosen't exist and its a new entry in that case first secure the password.
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10); /*This hash function encrypt the password we have passed password to be hashed and number of rounds in which you want to salt it.*/
        }
        catch(error){
            //Let's say we got some issue while encrypting or password in that case re-try to return.
            return res.status(500).json({
                success:false,
                message:"Error while hashing the password."
            });
        }

        //If we have hashed our password then we are left with the entry to be created.
        /*We can create the entry in two different ways either by direct entry in the db with
         the help of create method or by first creating its object and then saving it inside the db. */
        const user = await User.create({name, email, password:hashedPassword, role});

        //If we have createad a successful entry then return the resposne and ghar chalo ab.
        return res.status(200).json({
            success:true,
            message:"Registred Successfully.",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Issue in registring the User."
        });
    }
}