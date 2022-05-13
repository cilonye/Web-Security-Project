require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express()

app.use(bodyParser.urlencoded({ extended: true}))
app.set('view engine', 'ejs');
app.use(express.static('public'))
mongoose.connect('mongodb://localhost:27017/secretUserDB');

// creat a schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// create a model
User = new mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render("home")
});

app.get('/register', (req, res) => {
  res.render("register")
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.post('/register', (req, res) => {
    // create a user
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    // save the user and if save the render secret page
    newUser.save(function (err) {
        if (err) {
            console.error(err);
        }else {
            res.render("secrets");
        }
    })
});
  
app.post('/login', (req, res) => {
    // Get user input
    const userEmail = req.body.username;
    const userPassword = md5(req.body.password);

    //   check if an email exists 
    // check if the password match the email
    // if that is the case then return the secret page
    User.findOne({email: userEmail}, (err, user) => {
        if (err) {
            console.log(err);
        }else {
            if (user){
                console.log(user);
                if (user.password === userPassword) {
                    res.render("secrets")
                }
            }
        }
    })
});
  

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})