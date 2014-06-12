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
    .range([50, width - 100]);

  var x_axis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.minutes, 10)
    .tickFormat(d3.time.format('%X'))
    .tickSize(2);

    vis.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, ' + (height - 200) + ')')
      .call(x_axis);

  var y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);
    var y_axis = d3.svg.axis()
      .scale(y)
      .orient('left');


  var yt_line_function = d3.svg.line()
    .x(function(d) { return x(new Date(d.time))} )
    .y(function(d) { return y('www.youtube.com' in d.tabs) })
    .interpolate('linear');
    var yt_line = vis.append('path')
      .attr('d', yt_line_function(data))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

  var point = vis.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('cx', function(d) { return x(new Date(d.time))})
    .attr('cy', 5)
    .attr('r', 2.5);

  // point.append('circle')
    
  
}

// formats localStorage JSON data into an array
function format_json(json) {
  var new_json = []
  for (var item in json) {
    var obj = {
      time: item,
      tabs: {}
      // tabs: json[item]
    };
    json[item].forEach(function(tab) {
      // var tab_obj = {};
      // tab_obj[tab.url] = { active: tab.active };
      obj.tabs[tab.url] = { active: tab.active };
    });
    new_json.push(obj);
  }
  // sort the array by date to ensure order
  return new_json.sort(function(a,b) {
    return (new Date(a.time)) - (new Date(b.time))
  });
}

init();
