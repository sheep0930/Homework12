function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      var cell = selector.append("p").text(`${key}: ${value}`)
    });
  
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
})
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (data) {
    var sample_values = data.sample_values;
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      type: "scatter",
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
      },
      text: otu_labels,
      x: otu_ids,
      y: sample_values,
    }
    var data = [trace1];
    var layout = {
      xAxis: {title:'OTU ID'},
      height: 500,
      width: 1500
    };
    Plotly.newPlot("bubble", data, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace1 = {
        labels: otu_ids.slice(0,10),
        values: sample_values.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        type: 'pie'
      };

    data = [trace1];
    var layout = {
      height: 500,
      width: 500
    };
    Plotly.newPlot("pie", data, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
console.log("test")