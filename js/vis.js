var data;

var margin = {top: 50, right: 0, bottom: 0, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
  var vis = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.time.scale()
    .domain([new Date(data[0].time), new Date(data[data.length - 1].time)])
    .range([0, width - margin.top]);

  var y = d3.scale.ordinal()
    .domain(['Youtube', 'Google', 'Facebook'])
    .rangePoints([height - margin.bottom - margin.top, 0], 1);

  var x_axis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.minutes, 10)
    .tickFormat(d3.time.format('%X'))
    .tickSize(2);

  var y_axis = d3.svg.axis()
    .scale(y)
    .tickSize(1)
    .orient('right');

  vis.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - margin.top) + ')')
    .call(x_axis);
  
  vis.append('g')
    .attr('class', 'y-axis')
    .call(y_axis);


  var yt_line_function = d3.svg.line()
    .x(function(d) { return x(new Date(d.time))} )
    .y(function(d) { return y('www.youtube.com' in d.tabs) })
    .interpolate('linear');
    var yt_line = vis.append('path')
      .attr('d', yt_line_function(data))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

  // var point = vis.selectAll('circle')
  //   .data(data)
  //   .enter().append('circle')
  //   .attr('cx', function(d) { return x(new Date(d.time))})
  //   .attr('cy', 5)
  //   .attr('r', 2.5);

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
