/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the main site.
    Date: March 22nd, 2022

*/

const Professor = require("../model/professor.js")
const Paper = require("../model/paper.js")
const bcrypt = require("bcrypt")
const scrapingFunctions = require("../model/scraping")
const professorMapDataScraped = require("../public/data/googleMapData.json")
const User = require("../model/model");

//Get / index page
exports.index = async (req, res) => {
  //console.log(res.locals)
  //Retrieve the async function from the scraper function. //Execute the async function and return the promise to the
  const executeScrape = scrapingFunctions.getResearchHeadlines
  const scrapeNewsPromise = executeScrape()

  //Consume the promise returned from the async function... retrieve news information object
  scrapeNewsPromise
    .then((newsDataArray) => {
      //console.log(newsDataArray);
      res.render("index", { newsDataArray })
    })
    .catch((error) => {
      //Error occurred when consuming promise?
      console.log(
        "An error has occurred when retreiving the data object from the scrap.\n" +
          error.message
      )
    })
}

//Provide JSON data of research funding from this /api/data path.. This will give it to the d3 visualizer to make a bar graph
exports.getData = async (req, res) => {
  //Retreiving all SIS data to sum up total funding within SIS. (Department and sum of their research money in CSV)
  let SISFunding = 0
  const SISResearch = await Professor.find({ department: "SIS" })

  SISResearch.forEach((SISObject) => {
    SISObject.research.forEach((researchItem) => {
      SISFunding += parseInt(researchItem.amount)
    })
  })

  //console.log(SISFunding);

  //Retrieving all CS data to sum up total funding within CS. (Department and sum of their research money in CSV)
  let CSFunding = 0
  const CSResearch = await Professor.find({ department: "CS" })

  CSResearch.forEach((CSObject) => {
    CSObject.research.forEach((researchItem) => {
      CSFunding += parseInt(researchItem.amount)
    })
  })

  //console.log(CSFunding);

  //Retrieving all BioInformatics data to sum up total funding within BioInformatics. (Department and sum of their research money in CSV)
  let bioInfoFunding = 0
  const bioInfoResearch = await Professor.find({ department: "Bioinformatics" })

  bioInfoResearch.forEach((bioObject) => {
    bioObject.research.forEach((researchItem) => {
      bioInfoFunding += parseInt(researchItem.amount)
    })
  })

  //console.log(bioInfoFunding);

  //Package department and their research funding sum together into an object to pass to the view... (This will visualize with D3). Scale funding in terms of millions.
  const researchFundingData = [
    {
      department: "SIS",
      researchFunding: parseInt(SISFunding) / 1000000,
    },
    {
      department: "Computer Science",
      researchFunding: parseInt(CSFunding) / 1000000,
    },
    {
      department: "Bioinformatics",
      researchFunding: parseInt(bioInfoFunding) / 1000000,
    },
  ]

  res.send(researchFundingData)
}

//Get /contact contact page
exports.getContact = (req, res) => {
  res.render("contact")
}

//Get /map campus map page
exports.getMap = async (req, res) => {
  const listOfResearchProfs = []
  const researchProfs = await Professor.find({}, { professor: 1 })

  //Create arrays of information that will hold the whole set of data.
  let mapData = []

  //Random subset that will be displayed to the page
  let randomSubset = []
  let selectedValues = new Set()
  let uniqueArray = []

  //Place all professor names into an array
  researchProfs.forEach((e) => {
    listOfResearchProfs.push(e.professor)
  })

  //For each entry in the JSON file, extract the key and value of the object
  for (const [professor, value] of Object.entries(professorMapDataScraped)) {
    //Filter out all the professors who do not research at UNCC. (Subset will be objects passed back to view)
    if (listOfResearchProfs.includes(professor)) {
      mapData.push({
        professorName: professor,
        professorOffice: value.office,
        professorImage: value.image,
        profDepartment: value.department,
      })
    }
  }

  //While you dont have 4 unqiue random values, keep going
  while (selectedValues.size !== 4) {
    //Add a random value to the set if it is unique when generated
    selectedValues.add(Math.floor(Math.random() * 61))
  }

  //Do not code at 4am, I will destroy you brain you cretin
  selectedValues.forEach((number) => {
    uniqueArray.push(number)
  })

  //console.log(selectedValues);
  //console.log(uniqueArray);

  uniqueArray.forEach((number) => {
    randomSubset.push(mapData.at(number))
  })

  //console.log(randomSubset);

  res.render("campusMap", { randomSubset })
}

exports.getProfProfile = async (req, res) => {
  //console.log(req)
  const { profId } = req.params
  let userId = req.session.account;

  const prof = await Professor.findOne({ _id: profId })
  const classes = await prof.getUniqueClasses()
  const papers = await prof.getAuthoredPapers()

  const profData = prof.toObject()
  profData.classes = classes
  profData.papers = papers

  //Determine if logged in or not.
  if(userId) {
    const userData = await User.findOne({ _id: userId })
    let isFavorite;
    let userFavs = userData.favorites;

    //Check to see if current prof is a favorite. Set boolean, return to render.
    if(userFavs.includes(profId)) {
      isFavorite = true;
    } else {
      isFavorite = false;
    }

    const profData = await Professor.findOne({ _id: profId }).lean()
    res.render("profProfile", { profData, isFavorite })
  }
  
  //Not logged in, proceed normally
  if(!userId) {
    let isFavorite = false;
    const profData = await Professor.findOne({ _id: profId }).lean()
    res.render("profProfile", { profData, isFavorite })
  }
}

exports.addReview = async(req, res) => {
  const newReview = req.body;
  let profId = req.params.profId;
  const profData = await Professor.findById(profId)

  profData.reviews.push(newReview);

  profData.save().then(() => {
    res.redirect(`/professor/${profId}`)
  }).catch(error => {
    console.log("An error has occurred when trying to save a review for this professor.");
  });


}
