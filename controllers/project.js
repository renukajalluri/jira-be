const projectRouter = require('express').Router()
const Project = require('../models/project')
const {userAuthFilter} = require('../utils/middleware')
const User = require('../models/user')

projectRouter.post('/',userAuthFilter,async (req,res)=>{
    try{
        console.log(req.params)
        if (req.params.token.job_role=='manager'){
            const {name , owner, members, description, no_of_sprints,start_date,end_date} = req.body
            const project = await new Project({
                name : name,
                owner : owner,
                members : members,
                description : description,
                no_of_sprints : no_of_sprints,
                start_date : start_date,
                end_date : end_date
            }).save()
            console.log(project)
            return res.status(200).json(project)
        }
        return res.status(401).json('Not authorized')
    }
    catch (e){
        return res.status(500).json({message: e})
    }
})

projectRouter.get('/',userAuthFilter, async (req,res)=>{
    try{
        const projects = await Project.find({}).populate('members').populate('issues').exec()
        res.status(200).json(projects)
    }
    catch (e){
        return res.status(500).json({message: e})
    }
})

projectRouter.get('/:id',userAuthFilter, async (req,res)=>{
    try{
        const projects = await Project.findById(req.params.id).populate('owner').populate('members').exec()
        res.status(200).json(projects)
    }
    catch (e){
        return res.status(500).json({message: e})
    }
})

module.exports = projectRouter;