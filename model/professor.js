const { default: mongoose } = require("mongoose")

const Class = new mongoose.Schema({
  dept: String,
  code: String,
  name: String,
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

module.exports = new mongoose.model("Professor", ProfessorSchema)
