const { ErrorMessage, SuccessMessage } = require("../helper/helper");
const { userModel } = require("../models/user.model");
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

async function loginFunction(req, res){
    try{
        const {email, password} = req.body;
        const findUser = await userModel.findOne({email});
        if(!findUser){
            return res.status(500).json(ErrorMessage("Please signUp first", `User with email ${email} not found`, "null", 400));
        }
        const isValidPassword = await bcrypt.compare(password, findUser.password);
        if(!isValidPassword){
            return res.status(409).json(ErrorMessage("Email or UserName is incorrect", "Given email or password is incorrect", "null", 409))
        }
        const accessToken = jwt.sign(
            {email: findUser.email, _id: findUser._id},
            process.env.SECRET_KEY,
            {expiresIn: '15m'}
        )
        const refreshToken = jwt.sign(
            {email: findUser.email, _id: findUser._id},
            process.env.REFRESH_KEY,
            {expiresIn: '7d'}
        )
        return res.status(201).json(SuccessMessage("Login was successfull", "null", {accessToken, refreshToken}, 201));
    }catch(err){
        return res.status(500).json(ErrorMessage("Error while processing request", `Error: ${err}`, "null", 500));
    }
}

async function signUpFunction(req, res){
    try{
        const {name, email, password} = req.body;
        const findUser = await userModel.findOne({email});
        if(findUser){
            return res.status(500).json(ErrorMessage("Please provide a unique email id", `Error: User with the emailid ${email} already exists`, "null", 500));
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const response = await userModel.create({email, name, password: hashPassword});
        return res.status(200).json(SuccessMessage("SignUp was successfull", "true", response, 201))
    }catch(err){
        return res.status(500).json(ErrorMessage("Error while processing request", `Error: ${err}`, "null", 500));
    }
}


async function generateNewAccesstoken(req, res){
    try{
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(409).json(ErrorMessage("Refreshtoken not found", "Error: From the request body refreshtoken not found", "null", 409));
        };
        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, decoded) => {
            if(err){
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json(ErrorMessage("Refresh token expired", "Refresh token has expired; please log in again", null, 403));
                }
                if (err.name === "JsonWebTokenError") {
                    return res.status(403).json(ErrorMessage("Invalid refresh token", "Refresh token is invalid; please log in again", null, 403));
                }
                return res.status(403).json(ErrorMessage("Token error", `Unexpected error: ${err.message}`, null, 403));
            }
            const accessToken = jwt.sign(
                {email: decoded.email, _id: decoded._id},
                process.env.SECRET_KEY,
                {expiresIn: '15m'}
            )
            return res.status(200).json(SuccessMessage("AccessToken generated successfully", "null", {accessToken}, 200));
        })
    }catch(err){
        return res.status(500).json(ErrorMessage("Error while processing request", `Error: ${err}`, "null", 500));
    }
}

async function tokenValidation(req, res){
    try{
        const token = req.headers['authorization'];
        if(!token){
            return res.status(409).json(ErrorMessage("AccessToken not found", "Accesstoken not found from the request headers", "null", 409))
        }
        const accessToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        authorized: false,
                        response: ErrorMessage(
                            "Token expired",
                            "The access token has expired. Please use a refresh token or log in again.",
                            null,
                            401
                        ),
                    });
                }
                if (err.name === "JsonWebTokenError") {
                    return {
                        authorized: false,
                        response: ErrorMessage(
                            "Invalid token",
                            "The access token provided is invalid.",
                            null,
                            403
                        ),
                    };
                }
            }
            req.user = decoded;
            return res.status(200).json(SuccessMessage("User is authenticated", "Provided token is valid", req.user, 200));
        })
    }catch(err){
        return res.status(500).json(ErrorMessage("Error while processing request", `Error: ${err}`, "null", 500));
    }
}

module.exports = {
    loginFunction,
    signUpFunction,
    generateNewAccesstoken,
    tokenValidation
}