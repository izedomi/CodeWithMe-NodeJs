
const mongoose = require('mongoose');

var TaskSchema = mongoose.Schema;


module.exports = mongoose.model('Task', TaskSchema({content: String}))