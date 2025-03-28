// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    //getting data and console logging
    // d3.json(url_caps).then(function(data) {
    //   console.log(data);
    // });

    // get the metadata field
    let meta = data.metadata;
    // console.log(meta)

    // Filter the metadata for the object with the desired sample number
    let results = meta.filter(data => data.id == sample);
    let result_index = results[0]

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel_id = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel_id.html("");
    //alt option: d3.select('#sample-metadat').html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
//     for (key in result_index){
//       panel_id.append("h6").text(`${key.toUpperCase()}: ${result_index[key]}`)};
// })}

    Object.entries(result_index).forEach(([key, value]) => {
      panel_id.append("h6").text(`${key}: ${value}`)});
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let samp_num = samples.filter(obj => obj.id == sample);
    let index_num = samp_num[0]

    console.log('Selected Samples Data:', samp_num); //(my add)

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = index_num.otu_ids;
    let otu_labels = index_num.otu_labels;
    let sample_values = index_num.sample_values;

    // Build a Bubble Chart
    let bub_data = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    // data array
    let data_array = [bub_data];

    // layout for bubble chart
    let layout = {
      title: 'Otu Bubble Chart',
      xaxis: {title: 'Otu ID'},
      yaxis: {title: 'Microbes Count'},
      hovermode: 'closest',
      margin: {t: 50, 1:50}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", data_array, layout);
    //alt option: if didn;t create a data array - Plotly.newPlot("bubble", bub_data, layout);
    //have to make sure square brackets are added on the outside of the main bub_data

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    xValues = sample_values.slice(0, 10);
    yticks = otu_ids.map(id => `OTU ${id}`).slice(0, 10);
    hoverText = otu_labels.slice(0, 10);


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace = {
      x: xValues.reverse(),  // Reverse to match descending order
      y: yticks.reverse(),   // Reverse to keep OTUs in descending order
      text: hoverText.reverse(),
      type: "bar",
      orientation: "h"
    };

    //layout
    bar_layout = {
      title: `Top 10 OTUs for Sample`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace], bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let field_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    // console.log(dropdown); //checking the selection

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    field_names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
     });
  
      // Get the first sample from the list
     let firstSample = field_names[0];
  
      // Build charts and metadata panel with the first sample
     buildCharts(firstSample);
     buildMetadata(firstSample);
  
    });
  }

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
