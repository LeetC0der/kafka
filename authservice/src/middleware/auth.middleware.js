const joi = require('joi');
const { ErrorMessage } = require('../helper/helper');
const jwt = require('jsonwebtoken')

function validateSignUp(req, res, next){
    try{
        const joiObject = joi.object({
            name: joi.string().min(3).max(100).required(),
            email: joi.string().email().required(),
            password: joi.string().min(4).max(100).required()
        })
        const {error} = joiObject.validate(req.body);
        if(error){
            return res.status(400).json(ErrorMessage("Please provide all the required fields", `Error ${error.message}`, "null", 400))
        }
        next();
    }catch(err){
        return res.status(500).json(ErrorMessage("Error while processing the request", `Error: ${err}`, "null", 500))
    }
}

function validateLogin(req, res, next){
    try{
        const joiObject = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(4).max(100).required()
        })
        const {error} = joiObject.validate(req.body);
        if(error){
            return res.status(400).json(ErrorMessage("Please provide all the required fields", `Error ${error.message}`, "null", 400))
        }
        next();
    }catch(err){
        return res.status(500).json(ErrorMessage("Error while processing the request", `Error: ${err}`, "null", 500))
    }
}

function authValidation(req, res, next) {
    try {
        const authToken = req.headers['authorization'];
        if (!authToken) {
            return res.status(401).json(ErrorMessage("Token not found", "Authorization header is missing", null, 401));
        }

        const token = authToken.split(" ")[1];
        if (!token) {
            return res.status(400).json(ErrorMessage("Invalid token format", "Authorization header must be in the format: Bearer <token>", null, 400));
        }

        console.log("Extracted Token:", token);

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json(ErrorMessage("Access token expired", "Access token has expired; please use a refresh token to get a new one", null, 401));
                }
                if (err.name === "JsonWebTokenError") {
                    return res.status(403).json(ErrorMessage("Invalid access token", "Access token is invalid; please log in again", null, 403));
                }
                return res.status(403).json(ErrorMessage("Token error", `Unexpected error: ${err.message}`, null, 403));
            }

            console.log("Decoded Token:", decoded);
            req.user = decoded;
            next();
        });
    } catch (err) {
        return res.status(500).json(ErrorMessage("Server error", `Error: ${err.message}`, null, 500));
    }
}


module.exports = {
    validateLogin,
    validateSignUp,
    authValidation
}