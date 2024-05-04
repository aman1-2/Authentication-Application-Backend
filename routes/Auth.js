//Here we have to define Our routes ans routes can be defined with the help of router.
const express = require('express');
const User = require('../models/User'); //Just used for fetching the data for getEmail route.
const router = express.Router();

//Handlers defined.
const sign = require('../controllers/signUp');
const login = require('../controllers/login'); 
//MiddleWare handlers been defined.
const {auth,isStudent,isAdmin} = require('../Middleware/auth');

//Routes and their callbacks defined.
router.post("/signUp",sign.signUp); 
router.post("/logIn",login.login);
//Defining the routes for the middlewares.
/*Till now while defining the routes we were passing only the route handler name and the function
attached to it but know we will pass middlewares before actually calling our callback function
or the route handler function.*/
router.get("/student",auth,isStudent,function callback(req,res){
    res.status(200).json({
        success:true,
        message:"Welcome to the protected route for the students."
    });
});

router.get("/admin",auth,isAdmin,function callback(req,res){
    res.status(200).json({
        success:true,
        message:"Welcome to the protected route for the admin."
    });
});


/*This extra route is for telling the answer of why we were passing the id inside the payload.
Just to ensure that with the help of this we can extract out any id's data.*/
router.get("/getemail",auth,async (req,res)=>{
    try{
        const id = req.user.id;
        const user = await User.findById(id);

        res.status(200).json({
            success:true,
            user:user,
            message:"Welcome to the Email route."
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while doing the email route."
        });
    }
});

module.exports = router;