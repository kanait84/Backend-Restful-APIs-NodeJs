var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const db = require('../model/database.js');
const bcrypt = require('bcryptjs');
const VerifyToken = require('../model/auth');

//Signup User
router.post('/SignupUser', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    db.User.findOne({email : req.body.email}, (err,result)=>{
        if (err) return res.status(501).send({auth : false,  message : 'Error on the server.', err});
        if(!result){
            db.User.create({
                    firstname   : req.body.firstname,
                    lastname    : req.body.lastname,
                    email       : req.body.email,
                    password    : hashedPassword,
                    role        : req.body.role
                },
                function (err, user) {
                    if (err) return res.status(501).send({auth:false, message:"Error on the server.", err})
                    if (user) return res.status(200).send({ auth: true, message : 'Registered Successfully.'});
                });
        }
        if(result){
            res.status(409).send({ auth: false, message : 'This email is already exist.' });
        }
    });
});

//LOGIN
router.post('/login', function(req, res) {
    db.User.findOne({ email: req.body.email}, function (err, user) {
        if (err) return res.status(501).send({auth : false,  message : 'Error on the server.', err});
        if (!user) return res.status(401).send({ auth: false,  mesaage: 'Invalid Email.' });
        if (user){
            // check if the password is valid
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).send({ auth: false,  mesaage: 'Invalid Password.'});
            // create a token
            var token = jwt.sign({ id: user._id }, db.secret, {
                expiresIn: 3600 // expires in 1 hour
            });
            // return the information including token as JSON
            res.status(200).send({ auth: true,  message: 'Login Successful' , user:{id:user._id, name:user.firstname,  role:user.role}, token });
        }
    });
});

//updating first or last name
router.post('/upname/:id', VerifyToken, function(req, res) {
    if (req.body.field === 'firstname'){
        db.User.findOneAndUpdate({_id : req.params.id},{
                firstname   : req.body.name
            },
            function (err, data) {
                if (err) return res.status(501).send({auth:false, message:"Error on the server.", err})
                if (data) return res.status(200).send({ auth: true, data:data});
            });
    }
    if (req.body.field === 'lastname'){
        db.User.findOneAndUpdate({_id : req.params.id},{
                lastname   : req.body.name
            },
            function (err, data) {
                if (err) return res.status(501).send({auth:false, message:"Error on the server.", err})
                if (data) return res.status(200).send({ auth: true, data:data});
            });
    }
});

//Store Customer Support Tickets
router.post('/createticket/:id', VerifyToken, function(req, res) {
    db.supportTicket.create({
            userId         :   req.params.id,
            message        :   req.body.message
        },
        function (err, data) {
            if (err) return res.status(501).send({auth:false, message:"Error on the server.", err})
            if (data) return res.status(200).send({ auth: true, data:data});
        });
});

//get list of all Customer Support Tickets
router.get('/getTickets', VerifyToken, function(req, res, next) {
    db.supportTicket.find({},(err, data)=>{
        if (err) return res.status(501).send({auth:false, message:"Error on the server.", err})
        if (data) return res.status(200).send({ auth: true, data:data });
    })
});

module.exports = router;
