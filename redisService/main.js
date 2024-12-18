require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Client } = require('./client');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


function ErrorMessage(error, message, data, code){
    let errorJson = {
        message, data, error, code
    }
    return errorJson;
}

app.post("/insertMsg", async (req, res) => {
    try{
        const {id, message} = req.body;
        const response = await Client.set(`msg:${id}`, `${message}`);
        return res.status(201).json({
            message: response,
            status: 201
        })
    }catch(err){
        return res.status(500).json(ErrorMessage(`Error:- ${err}`, "Error while processing the request", "null", 500))
    }
})


const port = process.env.PORT || 8002;

app.listen(port, (req, res) => {
    console.log('Application listening on port' + port);
})
