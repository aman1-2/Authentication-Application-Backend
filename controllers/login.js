const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req,res) => {
    try{
        //Fetch the data.
        const {email,password} = req.body;

        //Validation or Confirm that you have got both the details e-mail and password.
        if(!email || !password){
            return res.status(400).json({
                success:false,
                meassage:"Fill all the details.Password and email are must"
            });
        }

        //Checking if the user us regesitred or not.
        let exist_user = await User.findOne({email});
        if(!exist_user){
            return res.status(401).json({
                success:false,
                message:"User with such E-mail not found.Firstly SignUp."
            });
        }

        /*Now if its a registred user then you have to compare the password to validate that 
        its roght password.
        We have made it await as ot will make a db interaction to validate correct password.*/
        const payload = {
            //This is the actual data which is to be passed inside the jwt token.
            id:exist_user._id,
            email:exist_user.email,
            role:exist_user.role
        }
        if(await bcrypt.compare(password,exist_user.password)){
            /*In-case password is matched so you have to make user login.
            And you to need to store the login detail for other http reuest.
            For that you have to create a JWT token.*/
            const token = jwt.sign(payload,process.env.JWT_SCERET,{expiresIn:"2h"});

            //Now adding this token inside the object of existUser.
            exist_user = exist_user.toObject();
            exist_user.token = token;

            /*Now still we have password inside the req which can be hinder the privacy.
            Therfore we have just removed the password from exist_user object.*/
            exist_user.password = undefined; //changed the password.

            const options = {expires:new Date(Date.now() + 3*24*60*1000),httpOnly:true}
            /*Now we are too passing this detail as cookie. 
            Inside the cookie we try to pass on three details as the name of the cookie, data
            the cookie will store and some options that can hold some options in it like the
            expire date of the cookie the http it can access through and many more other things
            can be achieved through it.*/
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                exist_user,
                message:"User logged in token created Successfully."
            });

            console.log(res.cookie); //testing
        }
        else{
            //In-case password doesn't matches.
            return res.status(403).json({
                success:false,
                message:"Wrong Password Entered"
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Faliure'
        });
    }
}