const express= require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'eyJhbGci';

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc);
    }catch (err){
        res.status(422).json(err);
    }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
        const userDoc = await User.findOne({email});
        if (userDoc){
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if(passOk){
                jwt.sign({email:userDoc.email, id:userDoc._id, name: userDoc.name}, jwtSecret, {}, (err, token) => {
                    if(err) throw err;
                    res.cookie('token',token).json(userDoc);
                });
            }
            else{
                res.status(422).json('error');
            }
        }else{
            
        }
   
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        });
    }
    else{
        res.json(null);
    }
    
});

app.listen(4000);