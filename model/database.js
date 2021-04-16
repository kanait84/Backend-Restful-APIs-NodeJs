const mongoose = require('mongoose');

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/users', {useCreateIndex: true,
useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false }); 
var db = mongoose.connection;

// handle mongo error
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
 console.log('Database Connected');
});

//schema for users
  var userSchema = mongoose.Schema({
    firstname       :     { type: String, required: true},
    lastname        :     { type: String, required: true},
    email           :     { type: String, required: true, unique: true},
    password        :     { type: String, required: true},
    role         	:     { type: String, required: true},
    timestamp       :     { type: Date, default:Date.now}
  });
var user = mongoose.model('user', userSchema);

//schema for CustomerSupport Tickets
var supportTicketSchema = mongoose.Schema({
  userId          :     { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  message         :     { type: String, required: true},
  timestamp       :     { type: Date, default:Date.now}
});
var supportTicket = mongoose.model('supportTicket', supportTicketSchema);
    
module.exports = {
  User          :  user,
  supportTicket :  supportTicket,
  secret        :  'no_one_will_ever_figure_out_abot_Users'
}
