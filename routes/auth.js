const User = require('../models/userModel');

const bcrypt = require('bcrypt');
const express = require('express');

const router = express.Router();

//APIs

router.post('/register', async(req, res)=>{
    try{

      const authUser = await User.find({
        userEmail: req.body.userEmail
      });

      if(authUser.length!==0){
        // return res.status(404).json("Email already exists!");
        return res.json(authUser[0]);
      }

      const user = await User.create({ 
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPriority: req.body.userPriority,
        userImage: req.body.userImage,
      });
      
      return res.json(user);
    }catch(e){
      // res.status(404).json("Something went wrong.");
      console.log(e.message);
      res.status(404).json(e.message);
    }
});

router.post('/login', async(req, res)=>{
    try{
      const user = await User.find({
        userEmail: req.body.userEmail
      });

      if(user.length===0){
        return res.status(404).json("Please login");
      }

      let isPasswordSame = await bcrypt.compare(req.body.userPassword, user[0].userPassword);

      if(isPasswordSame===true){
        res.json(user[0]);
      }else{
        res.status(404).json("Password is wrong");
      }

    }catch(e){
      // res.status(404).json("Something went wrong.");
      console.log(e.message);
      res.status(404).json(e.message);
    }
});

module.exports = router;