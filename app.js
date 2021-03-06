require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express()




app.use(bodyParser.urlencoded({ extended: true}))
app.set('view engine', 'ejs');
app.use(express.static('public'))


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect('mongodb://localhost:27017/secretUserDB');


// create a schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// create a model
const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render("home")
});

app.get('/register', (req, res) => {
  res.render("register")
});

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()){
        res.render("secrets")
    }else{
        res.redirect("/login")
    }
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.post('/register', (req, res) => {
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect("/register");
         }else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets")
            });
         }
        });
});
  
app.post('/login', (req, res) => {

    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.log(err);
        }else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets")
            });
        }
    })
    
});
  

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})