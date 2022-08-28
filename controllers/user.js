const User = require('../models/user');
const userRouter = require('express').Router()
const {userAuthFilter} = require('../utils/middleware')

userRouter.get('/',userAuthFilter, async (req, res)=>{
    try{
        const users = await User.find()
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
    }
})

userRouter.get('/:id',userAuthFilter ,async (req,res)=>{
        console.log(req.params.id)
    try{
        const user = await User.findById({_id : req.params.id})
        res.status(200).json(user)
    }
    catch(err){
        console.log(err)
    }
})

userRouter.get('/team/:team_id', async (req,res)=>{
    try{
       const users = await User.find({team_id : req.params.team_id})
       res.status(200).json(users) 
    }
    catch(err){
        console.log(err)
    }
})

module.exports = userRouter