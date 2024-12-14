const { loginFunction, signUpFunction, generateNewAccesstoken, tokenValidation } = require('../controllers/auth.controller');
const { SuccessMessage } = require('../helper/helper');
const { validateLogin, validateSignUp, authValidation } = require('../middleware/auth.middleware');

const router = require('express').Router();

router.post('/login', validateLogin, loginFunction);
router.post ('/signup', validateSignUp, signUpFunction);
router.post("/getaccesstoken", generateNewAccesstoken);
router.post("/validate", tokenValidation);
router.post("/products", authValidation, (req, res) => {
    try{
        const products = [{message: 'p1', type:'e'}, {message: 'p2', type: 'e'}, {message: 'p3', type: 's'}]
        return res.status(200).json(SuccessMessage("Products queried successfully", "null", products, 200))
    }catch(err){
        return res.status(500).send({message: err})
    }
})



module.exports = {
    router
}