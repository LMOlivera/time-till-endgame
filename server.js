'use strict';
const express      = require('express');
const app = express();
const path         = require('path');                                                                                                                                                             
const session      = require('express-session');
const bodyParser   = require('body-parser');
app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
const helmet       = require('helmet');
const mongoose     = require('mongoose');
mongoose.set('useCreateIndex', true);

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

//User schema and model for MongoDB
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {type: String, required: true, unique: true},
  date: {type: Date, required: true},
  time: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);
/////////////////////////////////////

//Server security
//app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.noCache());
/////////////////

//Session secret
app.use(session({secret: process.env.SESSION_SECRET,
                 resave: false,
                 saveUninitialized: true}));

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'pug');

app.get('/', (req, res)=>{
  req.session.destroy();
  res.sendFile(__dirname + '/public/index.html');
});

app.use('/bewareof', (req, res)=>{
  if(req.query.date == undefined || req.query.time == undefined){
    res.redirect('/');
  }else{
    User.find({})
    .sort({name: "asc"})
    .exec((err, userList) =>{
    if (err){
      res.status(500)
        .type('text')
        .send("Error: Couldn't retrieve data from database.");
    }else{
      //Doesn't show people who goes the same day as you
      var dUsers = [];
      userList.forEach((user)=>{
        var u = {};
        var userDate = new Date(req.query.date);
        var listDate = new Date(user.date);
        if(userDate>listDate){
          u["name"] = user.name;
          u["date"] = user.date.toDateString();
          u["time"] = user.time;
          dUsers.push(u);
        }
      });
      
      var fUsers = [];
      userList.forEach((user)=>{
        var u = {};
        var userDate = new Date(req.query.date);
        var listDate = new Date(user.date);
        if(userDate<listDate){
          u["name"] = user.name;
          u["date"] = user.date.toDateString();
          u["time"] = user.time;
          fUsers.push(u);
        }
      });
      
      
      res.render(process.cwd() + '/views/pug/bewareof', {dangerousUsers: dUsers, fragileUsers: fUsers});
    }        
  });
}});

app.use('/success',(req, res)=>{
  if (req.query.name == "" || req.query.date == "" || req.query.time == ""){
    res.redirect('/');
  }else{
    var n = req.query.name;
    var Us = new User({name: n, date: req.query.date, time: req.query.time});
      Us.save((err, data) => {
        if (err){
          res.status(500)
          .type('text')
          .send("Error: Your data couldn't be saved. It could be a database error or that you entered a name that's already on the database.");
        }else{
          req.session.name = n;
          req.session.date = req.query.date;
          req.session.time = req.query.time;
          req.session.days = req.query.days;
          req.session.hours = req.query.hours;
          req.session.minutes = req.query.minutes;
          req.session.seconds = req.query.seconds;
          res.sendFile(__dirname + '/public/success.html');
        }
      });
    };
});

app.use('/twitter',(req, res)=>{
  if (req.session.name == "" || req.session.date == "" || req.session.time == "" || req.session.days == "" || req.session.hours == "" || req.session.minutes == "" || req.session.seconds == ""){
    res.redirect('/');
  }else{
    var time = (req.session.days>0 ? (req.session.days + " days, ") : "" )
               + (req.session.hours<10 ? ("0") : "") + req.session.hours + ":"
               + (req.session.minutes<10 ? ("0") : "") + req.session.minutes + ":"
               + (req.session.seconds<10 ? ("0") : "") + req.session.seconds;
    var text = "I," + req.session.name +", am watching Endgame on " + req.session.date + " at " + req.session.time + "!" + "\nThat means, from this moment, I have to wait " + time + "!\nCheck how much you have to wait to watch Endgame at https://time-till-endgame-v2.glitch.me/";
    res.redirect("https://twitter.com/intent/tweet?hashtags=Endgame&text=" + text);
  }
});

app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Error 404: Page Not Found');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
