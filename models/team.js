const mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: {
      type: String,
      require: true
    },
    member:[
        {
            type : mongoose.Schema.Types.ObjectID,
            ref : 'User'
        }
    ],
  });
  
const Team = mongoose.model("Team", teamSchema);
module.exports = Team

