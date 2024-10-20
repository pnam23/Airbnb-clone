const express= require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');
const imgDownload = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'eyJhbGci';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));



app.get('/test', (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
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

app.post('/login', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.json('not found');
    }
});

app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
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


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});


app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
      return res.status(400).json({ error: 'Invalid URL. Only http and https are supported.' });
  }
  const newName = 'pic' + Date.now() + '.jpg';
  try {
      await imgDownload.image({
          url: link,
          dest: __dirname + '/uploads/' + newName,
      });
      res.json(newName);
  } catch (err) {
      res.status(500).json({ error: 'Image download failed' });
  }
});


const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100) ,(req, res) => {
    const uploadFiles = [];
    
    req.files.forEach((file) => {
        const { path: tempPath, originalname } = file; 
        const ext = path.extname(originalname);  
        const newPath = tempPath + ext;

        try {
            fs.renameSync(tempPath, newPath);
            const fileName = path.basename(newPath);  
            uploadFiles.push(fileName);
        } catch (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ error: 'File renaming failed' });
        }
    });
    res.json(uploadFiles);
});

app.listen(4000);