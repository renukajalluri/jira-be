const mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: {
      type: String,
      require: true
    },
    user:
        {
            type : mongoose.Schema.Types.ObjectID,
            ref : 'User'
        },
    issue :{
        type : mongoose.Schema.Types.ObjectID,
        ref : 'Issue'
    },
    date_of_creation: {
      type : Date,
      default: Date.now()
  },
  });
  
  commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // the passwordHash should not be revealed
      returnedObject.date_of_creation = returnedObject.date_of_creation.toLocaleString()
    }
  })

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment