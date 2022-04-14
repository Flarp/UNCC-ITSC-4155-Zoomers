import * as d3 from "https://cdn.skypack.dev/d3@7";
import axios from 'https://cdn.skypack.dev/axios';

//Grab the data from the controller. Use Axios to retrieve information
const getControllerResearch = async () => {
    return await axios.get("/api/data");
}

//Function that will draw the chart
async function drawResearchChart() {
    let fundingArray = [];
    let deptArray = [];

    //Retrieve data from API call
    const fundingData = await getControllerResearch();

    //For each object retrieved from the API call, parse the monetary values into their own array
    fundingData.data.forEach(dataObject => {
        fundingArray.push(parseInt(dataObject.researchFunding));
    });

    //For each object retrieved from the API call, parse the department values into their own array
    fundingData.data.forEach(dataObject => {
        deptArray.push(dataObject.department);
    });

    //Testing purposes...
    //console.log(deptArray);
    //console.log(fundingArray);

    //Modify and create SVG figure --This is where the SVG is created--
    const svg = d3.select("svg");
    const margin = 200; 
    const width = svg.attr("width") - margin; 
    const height = svg.attr("height") - margin;
    
    //Set the X and Y axis scales. X is based on SVG width and Y is based on SVG height.
    const xScale = d3.scaleBand().range([0, width]).padding(0.7);
    const yScale = d3.scaleLinear().range([height, 0]);

    //Group together g elements that will hold the X axis labels (100 units apart)
    const axisGrouping = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

    //Set the domain labels of the X axis (Departments)
    xScale.domain(deptArray.map(dept => {
        return dept;
    }));

    //Set the domain of labels for the Y axis (Funding in terms of millions, 0-20)
    yScale.domain([0, d3.max(fundingArray) + 1])

    //Group together g elements that will hold the Y axis labels in relation to the X axis.
    axisGrouping.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));

    //Construct the Y axis using the group elements. Use the yScale to determine each tick. Label the axis in terms of millions. Apply various stylings..
    axisGrouping.append("g").call(d3.axisLeft(yScale).tickFormat((d) => {
        return "$" + d + " million";
    }).ticks(5)).append("text").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("value");

    //Select every X axis element (Bar element) and populate the graph with the API call data. Establish X and Y axis context and shift amount. Apply various stylings.
    axisGrouping.selectAll(".bar").data(fundingData.data).enter().append("rect").attr("style", "fill: #DAB636;").attr("x", (d) => { return xScale(d.department)}).attr("y", (d) => { return yScale(d.researchFunding)}).attr("width", xScale.bandwidth()).attr("height", (d) => { return height - yScale(d.researchFunding); });

}

//Execute chart function.
drawResearchChart();
