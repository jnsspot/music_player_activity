const express = require('express');
const routes = require('./routes/router');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', routes);
app.listen(1500,()=>{
    console.log('server running on http://localhost:1500');
})