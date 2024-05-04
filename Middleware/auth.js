/*Inside the middlewre we need the requirement of our tokens for authentication and authorization
therefore we need to have an instance of our token inside the middleware.*/
const jwt = require('jsonwebtoken'); //token isntance
require('dotenv').config(); //This is as we can have the need for our sceret_key.

//Middle-ware for the authentication.
/*While creating a middle-ware we pass there things request, response, next.
This next is used for passing the middleware to the next middleware or route handler
once we have been completely done with the current middleware. */
exports.auth = (req,res,next) => {
    try{
        
        /*Extracting the jwt token.
        There can be many other ways to extract out the token like exracting it from request,
        can extract from the header, we can too extract the token from the cookies.*/
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer","");

        //If token not found.
        if(!token){
            res.status(401).json({
                success:false,
                message:"Token is missing."
            });
        }

        try{
            //If found the token they we have to verify whether we have got the right token or not.
            const decode = jwt.verify(token,process.env.JWT_SCERET);

            //Now what so ever data we have got from the decode now we will store it inside the request.
            req.user = decode; 
        }
        catch(error){
            res.status(401).json({
                success:false,
                message:"Token is Invalid.Problem while decoding the token."
            });
        }

        //Now our work for authentication is done stored data in the middleware and now have to move to next middleware.
        next();
    }
    catch(error){
        res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token.",
            error:error.message
        });
    }
}


//Middleware for the student that is the route will be accessed only if role is student.
exports.isStudent = (req,res,next)=>{
    try{
        if(req.user.role !== "Student"){
            res.status(401).json({
                success:false,
                message:"This is a Protected route for the Student."
            });
        }
        next();
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"User Role is not matching."
        });
    }
}


//Middleware for the admin that is the route will be accessed only if the role is admin.
exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            res.status(401).json({
                success:false,
                message:"This is a Protected route for the Admin."
            });
        }
        next();
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"User Role is not matching."
        });
    }
}

/*We can extract the token or cookies data passed inside the token from the header too
by using the sepecified format of the syntax as ->
request.header("Authorization").replace("Bearer ","");
This replace is for replacing the bearer so that the output we recieve should be only the
token(encrypted one) which will further be de-encrypted.*/