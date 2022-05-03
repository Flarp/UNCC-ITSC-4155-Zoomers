/* 
    ITSC 4155 - Group 3: "The Zoomers"
    Scraping component that will scrape all the data at once to deliver to the main application.
    Date: March 22nd, 2022

*/

const axios = require("axios");
const { header } = require("express/lib/request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//Function for scraping news headlines from UNCC Domain
//PROBLEM: What if the article is posted without an image? This has occurred twice in the last 3 years, and one of those occurrences happened today.
exports.getResearchHeadlines = async function() {
    try {

        //Grab the UNCC page. Create extract the HTML body into a JSDOM object. 
        const response = await axios.get("https://inside.charlotte.edu/research");
        const domResponse = new JSDOM(response.data);

        //Grabbing headers from the html body
        let headerNodeList = domResponse.window.document.querySelectorAll(".article-title > a");
        let anchorInformation = Array.from(headerNodeList);
        const headerText = [];

        //We are only needing 3, change i to retreive more headers... (Not using all data).
        for(let i = 0; i < 6; i++) {
            headerText.push(anchorInformation[i].textContent);
        }
        //console.log(headerText); 

        //Grabbing Date Posted from the html body
        let dateNodeList = domResponse.window.document.querySelectorAll(".article-post-date > span");
        let dateSpanInformation = Array.from(dateNodeList);
        const dateText = [];

        //We are only needing 3, change i to retreive more dates... (Not using all data).
        for(let i = 0; i < 6; i++) {
            dateText.push(dateSpanInformation[i].textContent);
        }
        //console.log(dateText);

        //Grabbing Image source from the HTML body
        let imageNodeList = domResponse.window.document.querySelectorAll(".article-image > img");
        let imageSrcInformation = Array.from(imageNodeList);
        const imageSrc = [];

        //We are only needing 3, change i to retrieve more srcs... (Not using all the data).
        for(let i = 0; i < 6; i++) {
            imageSrc.push(imageSrcInformation[i].getAttribute("src"));
        }
        //console.log(imageSrc);

        //Grabbing article teaser (exceprt) from the HTML body
        let teaserNodeList = domResponse.window.document.querySelectorAll(".article-teaser");
        let teaserInformation = Array.from(teaserNodeList);
        let teaserText = [];

        //PROBLEM!: The /n character is being grabbed as well... maybe some sort of splice is needed...
        //We are only needing 3, change i to retrieve more teasers... (Not using all the data).
        for (let i = 0; i < 6; i++) {
            //Remove all the newLine characters before pushing it to the data array
            teaserInformation[i].textContent = teaserInformation[i].textContent.trim();
            teaserText.push(teaserInformation[i].textContent);
        }
        //console.log(teaserText);

        //Grabbing article link (To UNCC domain) from the HTML body
        let linkNodeList = domResponse.window.document.querySelectorAll(".article-title > a");
        let linkInformation = Array.from(linkNodeList);
        const relativeLinks = [];
        const absoluteLinks = [];
        
        //We are only needing 3, change i to retrieve more teasers... (Not using all the data). This retreives relative link. Expand to absolute
        for (let i = 0; i < 6; i++) {
            relativeLinks.push(linkInformation[i].getAttribute("href"));
        }
        
        //Convert relative path to aboslute path preappend https://inside.charlotte.edu/
        relativeLinks.forEach(link => {
            absoluteLinks.push("https://inside.charlotte.edu/" + link);
        });

        //console.log(absoluteLinks);
        
        //Create an object of the arrays where the arrays hold all of the gathered information
        let researchNewsInformation = [
            {
                headerInfo: headerText[0],
                dateInfo: dateText[0],
                imageInfo: imageSrc[0],
                teaserInfo: teaserText[0],
                linkInfo: absoluteLinks[0]
            },

            {
                headerInfo: headerText[1],
                dateInfo: dateText[1],
                imageInfo: imageSrc[1],
                teaserInfo: teaserText[1],
                linkInfo: absoluteLinks[1]
            },

            {
                headerInfo: headerText[2],
                dateInfo: dateText[2],
                imageInfo: imageSrc[2],
                teaserInfo: teaserText[2],
                linkInfo: absoluteLinks[2]
            },

            {
                headerInfo: headerText[3],
                dateInfo: dateText[3],
                imageInfo: imageSrc[3],
                teaserInfo: teaserText[3],
                linkInfo: absoluteLinks[3]
            },
            
        ];

        //Return the researchNewsInformation object back to the controller to use!
        return researchNewsInformation;

    } catch(error) {
        console.log("Error when scraping research headline information.")
    }
}