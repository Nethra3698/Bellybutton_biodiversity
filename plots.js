function init() {
    var selector = d3.select("#selDataset");  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector.append("option").text(sample).property("value", sample);
      });
  })}
init();
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
} 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    PANEL.append("h6").text("ID: "+ result.id);
    PANEL.append("h6").text("ETHNICITY: "+ result.ethnicity);
    PANEL.append("h6").text("GENDER: "+ result.gender);
    PANEL.append("h6").text("AGE: "+ result.age);
    PANEL.append("h6").text("LOCATION: "+ result.location);
    PANEL.append("h6").text("BBTYPE: "+ result.bbtype);
    PANEL.append("h6").text("WFREQ  : "+ result.wfreq);    
  });
}
function buildCharts(sample) {  
  var required_sample;
  var otu_ids;
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var j = 0;
    while (j>=0) {
      if (samples[j].id == sample){
        required_sample = samples[j];
        j=-2;
      }
      j++;      
    }
    otu_ids = required_sample.otu_ids;
    var resultArray = otu_ids.sort(function(a, b){return b - a});
    sample_values = required_sample.sample_values;
    otu_labels = required_sample.otu_labels;
    var xValue = resultArray.slice(0,10);
    var yValue = sample_values.slice(0,10);
    var label_values = otu_labels.slice(0,10);
    var alteredArray=xValue.map(obj =>"ID: "+ obj);
    var graphdata = [{
      x: yValue,
      y: alteredArray,
      type: 'bar',
      text: label_values,
      orientation: 'h'      
    }];  
    var bubbledata = [{
      x: xValue,
      y: yValue,
      text: label_values,
      mode:'markers',
      marker: {
        color: xValue,
        size: yValue
      }    
    }];  
    var layout = {
      title: 'top 10 bacterial species',
      xaxis: {
        title: 'Sample Values',
        showgrid: false,
        zeroline: false
      },
      yaxis: {
        title: 'OTU ID',
        showline: false
      }
    };
    var bubblelayout = {
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: 'OTU ID',
        zeroline: true,
        showline: true
      },
      yaxis: {        
        zeroline: true,
        showline: true
      }
    }
    var gaugedata = [{
      type: "indicator",
      mode: "gauge+delta",
      title: { text: "Bellybutton washing frequency", font: { size: 24 } },
      delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
      gauge: {
        axis: { range: [0,9], tickwidth: 1, tickcolor: "darkblue" },
        bgcolor: "white",
        steps: [
          { range: [0, 1], color: "rgba(255, 255, 255, 0)" },
          { range: [1, 2], color: "rgba(232, 226, 202, .5)" },
          { range: [2, 3], color: "rgba(222, 216, 185, .5)" },
          { range: [3, 4], color: "rgba(210, 206, 145, .5)" },
          { range: [4, 5], color: "rgba(202, 209, 95, .5)" },
          { range: [5, 6], color: "rgba(170, 202, 42, .5)" },
          { range: [6, 7], color: "rgba(140, 182, 32, .5)" },
          { range: [7, 8], color: "rgba(110, 154, 22, .5)"},
          { range: [8, 9], color: "rgba(14, 127, 0, .5)"}
        ]
    }
    }];
    var gaugelayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" }
    }
    Plotly.react("bar",graphdata, layout);
    Plotly.react("bubble",bubbledata, bubblelayout);
    Plotly.react("gauge",gaugedata, gaugelayout);
    
  });
  
}
