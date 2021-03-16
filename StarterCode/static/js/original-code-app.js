// Original Code - RUNS
// Save path to samples.json
var path = '../../data/samples.json'

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

//Map otu_string values
function otu_string(rows, index) {
    return rows.map(function(row) {
      return "OTU " + row;
    });
  }

 // A shorthand function - is this needed?
// var comparator = function(arr) {
//     return function(a, b) {
//         return ((arr[a] < arr[b]) ? -1 : ((arr[a] > arr[b]) ? 1 : 0));
//     };
// };
  

// Populate dropdown menu and append ids
d3.json(path).then((data)=>{
    var id=data.names;
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,v])=>{
        select.append('option').text(v);
    })
});

// Initializes the page with a default plot
function init() {  
    Plotly.newPlot("bar", [barChartData]);
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
        var result = data["samples"].filter(obj => {
            return obj.id === selectedName
          })
        console.log(result)
        // Sort the data by Greek search results
        var otu_ids = result[0]["otu_ids"];
        var otu_labels = result[0]["otu_labels"];
        var sample_values = result[0]["sample_values"];

        // /* An array of indexes */
        // var idx = [];
        // for (var i = 0; i < sample_values.length; i++) {
        //     idx.push(i);
        // };

        /* Sort by Sample Values */
        // idx = idx.sort(comparator(sample_values));
        // var new_samples = [];
        // var new_labels = [];
        // var new_ids = [];
        // /* Get the sorted order for each values */
        // for (var i = 0; i < sample_values.length; i++) {
        //     new_samples.push(sample_values[idx[i]]);
        //     new_labels.push(otu_labels[idx[i]]);
        //     new_ids.push(otu_ids[idx[i]]);
        // }​;
        // Shadee once you fix the sort here, then reverse and slice

        // Note the extra brackets around 'x' and 'y'
        Plotly.restyle("bar", "y", [otu_string(otu_ids)]);
        Plotly.restyle("bar", "x", [sample_values]);
        Plotly.restyle("bar", "labels", [otu_labels]);

    });

    
}

init();
  