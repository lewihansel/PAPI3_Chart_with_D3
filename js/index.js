/**
 * ▒▒▒▒▒▒▒█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
 * ▒▒▒▒▒▒▒█░▒▒▒▒▒▒▒▓▒▒▓▒▒▒▒▒▒▒░█
 * ▒▒▒▒▒▒▒█░▒▒▓▒▒▒▒▒▒▒▒▒▄▄▒▓▒▒░█░▄▄
 * ▒▒▄▀▀▄▄█░▒▒▒▒▒▒▓▒▒▒▒█░░▀▄▄▄▄▄▀░░█
 * ▒▒█░░░░█░▒▒▒▒▒▒▒▒▒▒▒█░░░░░░░░░░░█
 * ▒▒▒▀▀▄▄█░▒▒▒▒▓▒▒▒▓▒█░░░█▒░░░░█▒░░█
 * ▒▒▒▒▒▒▒█░▒▓▒▒▒▒▓▒▒▒█░░░░░░░▀░░░░░█
 * ▒▒▒▒▒▄▄█░▒▒▒▓▒▒▒▒▒▒▒█░░█▄▄█▄▄█░░█
 * ▒▒▒▒█░░░█▄▄▄▄▄▄▄▄▄▄█░█▄▄▄▄▄▄▄▄▄█
 * ▒▒▒▒█▄▄█░░█▄▄█░░░░░░█▄▄█░░█▄▄█
 *
 * ,---.    ,---.    .-''-.      ,-----.    .--.      .--. .---.
 * |    \  /    |  .'_ _   \   .'  .-,  '.  |  |_     |  | \   /
 * |  ,  \/  ,  | / ( ` )   ' / ,-.|  \ _ \ | _( )_   |  | |   |
 * |  |\_   /|  |. (_ o _)  |;  \  '_ /  | :|(_ o _)  |  |  \ /
 * |  _( )_/ |  ||  (_,_)___||  _`,/ \ _/  || (_,_) \ |  |   v
 * | (_ o _) |  |'  \   .---.: (  '\_/ \   ;|  |/    \|  |  _ _
 * |  (_,_)  |  | \  `-'    / \ `"/  \  ) / |  '  /\  `  | (_I_)
 * |  |      |  |  \       /   '. \_/``".'  |    /  \    |(_(=)_)
 * '--'      '--'   `'-..-'      '-----'    `---'    `---` (_I_)
 */

// import * as d3 from "d3";

// const screenWidth = window.innerWidth;
const containerWidth = 900;
const margin = { left: 20, top: 20, right: 20, bottom: 20 },
  width = containerWidth - margin.left - margin.right,
  height = containerWidth - margin.top - margin.bottom;
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("class", "wrapper")
  .attr(
    "transform",
    "translate(" +
      (width / 2 + margin.left) +
      "," +
      (height / 2 + margin.top) +
      ")"
  );

//////////////////////////////////////////////////////////////
///////////////////// Data &  Scales /////////////////////////
//////////////////////////////////////////////////////////////

//Some random data
const donutData = [
  { name: "N", value: 6 },
  { name: "G", value: 7 },
  { name: "A", value: 9 },
  { name: "L", value: 8 },
  { name: "P", value: 7 },
  { name: "I", value: 3 },
  { name: "T", value: 4 },
  { name: "V", value: 7 },
  { name: "X", value: 9 },
  { name: "S", value: 2 },
  { name: "B", value: 1 },
  { name: "O", value: 6 },
  { name: "R", value: 8 },
  { name: "D", value: 7 },
  { name: "C", value: 2 },
  { name: "Z", value: 3, reverse: true },
  { name: "E", value: 4 },
  { name: "K", value: 4, reverse: true },
  { name: "F", value: 5 },
  { name: "W", value: 9 },
];

//Create a color scale
const colorScale = d3
  .scaleLinear()
  .domain([1, 10, 20])
  .range(["#2c7bb6", "#ffffbf", "#d7191c"])
  .interpolate(d3.interpolateHcl);

//Create an arc function
//The outer Arc Function
const arc = d3
  .arc()
  .innerRadius(700 / 2)
  .outerRadius(700 / 2 + 1);

//Scale arc function
const scaleArc = (i) => {
  const startWidth = 80 + 25 * i;
  return d3
    .arc()
    .innerRadius(startWidth)
    .outerRadius(startWidth + 1);
};

//Turn the pie chart 90 degrees counter clockwise, so it starts at the left
const pie = d3
  .pie()
  .startAngle((-27 * Math.PI) / 180)
  .value(() => 1)
  .padAngle(0.01)
  .sort(null);

//////////////////////////////////////////////////////////////
//////////////////// Create Donut Chart //////////////////////
//////////////////////////////////////////////////////////////

//Create the donut slices
svg
  .selectAll(".donutArcSlices")
  .data(pie(donutData))
  .enter()
  .append("path")
  .attr("class", "donutArcSlices")
  .attr("d", arc)
  .style("fill", "#CCCCCC")
  .each(function (d, i) {
    //A regular expression that captures all in between the start of a string
    //(denoted by ^) and the first capital letter L
    const firstArcSection = /(^.+?)L/;

    //The [1] gives back the expression between the () (thus not the L as well)
    //which is exactly the arc statement
    let newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
    //Replace all the comma's so that IE can handle it -_-
    //The g after the / is a modifier that "find all matches rather than
    //stopping after the first match"
    newArc = newArc.replace(/,/g, " ");

    //Create a new invisible arc that the text can flow along
    svg
      .append("path")
      .attr("class", "hiddenDonutArcs")
      .attr("id", `donutArc_${i}`)
      .attr("d", newArc)
      .style("fill", "none");
  });

//Append the label names on the outside
svg
  .selectAll(".donutText")
  .data(donutData)
  .enter()
  .append("text")
  .attr("class", "donutText")
  .attr("dy", -13)
  .append("textPath")
  .attr("startOffset", "50%")
  .style("text-anchor", "middle")
  .attr("xlink:href", (d, i) => "#donutArc_" + i)
  .text((d) => d.name);

for (scale = 9; scale > -1; scale--) {
  //Create the donut slices
  svg
    .selectAll(`.donutArcSlices_scale_${scale}`)
    .data(pie(donutData))
    .enter()
    .append("path")
    .attr("class", `.donutArcSlices_scale_${scale}`)
    .attr("d", scaleArc(scale))
    .style("fill", "none")
    .each(function (d, i) {
      //A regular expression that captures all in between the start of a string
      //(denoted by ^) and the first capital letter L
      const firstArcSection = /(^.+?)L/;

      //The [1] gives back the expression between the () (thus not the L as well)
      //which is exactly the arc statement
      let newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
      //Replace all the comma's so that IE can handle it -_-
      //The g after the / is a modifier that "find all matches rather than
      //stopping after the first match"
      newArc = newArc.replace(/,/g, " ");

      //Create a new invisible arc that the text can flow along
      svg
        .append("path")
        .attr("class", "hiddenDonutArcs")
        .attr("id", `donutArc_scale_${scale}${i}`)
        .attr("d", newArc)
        .style("fill", "none")
        .append("circle")
        .attr("r", 20)
        .attr("dy", 20)
        .attr("dx", 20);
    });

  //Append the label names on the outside
  svg
    .selectAll(`.donutText_scale_${scale}`)
    .data(donutData)
    .enter()
    .append("text")
    .attr("fill", (d) => {
      const scaleValue = d.reverse ? 9 - scale : scale;
      if (d.value === scaleValue) {
        return "red";
      }
    })
    .attr("class", `donutText_scale_${scale}`)
    .append("textPath")
    .attr("startOffset", "50%")
    .style("text-anchor", "middle")
    .attr("xlink:href", (d, i) => `#donutArc_scale_${scale}${i}`)
    .text((d) => (d.reverse ? 9 - scale : scale));
}
