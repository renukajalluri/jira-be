const commentRouter = require('express').Router()
const Issue = require('../models/issue')
const Comment = require('../models/comment')
const {userAuthFilter} = require('../utils/middleware')

commentRouter.get('/:id',userAuthFilter,async (req,res)=>{
    try{
        const comments = await Comment.find({issue:req.params.id}).populate('user').exec()
        return res.status(200).json(comments)
    }catch(err){
        return res.status(500).json({message: err})
    }
    
})

commentRouter.post('/',userAuthFilter,async (req, res)=>{
    try{
        const {text,issue} = req.body
        const user = req.params.token.id
        const comment = await new Comment({
            text : text,
            user : user,
            issue :issue
        }).save()
        console.log(issue)
        const newIssue = await Issue.findByIdAndUpdate({_id:issue},{$push : {comments: comment.id}})
        console.log(newIssue)
        return res.status(200).json(comment)
    }catch(err){
        return res.status(500).json({message: err})
    }
    
})

module.exports = commentRouter