const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const {UserModel} = require('./models/user_model');


passport.serializeUser(function(user, done) {
    done(null, user._id);
});
   
passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    function(username, password, done) {
      UserModel.findOne({ email: username }, function (err, user) {
        if (err) {console.log("fkslkfslfkslfkslfk"); return done(err); }
        if (!user) { console.log("fksfks"); return done(null, false); }
        //if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: "1678489945665089",
    clientSecret: "32066ee4346af48bd7b3e325c852bab7",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    UserModel.findOne({ facebookId: profile.id }, function (err, user) {
      
      console.log(err)
      //return cb(err, user);
      if(err) return cb(err);
       
      if(user) return cb(null, user);

      /*
      var user = new UserModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          facebookId: profile.id
      })

      user.save(function(err){
        console.log(err)
        if(err) return cb(null, false, {message: "Unable to save user info"});

        return cb(null, user)
      })

      */
       UserModel.findOne({email: profile.emails[0].value}, function(err, user){
          
        if(err) return cb(err);

          if(user){
              user.facebookId = profile.id;

              user.save(function(err){
                if(err) return cb(null, false, {message: "Unable to save user info"});
    
                return cb(null, user)
              })
          }
         
          var user = new UserModel({
              name: profile.displayName,
              email: profile.emails[0].value,
              facebookId: profile.id
          })
      
          user.save(function(err){
            if(err) return cb(null, false, {message: "Unable to save user info"});

            return cb(null, user)
          })

       })
       

    })
  
  }
));