// Save path to samples.json
var path = './samples.json'

// Set bar chart data
var barChartData = {
    x: [],
    y: [],
    labels: [],
    type: "bar",
    orientation: "h",
    transforms: [{
        type: 'sort',
        order: 'ascending'
      }]
     
};
var bubbleChartData = {
    x: [],
    y: [],
    labels: [],
    colorscale: 'YlGnBu',
    mode: 'markers',
    
};

// select body where table data should appear
var tableBody = d3.select(".panel-body")

function buildTable(data) {

    // Remove all rows from previous queries and enter new values
    tableBody.selectAll('tr').remove();
    for (const [key, value] of Object.entries(data)) {
        var trow = tableBody.append("tr");
        trow.append("td").text(key)
        trow.append("td").text(value);
      }
};

//Function to make otu_string values
function otu_string(rows, index) {
    return rows.map(function(row) {
      return "OTU " + row;
    });
  }

// Populate dropdown menu and append
d3.json(path).then((data)=>{
    var id=data.names;
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,v])=>{
        select.append('option').text(v);
    })
    updatePlotly()
});

// Initializes the page with a default plot
function init() {  
    Plotly.newPlot("bar", [barChartData]);
    Plotly.newPlot("bubble", [bubbleChartData]);

  }
  
// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

  
// This function is called when a dropdown menu item is selected
function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var selectedName = dropdownMenu.property("value");

    // Initialize x and y arrays
    var x = [];
    var y = [];
    // Populate dropdown menu 
    d3.json(path).then((data)=>{
        var person = data["metadata"].filter(obj => {
            return String(obj.id) === selectedName
        })
        // Populate table
        buildTable(person[0]);

        var result = data["samples"].filter(obj => {
            return obj.id === selectedName
          })
        // Sort the data by search results
        var otu_ids = result[0]["otu_ids"];
        var otu_labels = result[0]["otu_labels"];
        var sample_values = result[0]["sample_values"];
        
        // Make the data 2-dimensional for sorting
        var arrays = [];
        for(var i = 0; i < otu_ids.length; i++){
            arrays.push([otu_ids[i], otu_labels[i], sample_values[i]])  
        };

        // Sort the data by sample values
        arrays.sort(function compareFunction(a, b) {
            return b[2] - a[2];
          });
          
        // Repopulate IDs with the top 10 values
        var otu_ids_10 = []
        var otu_labels_10 = []
        var sample_values_10 = []
        for(var i = 0; i < Math.min(10, arrays.length); i++){
            otu_ids_10.push(arrays[i][0]);
            otu_labels_10.push(arrays[i][1]);
            sample_values_10.push(arrays[i][2]);
        }

        // Update plots
        Plotly.restyle("bar", "y", [otu_string(otu_ids_10)]);
        Plotly.restyle("bar", "x", [sample_values_10]);
        Plotly.restyle("bar", "labels", [otu_labels_10]);

        Plotly.restyle("bubble", "x", [otu_ids]);
        Plotly.restyle("bubble", "y", [sample_values]);
        Plotly.restyle("bubble", "text", [otu_labels]);
        Plotly.restyle("bubble", "marker.color", [otu_ids]);
        Plotly.restyle("bubble", "marker.size", [sample_values]);
    });

    
}

init();
updatePlotly()
  