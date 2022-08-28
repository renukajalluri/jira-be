const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const authRouter = require("./controllers/auth")
const userRouter = require('./controllers/user')
const projectRouter = require('./controllers/project')
const issueRouter = require('./controllers/issue')
const commentRouter = require('./controllers/comment')

mongoose.connect(config.MONGODB_URL,{
    useNewUrlParser:true,
}).then(()=>logger.info('DB connected Sucessfully'))
    .catch(err => logger.error('DB connection failed: ',err))

app.use(bodyParser.urlencoded({
    extended : true
  }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(middleware.requestLogger)
// Routers
app.use("/auth",authRouter)
app.use("/user",userRouter)
app.use("/project",projectRouter)
app.use("/issue",issueRouter)
app.use("/comment",commentRouter)
app.post('/ping', function (req, res) {
    console.log(req.body)
    res.send('welcome!');
  });

module.exports = app
