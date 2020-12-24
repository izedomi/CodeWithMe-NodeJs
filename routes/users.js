const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const {UserModel} = require('../models/user_model'); 
const { authenticate } = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){
    res.render('login', {title: "Login to account"})
});

router.get('/register', function(req, res, next){
  res.render('register', {title: "Register"})
});

router.post('/register', [
  body('name').not().isEmpty().withMessage("Name field cannot be empty"),
  body('email').isEmail().withMessage("Invalid email"),
  body('password').not().isEmpty().isLength({ min: 5 }).withMessage("Password field cannot be empty"),
],
async function(req, res, next){

  var errors;

  try{

      //validate input
      errors = validationResult(req);
    
      if(!errors.isEmpty()){
        return res.render('register', {
          title: 'Register Us',
          'name': req.body.name,
          'email': req.body.email,
          'password': req.body.password,
          'errorMessages': errors.array()
        })
      }

      const {name, email, password, confirm_password} = req.body;

      //check if user already exists
      const user = await UserModel.findOne({email: email});

      if(user){

        errors = [];
        errors.push({msg: "User email already exists", param: 'email'});

        return res.render('register', {
          title: 'Register Us',
          'name': name,
          'email': email,
          'password': password,
          'errorMessages': errors
        })
        //return res.status(400).json({message: "User email already exists"});
      }
  
      //confirm that password and confirm password is the same
      if(password.trim() !== confirm_password.trim()){

        errors = [];
        errors.push({msg: "Password/Confirm password field do not match", param: 'email'});

        return res.render('register', {
          title: 'Register Us',
          'name': name,
          'email': req.body.email,
          'password': password,
          'errorMessages': errors
        })

      }

      const salt = await bcrypt.genSalt(10);
      
      bcrypt.hash(password, salt, async function(err, hash) {
        // Store hash in your password DB.

        if(!err){
          
          const User = new UserModel({
            name: name,
            email: email,
            password: hash
          });

          await User.save();

          passport.authenticate('local')(req, res, function () {
            res.redirect('/');
          });

          //return res.render('login', {title: "Login to account"})

        }else{

          errors = [];
          errors.push({msg: "Unprocessible entity", param: 'email'});
          return res.render('register', {
            title: 'Register Us',
            'name': name,
            'email': req.body.email,
            'password': password,
            'errorMessages': errors
          })
        }
      });

  }
  catch(e){
    errors = [];
    errors.push({msg: "Something went wrong. Action couldn't be completed", param: 'email'});
    return res.render('register', {
      title: 'Register Us',
      'name': req.body.name,
      'email': req.body.email,
      'password': password,
      'errorMessages': errors
    })
  }

});

router.post('/login', 
[
  body('email').not().isEmpty().withMessage("Email field cannot be empty"),
  body('password').not().isEmpty().withMessage("Password field cannot be empty"),
  passport.authenticate('local', { failureRedirect: '/users/login' }),
],
  function(req, res) {
   res.redirect('/');
});


router.get('/logout', (req, res, next) => {
   req.logOut();
   res.redirect('/');
});



/*
router.post('/login', [
 
  body('email').not().isEmpty().withMessage("Email field cannot be empty"),
  body('password').not().isEmpty().withMessage("Password field cannot be empty"),
  //passport.authenticate('local', { failureRedirect: '/login' }),
],
async (req, res, next) => {

  var errors;

  try{

       //validate input
       errors = validationResult(req);
    
       if(!errors.isEmpty()){
          return res.render('login', {
            title: 'Register Us',
            'email': req.body.email,
            'password': req.body.password,
            'errorMessages': errors.array()
          })
       }

      const {email, password} = req.body;
    
      const user = await UserModel.findOne({email: email});

      if(!user){
       
        errors = [];
        errors.push({msg: "User email already exists", param: 'email'});

        return res.render('login', {
          title: 'Login into account',
          'email': email,
          'password': password,
          'errorMessages': errors
        })
      }
      
      const match = await bcrypt.compare(password, user.password);
    
      if(match) {
        console.log("authenticated successfully");
        res.status(200).json({message: "User logged in successfully", data: user});
      }
  }
  catch(e){
      console.log(e.message)

      errors = [];
      errors.push({msg: "Something went wrong. Action couldn't be completed", param: 'email'});
      return res.render('login', {
        title: 'Login into account',
        'email': email,
        'password': password,
        'errorMessages': errors
      })
  }
 
})

*/



module.exports = router;
