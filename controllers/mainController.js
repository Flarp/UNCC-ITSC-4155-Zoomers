/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the main site.
    Date: March 22nd, 2022

*/

const Professor = require("../model/professor.js")
const bcrypt = require("bcrypt")
const scrapingFunctions = require("../model/scraping")

//Get / index page
exports.index = async (req, res) => {
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
  let SISFunding = 0;
  const SISResearch = await Professor.find({ department: "SIS" });
  
  SISResearch.forEach(SISObject => {
    SISObject.research.forEach(researchItem => {
      SISFunding += parseInt(researchItem.amount); 
    })
  });

  //console.log(SISFunding);

  //Retrieving all CS data to sum up total funding within CS. (Department and sum of their research money in CSV)
  let CSFunding = 0;
  const CSResearch = await Professor.find({ department: "CS" });

  CSResearch.forEach(CSObject => {
    CSObject.research.forEach(researchItem => {
      CSFunding += parseInt(researchItem.amount);
    })
  });

  //console.log(CSFunding);

  //Retrieving all BioInformatics data to sum up total funding within BioInformatics. (Department and sum of their research money in CSV)
  let bioInfoFunding = 0;
  const bioInfoResearch = await Professor.find({ department: "Bioinformatics" });

  bioInfoResearch.forEach(bioObject => {
    bioObject.research.forEach(researchItem => {
      bioInfoFunding += parseInt(researchItem.amount);
    })
  });

  //console.log(bioInfoFunding);

  //Package department and their research funding sum together into an object to pass to the view... (This will visualize with D3). Scale funding in terms of millions.
  const researchFundingData = [
    {
      "department": "SIS",
      "researchFunding": (parseInt(SISFunding) / 1000000)
    },
    {
      "department": "Computer Science",
      "researchFunding": (parseInt(CSFunding) / 1000000)
    },
    {
      "department": "Bioinformatics",
      "researchFunding": (parseInt(bioInfoFunding) / 1000000)
    }
  ];

  res.send(researchFundingData);
}

//Get /contact contact page
exports.getContact = (req, res) => {
  res.render("contact")
}

//Get /map campus map page
exports.getMap = (req, res) => {
  res.render("campusMap")
}

exports.getProfProfile = async (req, res) => {
  //console.log(req)
  const { profId } = req.params
  const profData = await Professor.findOne({ _id: profId }).lean()

  res.render("profProfile", { profData })
}
