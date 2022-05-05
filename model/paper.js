const { default: mongoose } = require("mongoose")

const Paper = new mongoose.Schema({
  title: String,
  creators: [String],
  url: String,
  publication: String,
  published: Date,
}, {collectionName: 'papers'})

module.exports = mongoose.model('Paper', Paper, 'papers')
