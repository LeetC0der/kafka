require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { router } = require('./src/router/app.router');

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use('/auth', router);


require("./src/models/app.models");

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Auth application listening on port:- ${port}`);
})