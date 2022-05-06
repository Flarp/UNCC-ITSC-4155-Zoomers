const { default: mongoose } = require("mongoose")
const Paper = require('./paper.js')

const Class = new mongoose.Schema({
  dept: String,
  code: String,
  name: String,
  days: [String],
  time: [String],
  section: String
})

const Research = new mongoose.Schema({
  title: String,
  amount: String,
  sponsor: String,
  beginDate: String,
  endDate: String,
  fiscalYear: Number,
})

const Review = new mongoose.Schema({
  title: String,
  reviewText: String,
})

const ProfessorSchema = new mongoose.Schema({
  professor: String,
  department: String,
  researchAreas: [String],
  broadResearchAreas: [String],
  homePage: [String],
  classes: [Class],
  research: [Research],
  reviews: [Review],
})

ProfessorSchema.methods.getUniqueClasses = function() {
  return mongoose.model('Professor')
  .aggregate([
    {$match: {_id: this._id}},
    {$project: {classes: {section: 0}}},
    {$unwind: "$classes"},
    {$group: {_id: null, classes: {$addToSet: "$classes"}}},
    {$unwind: "$classes"},
    {$replaceRoot: { newRoot: "$classes" }}
  ])
}

ProfessorSchema.methods.getAuthoredPapers = function() {
  return Paper.find({creators: this.professor}).lean()
}

ProfessorSchema.methods.getSampleAuthoredPapers = function() {
  return Paper.find({creators: this.professor}).limit(5).lean()
}

module.exports = new mongoose.model("Professor", ProfessorSchema)
