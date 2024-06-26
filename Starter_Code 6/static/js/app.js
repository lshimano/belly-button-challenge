// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Full metadata:", data.metadata); // Log the entire metadata array

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(meta => meta.id == sample)[0];

    console.log(`Metadata for sample ${sample}:`, result); // Log the filtered metadata for the selected sample

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);});
})
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Full samples dataset:", data.samples); // Log the entire samples array

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var filteredSample = samples.filter(s => s.id === sample)[0];

    console.log(`Filtered sample data for ${sample}:`, filteredSample); // Log the filtered sample data for the selected sample

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = filteredSample.otu_ids;
    var otu_labels = filteredSample.otu_labels;
    var sample_values = filteredSample.sample_values;

    console.log("OTU IDs:", otu_ids); // Log the otu_ids array
    console.log("OTU Labels:", otu_labels); // Log the otu_labels array
    console.log("Sample Values:", sample_values); // Log the sample_values array

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bateria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    console.log("Y-Ticks for Bar Chart:", yticks); // Log the yticks array for the bar chart

    // Build a Bar Chart
    var barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    var barData = [barTrace];

    var barLayout = {
      title: `Top 10 Bacteria Cultures Found ${sample}`,
      xaxis: {title : 'Number of Bacteria' },
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Initial data load:", data); // Log the initial data loaded from the JSON

    // Get the names field
    var sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((name) => {
      selector.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    var firstSample = sampleNames[0];

    console.log("First sample selected:", firstSample); // Log the first sample chosen to build the initial charts and metadata

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
  console.log("New sample selected:", newSample);

}

// Initialise the dashboard
init();
