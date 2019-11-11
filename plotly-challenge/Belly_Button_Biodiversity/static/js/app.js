function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    var metaDataUrl = "/metadata/" + sample;
    d3.json(metaDataUrl).then(function(response){

    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaDataPanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaDataPanel.html("");
       // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
    metaDataPanel.append("h6").text(`${key}: ${value}`);
    
    });
    
    // BONUS: Build the Gauge Chart
    buildGauge(response.WFREQ);

    });
};//End of Function

  
function buildGauge(WFREQ) {
  //console.log(WFREQ);
  var gauge = document.getElementById("gauge");
  var data = [
    {
      domain: { x: [0], y: [0] },
      value: WFREQ,
      title: { text: "Belly Buttion Washing Frequency" },
      type: "indicator",
      mode: "gauge+number+delta",
      gauge: {
        axis: { range: [null,9] },
        steps: [
          { range: [0, 9], color: "lightyellow" },
          { range: [5, 9], color: "lightgreen" }
        ]
      }
    }];
  
  var layout = { 
    width: 600, 
    height: 450, 
    margin: { t: 0, b: 0 },
    title: 'Scrubs Per Week',
    
  };
  Plotly.newPlot(gauge, data, layout);

};//End of function

function buildCharts(sample) {


      console.log(sample);
      // @TODO: Use `d3.json` to fetch the sample data for the plots
      var chartDataUrl = "/samples/" + sample;
      var bubble = document.getElementById("bubble");
      d3.json(chartDataUrl).then((sampleNames) => {
      // @TODO: Build a Bubble Chart using the sample data
      var trace1 = {
        x: sampleNames.otu_ids,
        y: sampleNames.sample_values,
        text: sampleNames.otu_labels,
        mode: 'markers',
        marker: {
          color: sampleNames.otu_ids,
          colorscale: 'Earth',
          size: sampleNames.sample_values
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Bubble Chart',
        showlegend: false,
        height: 600,
        width: 1500,
        xaxis: {
          title: {
            text: 'OTU ID',
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Sample Values',
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
      };
      
      Plotly.plot('bubble', data, layout);

      // @TODO: Build a Pie Chart
      var newData = {
        labels : sampleNames.otu_labels.slice(0,10),
        values: sampleNames.sample_values.slice(0,10),
        
        type: "pie"
      };

      var layout = {
        height: 600,
        width: 800,
        showlegend: true,
        legend: {"orientation": "h"}
      };
      var PIE = document.getElementById("pie");
      Plotly.plot(PIE, [newData],layout);
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
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
      console.log("option is now changed");
      buildCharts(newSample);
      buildMetadata(newSample);
    }

// Initialize the dashboard
init();
