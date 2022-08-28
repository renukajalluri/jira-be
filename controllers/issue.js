const issueRouter = require('express').Router()
const { router } = require('../app');
const Issue = require("../models/issue");
const Project = require("../models/project")
const {userAuthFilter} = require('../utils/middleware')
const schedule = require('node-schedule');
const {sendEmail , checkComment} = require("../utils/scheduler")
const axios = require('axios')
const { extractId} = require("../utils/extractId")

issueRouter.post("/",userAuthFilter, async(req,res)=>{
    try {
        const issue = await new Issue({
            priority:req.body.priority,
            project_id : req.body.project_id,
            created_by:req.params.token.id,
            issued_to:req.body.issued_to,
            status:req.body.status,
            type:req.body.type,
            tags:req.body.tags,
            story_points:req.body.story_points,
            summary : req.body.summary,
            description : req.body.description,
        }).save()
        console.log(issue)
        console.log(issue.id);
        console.log(req.body.project_id)
        const response = await axios.post(`http://0.0.0.0:5000/index`,
        {
            issue_id : issue.id,
            project_id : req.body.project_id,
            document : issue.summary + " "+issue.description
        },
        { headers :{ "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          // 'Authorization' : token
        }})
        console.log(response.data)
        const project = await Project.findByIdAndUpdate({_id:req.body.project_id},{$push:{issues : issue._id}})
        const id = issue.id
        let now = new Date()
        let date = new Date(now.setSeconds( now.getSeconds() + 180))
        const job = schedule.scheduleJob(date, async function(id){
            const jobIssue = await Issue.findById(id).populate('issued_to').populate('comments').exec()
            const assignees = jobIssue.issued_to
            for(let i in assignees){
                if(!checkComment(assignees[i],jobIssue)){
                    const res = await sendEmail(assignees[i].email)
                    console.log(res)
                }
            }
            
            // else{
            //     console.log('already commented')
            // }
          }.bind(null,id));
        return res.status(200).json(project)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
    }
})



issueRouter.get("/:issueId",userAuthFilter, async(req,res)=>{
    try {
        const issue = await Issue.findById({_id:req.params.issueId}).populate('project_id').populate('issued_to').populate('created_by').populate('comments').exec();
        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({message:error})
    }
})


issueRouter.get("/related-issues/:issueId",userAuthFilter,async(req,res)=>{
    try {  
        const issue = await Issue.findById({_id:req.params.issueId}).populate('project_id').populate('issued_to').populate('created_by').populate('comments').exec();
         const search =  issue.summary;
        //  console.log("s",search)
        try {
          const data = await axios.get(`http://0.0.0.0:5000/search?search=${search}`,
          { headers :{ "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          // 'Authorization' : token
      }});

      if(data){
        let issues =[]
        // let paramsId = req.params.issueId-/
        const array = data.data.Issues
        // console.log("a",array)
        for(let i in array){

          let relatedIssues =   array[i]
        //   console.log("re",relatedIssues)
        // console.log("i",relatedIssues)
          var ids = extractId(relatedIssues)
          console.log("ids",ids[0])
          const project = await Project.findById({_id : ids[1]})
        //   console.log("pro",project)
          const members = project.members
          for(let i in members){
            // console.log(req.params.token.id,members[i])
            if(req.params.token.id==members[i]){
                issues.push(ids[0])
            }
          }
          
        }
        // console.log("i",issues)
        


        const filterIssues =    issues.filter(i=>{
          return  i != req.params.issueId
        })
        // console.log(filterIssues,"f")
          
                const issuesData = await Issue.find({
                    '_id': { $in: filterIssues }
                },{"summary":1,"description":1,"status":1,"priority":1}).exec()

                // console.log(issuesData)
                return res.status(200).json(issuesData)

      }
        } catch (error) {
            // res.status(500).json({message:error})
            console.log(error)
        }
        
        return res.status(200).json(issuesData)
    } catch (error) {
        // res.status(500).json({message:error})
        console.log(error)
    }
})



issueRouter.put("/:issueId",userAuthFilter,async(req,res)=>{
    try {
        const updatedIssue = await Issue.findByIdAndUpdate({_id:req.params.issueId},{
            $set:req.body,
        },{new:true})
        console.log(updatedIssue)
        res.status(200).json(updatedIssue)
    } catch (error) {
        res.status(500).json({message:error})
    }
})

issueRouter.get("/",userAuthFilter,async(req,res)=>{
    try {
         const issues = await Issue.find().populate('project_id').populate('issued_to').populate('created_by').populate('comments').exec()
         res.status(200).json(issues)
    } catch (error) {
        res.status(500).json({message:error})
    }
})

issueRouter.get("/issueByProject/:projectId",userAuthFilter,async(req,res)=>{
    try {
        const issues = await Issue.find({project_id:req.params.projectId})
        .populate('created_by').populate('issued_to').populate('project_id').populate('comments').exec()
        console.log(issues)
        res.status(200).json(issues)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
    }
})
issueRouter.get("/schedule/:id",async(req,res)=>{
    try {
        const id = req.params.id
        let now = new Date()
        let date = new Date(now.setSeconds( now.getSeconds() + 5))
        const job = schedule.scheduleJob(date, function(y){
            console.log(id);
          }.bind(null,id));
        return res.status(200).json('job')
    } catch (error) {
        res.status(500).json({message:error})
    }
})


module.exports = issueRouter
