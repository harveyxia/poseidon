var data;

function init() {
  // chrome.storage.sync.get(function(json) {
  //     data = json;
  //     // draw the plot with the data
  // })
  // load data locally for now
  d3.json('/js/data.json', function(error, json) {
    if (error) return console.warn(error);
    data = json;
    draw_plot();
  });
}

function draw_plot() {
  
  
}