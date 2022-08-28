const mongoose = require('mongoose');

var projectSchema = mongoose.Schema({

    name: {
      type: String,
      require: true
    },
    owner:{
      type : mongoose.Schema.Types.ObjectID,
      ref : 'User'
    },
    members:[
        {
            type : mongoose.Schema.Types.ObjectID,
            ref : 'User'
        }
    ],
    description :{
        type: String
    },
    no_of_sprints : {
        type : String,
    },
    start_date : {
      type: Date
    },
    end_date : {
      type: Date
    },
    issues : [
      {
        type : mongoose.Schema.Types.ObjectID,
        ref : 'Issue'
      }
    ]
  });
  projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // the passwordHash should not be revealed
      returnedObject.start_date = returnedObject.start_date.toLocaleDateString()
      returnedObject.end_date = returnedObject.end_date.toLocaleDateString()
    }
  })

  const Project = mongoose.model("Project", projectSchema);
  module.exports = Project