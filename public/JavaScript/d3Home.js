import * as d3 from "https://cdn.skypack.dev/d3@7";
import axios from 'https://cdn.skypack.dev/axios';

//Grab the data from the controller. Use Axios to retrieve information
const getControllerResearch = async () => {
    return await axios.get("/api/data");
}

async function drawResearchChart() {
    let fundingArray = [];
    let deptArray = [];

    const fundingData = await getControllerResearch();

    fundingData.data.forEach(dataObject => {
        fundingArray.push(parseInt(dataObject.researchFunding));
    });

    fundingData.data.forEach(dataObject => {
        deptArray.push(dataObject.department);
    });

    console.log(deptArray);
    console.log(fundingArray);

    //Modify and create SVG figure --This is where the SVG is created--
    const svg = d3.select("svg");
    const margin = 200; 
    const width = svg.attr("width") - margin; 
    const height = svg.attr("height") - margin;
    
    const xScale = d3.scaleBand().range([0, width]).padding(0.7);
    const yScale = d3.scaleLinear().range([height, 0]);

    const axisGrouping = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(deptArray.map(dept => {
        return dept;
    }));

    yScale.domain([0, d3.max(fundingArray) + 1])

    axisGrouping.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));

    axisGrouping.append("g").call(d3.axisLeft(yScale).tickFormat((d) => {
        return "$" + d + " million";
    }).ticks(5)).append("text").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("value");

   axisGrouping.selectAll(".bar").data(fundingData.data).enter().append("rect").attr("style", "fill: #DAB636;").attr("x", (d) => { return xScale(d.department)}).attr("y", (d) => { return yScale(d.researchFunding)}).attr("width", xScale.bandwidth()).attr("height", (d) => { return height - yScale(d.researchFunding); });

}

drawResearchChart();
