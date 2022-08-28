const User = require('../models/user');
const config = require('../utils/config')
const bcrypt = require("bcrypt")
const authRouter = require('express').Router()
const jwt  = require("jsonwebtoken")
const {userAuthFilter} = require('../utils/middleware')

// <--------Sign Up Route------->
authRouter.post("/sign-up",userAuthFilter,async(req,res)=>{
  try {
    if (req.params.token.job_role=='manager'){
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password,salt)
     const newUser = new User({
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword,
      job_role:req.body.job_role,
      date_of_joining:req.body.date_of_joining
  });
  const user = await newUser.save()
  return res.status(200).json(user)
  }
  else{
    return res.status(401).json('Not authorised')
  }
  } catch (error) {
    res.status(500).json({message:error})
    return
  }
})

//  <--------login Route------->
authRouter.post("/login",async(req,res)=>{
     try {
        const user ={}
        const userObj  = await User.findOne({email:req.body.email})
        !userObj && res.status(401).json("wrong creditials");
        const validPassword = await bcrypt.compare(req.body.password,userObj.password);
        !validPassword && res.status(400).json("Wrong Password")
        let now = new Date()
        let expires_in = new Date(now.setSeconds( now.getSeconds() + 10))
        user.expires_in = expires_in
        user.id=userObj.id
        user.email=userObj.email
        user.projects = userObj.projects
        user.job_role = userObj.job_role
        const accessToken = jwt.sign({
            id:userObj._id,
            job_role:userObj.job_role
        },config.SECRET)
       return res.status(200).json({user,accessToken})
     } catch (error) {
        res.status(500).json({message:error})
        return
     }
  
})

module.exports = authRouter
