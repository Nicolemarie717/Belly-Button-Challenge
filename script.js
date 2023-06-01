function fetchDataAndBuildDashboard() {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  
    var csvData;
  
    function init() {
      d3.json(url)
        .then((data) => {
          csvData = data;  
          fillDropdown(csvData);
        });
    }
  
    function fillDropdown(data) {
      let dropdownMenu = d3.select("#selDataset");
      let names = data.names;
  
      names.forEach((id) => {
        dropdownMenu.append("option")
          .text(id)
          .property("value", id);
      });
  
      let sample_one = names[0];
      buildDashboard(sample_one);
    }
  
    function buildMetadata(sample) {
      let metadata = csvData.metadata;
      let value = metadata.filter(result => result.id == sample);
      let valueData = value[0];
  
      d3.select("#sample-metadata").html("");
  
      Object.entries(valueData).forEach(([key, value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
    }
  
    function buildBarChart(sample) {
      let sampleInfo = csvData.samples;
      let value = sampleInfo.filter(result => result.id == sample);
      let valueData = value[0];
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
  
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
  
      let trace = {
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h"
      };
  
      Plotly.newPlot("bar", [trace]);
    }
  
    function buildBubbleChart(sample) {
      let sampleInfo = csvData.samples;
      let value = sampleInfo.filter(result => result.id == sample);
      let valueData = value[0];
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
  
      let trace1 = {
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
  
      let layout = {
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
      };
  
      Plotly.newPlot("bubble", [trace1], layout);
    }
  
    function buildGaugeChart(sample) {
      let sampleInfo = csvData.metadata;
      let value = sampleInfo.find(result => result.id == sample);
      let freq = value.wfreq;
  
      let trace2 = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: freq,
        title: '<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week',
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 2], color: "white", text: "0-1" },
            { range: [2, 4], color: "lightgray", text: "1-2" },
            { range: [4, 6], color: "gray", text: "2-3" },
            { range: [6, 8], color: "lightblue", text: "3-4" },
            { range: [8, 10], color: "babyblue", text: "4-5" },
            { range: [5, 6], color: "blue", text: "5-6" },
            { range: [6, 7], color: "lightred", text: "6-7" },
            { range: [7, 8], color: "red", text: "7-8" },
            { range: [8, 9], color: "black", text: "8-9" }
          ]
        }
      }];
  
      let layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', trace2, layout);
    }
  
    function buildDashboard(value) {
      buildMetadata(value);
      buildBarChart(value);
      buildBubbleChart(value);
      buildGaugeChart(value);
    }
  
    init();
  }
  
  // Call the function to fetch data and build the dashboard
  fetchDataAndBuildDashboard();
  