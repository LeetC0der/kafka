require('dotenv').cofig();
const express = require('express');
const cors = require('cors');
const { auth } = require('./routers/auth');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const port = process.env.PORT || 3001;

app.get("/api", async (req, res) => {
    try{
        const {api, authorization} = req.body;
        if(!api){
            return;
        }else if(!authorization){
            return;
        }else{
            const authResponse = await axios.post();
            return;
        }
    }catch(err){
        return ;
    }
})


app.listen(port, (req, res) => {
    console.log(`Application listening to the port ${port}`);
});