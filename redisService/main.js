require('dotenv').config();

const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.extended({urlencoded: true}));


function ErrorMessage(error, message, data, code){
    let errorJson = {
        message, data, error, code
    }
    return errorJson;
}

app.get("/", (req, res) => {
    try{
        // next();
    }catch(err){
        return res.status(500).json(ErrorMessage(`Error:- ${err}`, "Error while processing the request", "null", 500))
    }
})


const port = process.env.PORT || 8002;

app.listen(port, (req, res) => {
    console.log('Application listening on port' + port);
})
