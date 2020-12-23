var express = require('express');
const { body, validationResult } = require('express-validator');
const { Mailer } = require('./controller/mailer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next){
   res.render('about', {title: "About Page"})
})

router.get('/contact', (req, res) => {
  res.render('contact', {title: "Contact Us"})
})

router.post('/contact', [
  body('name').not().isEmpty().withMessage("Name field cannot be empty"),
  body('email').isEmail().withMessage("Invalid email"),
  body('message').not().isEmpty().withMessage("Message cannot be empty"),
],
async (req, res) => {
    
  var errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('contact', {
      title: 'contact us',
      'name': req.body.name,
      'email': req.body.email,
      'message': req.body.message,
      'errorMessages': errors.array()
    })
  }
  else{
    
    if(await Mailer(req.body.email, req.body.message))
      res.render('thankyou', {title: "Thank You"})
    else
      res.render('contact', {title: 'Contact us'});
  }


})

module.exports = router;
