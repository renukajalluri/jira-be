const mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    name: {
      type: String,
      require: true
    },
    email:{
      type: String,
      require: true
    },
    job_role:{
        type: String,
        enum : ['manager', 'developer']
      },
    password:{
        type: String,
        require: true
    },
    date_of_joining:{
        type: Date
    },
    projects : [
        {
            type : mongoose.Schema.Types.ObjectID,
            ref : 'Project'
        }
    ],
    team_id : {
        type : mongoose.Schema.Types.ObjectID,
        ref : 'Team'
    }
  
  });

  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // the passwordHash should not be revealed
      delete returnedObject.password
    }
  })
  
  const User = mongoose.model("User", userSchema);
  module.exports = User