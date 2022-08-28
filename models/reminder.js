const mongoose = require('mongoose');

var reminderSchema = mongoose.Schema({
    time: {
      type: Date,
    },
    reminder_to:{
            type : mongoose.Schema.Types.ObjectID,
            ref : 'User'
        },
  });
  
const Reminder = mongoose.model("Team", reminderSchema);
module.exports = Reminder