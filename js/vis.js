var data;

var width = 1000;
var height = 700;

function init() {
  // chrome.storage.sync.get(function(json) {
  //     data = json;
  //     // draw the plot with the data
  // })
  // load data locally for now
  d3.json('/js/data.json', function(error, json) {
    if (error) return console.warn(error);
    data = format_json(json);
    draw_vis();
    console.log(data);
  });
}

function draw_vis() {
  var vis = d3.select('.vis')
    .attr('width', width)
    .attr('height', height);

  var x = d3.time.scale()
    .domain([new Date(data[0].time), new Date(data[data.length - 1].time)])
    .range([0, width]);

console.warn([new Date(data[0].time), new Date(data[data.length - 1].time)]);

  var point = vis.selectAll('g')
    .data(data)
    .enter().append('g')
    .attr()

  point.append('circle')
    .attr('cx', function(d) { return x(new Date(d.time))})
    .attr('cy', 5)
    .attr('r', 2.5);
  
}

// formats localStorage JSON data into an array
function format_json(json) {
  var new_json = []
  for (var item in json) {
    var obj = {
      time: item,
      tabs: json[item]
    };
    new_json.push(obj);
  }
  // sort the array by date to ensure order
  return new_json.sort(function(a,b) {
    return (new Date(a.time)) - (new Date(b.time))
  });
}

init();
