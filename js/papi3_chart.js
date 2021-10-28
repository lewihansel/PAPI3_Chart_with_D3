const dimensionGroups = [
  { name: "Work Direction", startIndex: 0, length: 3 },
  { name: "Leadership", startIndex: 3, length: 3 },
  { name: "Activity", startIndex: 6, length: 2 },
  { name: "Social Nature", startIndex: 8, length: 4 },
  { name: "Work Style", startIndex: 12, length: 3 },
  { name: "Temprament", startIndex: 15, length: 3 },
  { name: "Followership", startIndex: 18, length: 2 },
];
const papiData = [
  {
    name: "N",
    value: 6,
    desc: "Penyelesaian Tugas",
  },
  {
    name: "G",
    value: 7,
    desc: "Bekerja Keras / Giat",
  },
  {
    name: "A",
    value: 9,
    desc: "Keinginan berprestasi",
  },
  {
    name: "L",
    value: 8,
    desc: "Peran pemimpin",
  },
  {
    name: "P",
    value: 7,
    desc: "Mengontrol orang lain",
  },
  {
    name: "I",
    value: 3,
    desc: "Pembuatan keputusan",
  },
  {
    name: "T",
    value: 4,
    desc: "Irama kerja",
  },
  {
    name: "V",
    value: 7,
    desc: "Keaktifan fisik",
  },
  {
    name: "X",
    value: 9,
    desc: "Kebutuhan menjadi pusat perhatian",
  },
  {
    name: "S",
    value: 2,
    desc: "Hubungan Sosial",
  },
  {
    name: "B",
    value: 1,
    desc: "Keb. Menjadi bagian dari kelompok",
  },
  {
    name: "O",
    value: 6,
    desc: "Keakraban dan kasih sayang",
  },
  {
    name: "R",
    value: 8,
    desc: "Berpikir Teoritis",
  },
  {
    name: "D",
    value: 7,
    desc: "Bekerja dengan hal detail",
  },
  {
    name: "C",
    value: 2,
    desc: "Keteraturan",
  },
  {
    name: "Z",
    value: 3,
    reverse: true,
    desc: "Kebutuhan variasi /hal baru",
  },
  {
    name: "E",
    value: 4,
    desc: "Kendali emosi",
  },
  {
    name: "K",
    value: 4,
    reverse: true,
    desc: "Agresifitas",
  },
  {
    name: "F",
    value: 5,
    desc: "Dukungan kepada atasan",
  },
  {
    name: "W",
    value: 9,
    desc: "Mengikuti aturan dan arahan",
  },
];

// Chart configuration
const containerSize = 600;
const chartRotateAngle = -26;
const dimensionsCount = papiData.length;
const padAngle = 0.003 * 360;
const sliceAngle = (360 - dimensionsCount * padAngle) / dimensionsCount;
const sliceCornerRad = 4;

// Color Scheme Cofiguration
const radarLineColor = "#003366";
const groupSliceBg = "#003366";
const groupSliceColor = "#FFFFFF";
const dimensionSliceBg = "#FA8C15";
const dimensionSliceColor = "#FFFFFF";
const arrowColor = "#FA8C15";

/**
 * Degree to radian utility helper.
 * Converting degree to radian.
 *
 * @param {number} deg angle in degree
 * @returns {number} angle in radians
 */
const degToRad = (deg) => (deg * Math.PI) / 180;

/**
 * Invisible Arc Helper to help centering the text
 * Source: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/
 *
 * @param {string} targetSliceId slice id attr as a refrence
 * @param {number} endAngle the end angle of the slice in rad
 * @returns {string} path to be drawn
 */
const invisibleArcHelper = (targetSliceId, endAngle) => {
  //A regular expression that captures all in between the start of a string
  //(denoted by ^) and the first capital letter L
  const firstArcSection = /(^.+?)L/;
  //The [1] gives back the expression between the () (thus not the L as well)
  //which is exactly the arc statement
  let newArc = firstArcSection.exec(d3.select(`${targetSliceId}`).attr("d"))[1];
  //Replace all the comma's so that IE can handle it -_-
  //The g after the / is a modifier that "find all matches rather than
  //stopping after the first match"

  //Replace all the commas so that IE can handle it
  newArc = newArc.replace(/,/g, " ");

  // TODO: Adding Script to reverse the SVG path
  //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
  if (endAngle > (90 * Math.PI) / 180 && endAngle < (270 * Math.PI) / 180) {
    newArc = SVGPathEditor.reverse(newArc);
  } //if

  return newArc;
};

// Text Wrapping Helper (line warp is not yet supported by SVG standard)
// https://stackoverflow.com/a/51506718
const textWrap = (s, w) =>
  s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");

// Create the SVG container and the necessary centering wrapper
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", containerSize)
  .attr("height", containerSize)
  .append("g")
  .attr("class", "papi3_container_wrapper")
  .attr(
    "transform",
    "translate(" + containerSize / 2 + "," + containerSize / 2 + ")"
  );

// Creating SVG Arrow Element
// See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
svg
  .append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("viewBox", [0, 0, 10, 10])
  .attr("refX", 5)
  .attr("refY", 5)
  .attr("markerWidth", 5)
  .attr("markerHeight", 5)
  .attr("orient", "auto-start-reverse")
  .append("path")
  .attr("stroke", "none")
  .attr("fill", arrowColor)
  .attr(
    "d",
    d3.line()([
      [0, 0],
      [0, 10],
      [10, 5],
    ])
  );

// Creating group for dimension slice
const dimensionSlices = svg.append("g").attr("class", "dimensionSlices");

// Creating Dimension Group Arc for all dimension group slices
const dimensionGroupArc = (startIndex, length) => {
  const startDeg = chartRotateAngle + startIndex * (sliceAngle + padAngle);
  const endDeg = startDeg + sliceAngle * length + padAngle * (length - 1);
  return d3
    .arc()
    .outerRadius(containerSize / 2 - 25)
    .innerRadius(containerSize / 2 - 50)
    .startAngle(degToRad(startDeg))
    .endAngle(degToRad(endDeg))
    .cornerRadius(sliceCornerRad);
};

// Drawing the slices for eact dimension group
dimensionGroups.forEach((d, i) => {
  dimensionSlices
    .append("path")
    .attr("class", "dimensionGroupSlice")
    .attr("id", `dimensionGroupSlice_${i}`)
    .attr("d", dimensionGroupArc(d.startIndex, d.length))
    .attr("fill", groupSliceBg)
    .attr("stroke", "none");

  // Calculate the end angle in radians
  const endAngle = dimensionGroupArc(d.startIndex, d.length).endAngle()();

  //Create a new invisible arc that the text can flow along
  dimensionSlices
    .append("path")
    .attr("class", "dimensionGroupSlice_centeredTextContainer")
    .attr("id", `dimensionGroupSlice_centeredTextContainer_${i}`)
    .attr("d", invisibleArcHelper(`#dimensionGroupSlice_${i}`, endAngle))
    .style("fill", "none");

  // Apending Dimension Group Title to the slices
  dimensionSlices
    .append("text")
    .attr("class", "dimensionGroupSlice_centeredText_title")
    .attr("dy", () => {
      if (endAngle > (90 * Math.PI) / 180 && endAngle < (270 * Math.PI) / 180)
        return -8;
      else return 18;
    })
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("fill", groupSliceColor)
    .style("text-anchor", "middle")
    .style("font-weight", 600)
    .attr("xlink:href", `#dimensionGroupSlice_centeredTextContainer_${i}`)
    .text(`${d.name.toUpperCase()}`);
});

// Create the main arc for the all the dimension slices
const dimensionsArc = (index) => {
  const startDeg = chartRotateAngle + index * (sliceAngle + padAngle);
  const endDeg = startDeg + sliceAngle;
  return d3
    .arc()
    .outerRadius(containerSize / 2 - 55)
    .innerRadius(containerSize / 2 - 80)
    .startAngle(degToRad(startDeg))
    .endAngle(degToRad(endDeg))
    .cornerRadius(sliceCornerRad);
};

// Drawing the slice for dimension title
papiData.forEach((d, i) => {
  dimensionSlices
    .append("path")
    .attr("class", "dimensionSlice")
    .attr("id", `dimensionSlice_${i}`)
    .attr("d", dimensionsArc(i))
    .attr("fill", dimensionSliceBg)
    .attr("stroke", "none");

  // Calculate the end angle in radians
  const endAngle = dimensionsArc(i).endAngle()();

  //Create a new invisible arc that the text can flow along
  dimensionSlices
    .append("path")
    .attr("class", "dimensionSlice_centeredTextContainer")
    .attr("id", `dimensionSlice_centeredTextContainer_${i}`)
    .attr("d", invisibleArcHelper(`#dimensionSlice_${i}`, endAngle))
    .style("fill", "none");

  // Apending Dimension Text to the slices
  dimensionSlices
    .append("text")
    .attr("class", "dimensionSlice_centeredText_title")
    .attr("dy", () => {
      if (endAngle > (90 * Math.PI) / 180 && endAngle < (270 * Math.PI) / 180)
        return -8;
      else return 18;
    })
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("fill", dimensionSliceColor)
    .style("text-anchor", "middle")
    .style("font-weight", 600)
    .attr("xlink:href", `#dimensionSlice_centeredTextContainer_${i}`)
    .text(`${d.name.toUpperCase()}`);

  // TODO: Fixing the line wrapping issue for description
  // Appending description to the slices
  dimensionSlices
    .append("text")
    .attr("class", "dimensionSlice_centeredText_desc")
    .attr("dy", 15)
    .append("textPath")
    .attr("startOffset", "50%")
    .style("text-anchor", "middle")
    .attr("xlink:href", `#dimensionSlice_centeredTextContainer_${i}`);
  // .text(() => d.desc);
});

// Creating the arc for scale
const scaleArc = (index, scale) => {
  const outer = containerSize / 2 - 90 - ((9 - scale) * containerSize) / 33;
  const inner = outer - 15;

  const startDeg = chartRotateAngle + index * (sliceAngle + padAngle);
  const endDeg = startDeg + sliceAngle;

  return d3
    .arc()
    .outerRadius(outer)
    .innerRadius(inner)
    .startAngle(degToRad(startDeg))
    .endAngle(degToRad(endDeg));
};

// Creating the group for scale slices
const scaleSlices = svg.append("g").attr("class", "scaleSlices");

// Creating an array of line coordinates
const lineCoordinates = [];

// Drawing reverse arrow
papiData.forEach((d, i) => {
  if (d.reverse) {
    const arrowLine = d3.lineRadial();
    const arrowAngle = scaleArc(i, 9).endAngle()() - degToRad(2.5);
    scaleSlices
      .append("path")
      .attr(
        "d",
        arrowLine([
          [arrowAngle, containerSize / 3],
          [arrowAngle, containerSize / 6],
        ])
      )
      .attr("stroke-width", "2px")
      .attr("stroke", arrowColor)
      .attr("marker-end", "url(#arrow)");
  }
});

// Gathering the coordinates for radar line drawing
for (scale = 9; scale > -1; scale--) {
  papiData.forEach((d, i) => {
    // Get Scale center coordinates
    const coordinates = {
      x: scaleArc(i, scale).centroid()[0],
      y: scaleArc(i, scale).centroid()[1],
      sortIndex: i,
    };

    // Evaluating Scale Value to the result value for every dimension
    const scaleValue = d.reverse ? 9 - scale : scale;
    const markedScaleValue = d.value === scaleValue;

    // Pushing coordinates to lineCoordinates Array
    if (markedScaleValue) {
      lineCoordinates.push(coordinates);
    }
  });
}

// Creating Radar Line Element
const radarLine = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(d3.curveCatmullRomClosed.alpha(1));

// Drwaing the radar line
scaleSlices
  .append("path")
  .attr(
    "d",
    radarLine([...lineCoordinates].sort((a, b) => a.sortIndex - b.sortIndex))
  )
  .attr("fill", "none")
  .attr("stroke", radarLineColor)
  .attr("stroke-width", "2px");

// Creating the scale 9 - 0
for (scale = 9; scale > -1; scale--) {
  papiData.forEach((d, i) => {
    scaleSlices
      .append("path")
      .attr("class", `scaleSlice_${scale}`)
      .attr("id", `scaleSlice_${scale}_${i}`)
      .attr("d", scaleArc(i, scale))
      .style("fill", "none");

    // Calculate the end angle in radians
    const endAngle = scaleArc(i, scale).endAngle()();

    //Create a new invisible arc that the text can flow along
    scaleSlices
      .append("path")
      .attr("class", "scaleSlice_centeredTextContainer")
      .attr("id", `scaleSlice_centeredTextContainer_${scale}_${i}`)
      .attr("d", invisibleArcHelper(`#scaleSlice_${scale}_${i}`, endAngle))
      .style("fill", "none");

    // Get Scale center coordinates
    const coordinates = {
      x: scaleArc(i, scale).centroid()[0],
      y: scaleArc(i, scale).centroid()[1],
      sortIndex: i,
    };

    // Evaluating Scale Value to the result value for every dimension
    const scaleValue = d.reverse ? 9 - scale : scale;
    const markedScaleValue = d.value === scaleValue;

    // creating background for all scale
    scaleSlices
      .append("circle")
      .attr("fill", () => {
        if (markedScaleValue) {
          return radarLineColor;
        } else return "none";
      })
      .attr("stroke", () => {
        if (markedScaleValue) {
          return radarLineColor; // Stroke indicates the reeult value for every dimension
        } else return "none";
      })
      .attr("stroke-width", "2px")
      .attr("r", 8)
      .attr("cx", coordinates.x)
      .attr("cy", coordinates.y);

    // Appending the scale to the slices
    scaleSlices
      .append("text")
      .attr("dy", () => {
        if (endAngle > (90 * Math.PI) / 180 && endAngle < (270 * Math.PI) / 180)
          return -4;
        else return 12;
      })
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("fill", () => {
        if (markedScaleValue) {
          return "white"; // Stroke indicates the reeult value for every dimension
        } else return "black";
      })
      .style("text-anchor", "middle")
      .style("font-weight", () => {
        if (markedScaleValue) {
          return 600; // Stroke indicates the reeult value for every dimension
        } else return 400;
      })
      .style("font-size", 12)
      .attr("xlink:href", `#scaleSlice_centeredTextContainer_${scale}_${i}`)
      .text(() => (d.reverse ? 9 - scale : scale));
  });
}
