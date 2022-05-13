require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;



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
    bcrypt.hash(req.body.password, saltRounds, function(bcryptErr, hash) {
        // Store hash in your password DB.
        if (bcryptErr) {
            console.log(bcryptErr);
        }else {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            
            // save the user and if save the render secret page
            newUser.save(function (err) {
                if (err) {
                    console.error(err);
                }else {
                    res.render("secrets");
                }
            })
        }
        
    });
    
});
  
app.post('/login', (req, res) => {
    // Get user input
    const userEmail = req.body.username;
    const userPassword = req.body.password;

    //   check if an email exists 
    // check if the password match the email
    // if that is the case then return the secret page
    User.findOne({email: userEmail}, (err, user) => {
        if (err) {
            console.log(err);
        }else {
            if (user){
                bcrypt.compare(userPassword, user.password, function(compareErr, result) {
                    if (result === true){
                        res.render("secrets")
                    }else {
                        console.log(compareErr)
                    }
                });
            }
        }
    })
});
  

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})