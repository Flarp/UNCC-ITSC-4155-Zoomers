/* 
    ITSC 4155 - Group 3: "The Zoomers"
    Scraping component that will scrape all the data at once to deliver to the main application.
    Date: March 22nd, 2022

*/

const axios = require("axios");
const { header } = require("express/lib/request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.getResearchHeadlines = async function() {
    try {

        //Grab the UNCC page. Create extract the HTML body into a JSDOM object. 
        const response = await axios.get("https://inside.charlotte.edu/research");
        const domResponse = new JSDOM(response.data);

        //Grabbing headers from the html body
        let headerNodeList = domResponse.window.document.querySelectorAll(".article-title > a");
        let anchorInformation = Array.from(headerNodeList);
        //const headerText = [];

        //We are only needing 3, change i to retreive more headers... (Not using all data).
        for(let i = 0; i < 3; i++) {
            headerText.push(anchorInformation[i].textContent);
        }
        //console.log(headerText); 

        //Grabbing Date Posted from the html body
        let dateNodeList = domResponse.window.document.querySelectorAll(".article-post-date > span");
        let dateSpanInformation = Array.from(dateNodeList);
        const dateText = [];

        //We are only needing 3, change i to retreive more dates... (Not using all data).
        for(let i = 0; i < 3; i++) {
            dateText.push(dateSpanInformation[i].textContent);
        }
        //console.log(dateText);

        //Grabbing Image source from the HTML body
        let imageNodeList = domResponse.window.document.querySelectorAll(".article-image > img");
        let imageSrcInformation = Array.from(imageNodeList);
        const imageSrc = [];

        //We are only needing 3, change i to retrieve more srcs... (Not using all the data).
        for(let i = 0; i < 3; i++) {
            imageSrc.push(imageSrcInformation[i].getAttribute("src"));
        }
        //console.log(imageSrc);

        //Grabbing article teaser (exceprt) from the HTML body
        let teaserNodeList = domResponse.window.document.querySelectorAll(".article-teaser");
        let teaserInformation = Array.from(teaserNodeList);
        let teaserInfo = [];

        //PROBLEM!: The /n character is being grabbed as well... maybe some sort of splice is needed...
        //We are only needing 3, change i to retrieve more teasers... (Not using all the data).
        for (let i = 0; i < 3; i++) {
            teaserInfo.push(teaserInformation[i].textContent);
        }
        //console.log(teaserInfo);

        //Grabbing article link (To UNCC domain) from the HTML body
        let linkNodeList = domResponse.window.document.querySelectorAll(".article-title > a");
        let linkInformation = Array.from(linkNodeList);
        const relativeLinks = [];
        const absoluteLinks = [];
        
        //We are only needing 3, change i to retrieve more teasers... (Not using all the data). This retreives relative link. Expand to absolute
        for (let i = 0; i < 3; i++) {
            relativeLinks.push(linkInformation[i].getAttribute("href"));
        }
        
        //Convert relative path to aboslute path preappend https://inside.charlotte.edu/
        relativeLinks.forEach(link => {
            absoluteLinks.push("https://inside.charlotte.edu/" + link);
        });

        //console.log(absoluteLinks);

    } catch(error) {
        console.log("Error when scraping research headline information.")
    }
}