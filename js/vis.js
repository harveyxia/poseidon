var raw_data;
var data;
var hostnames = [];
var y;

var margin = {top: 50, right: 0, bottom: 0, left: 300},
    width = 960 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

function init() {
  // chrome.storage.sync.get(function(json) {
  //     data = json;
  //     // draw the plot with the data
  // })
  // load data locally for now
  d3.json('/js/data.json', function(error, json) {
    if (error) return console.warn(error);
    raw_data = format_json(json);
    data = format_json2(json);
    hostnames = sort_hostnames(hostnames);
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

  /************** CREATE SCALES AND DRAW AXES **************/
  var x = d3.time.scale()
    .domain([new Date(raw_data[0].time), new Date(raw_data[raw_data.length - 1].time)])
    .range([0, width - margin.top]);

  var y = d3.scale.ordinal()
    .domain(hostnames)
    .rangePoints([height - margin.bottom - margin.top, 0],1);

  var x_axis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.minutes, 10)
    .tickFormat(d3.time.format('%X'))
    .tickSize(2);

  var y_axis = d3.svg.axis()
    .scale(y)
    .tickSize(2)
    .orient('left');

  vis.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - margin.top) + ')')
    .call(x_axis);
  
  vis.append('g')
    .attr('class', 'y-axis')
    .call(y_axis);

  // references lines for Y axis
  vis.selectAll('line.y')
    .data(hostnames.map(y))
    .enter()
    .append('path')
    .attr('d', function(d) {
      return 'M0,' + d + 'L' + width + ',' + d;
    })
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', 'none');

  /*********************** DRAW POINTS ***************************/

  hostnames.forEach(function(hostname) {
    var point = vis.append('g')
      .selectAll()
      .data(data[hostname])
      .enter().append('circle')
      .attr('cx', function(d) { return x(new Date(d)) })
      .attr('cy', function(d) { return y(hostname) })
      .attr('r', 4);
  });

    // plot_site('mail.google.com');
    // plot_site('www.facebook.com');

  // var yt_line_function = d3.svg.line()
  //   .x(function(d) { return x(new Date(d.time))  } )
  //   .y(function(d) { return y('Youtube') })
  //   .interpolate('step-before');

  //   var yt_line = vis.append('path')
  //     .attr('d', yt_line_function(data.filter(function(item) { return item.tabs['www.youtube.com'] } )))
  //     .attr('stroke', 'blue')
  //     .attr('stroke-width', 5)
  //     .attr('fill', 'none');

  // var point = vis.selectAll('circle')
  //   .data(data['www.youtube.com'])
  //   .enter().append('circle')
  //   .attr('cx', function(d) { return x(new Date(d)) })
  //   .attr('cy', function(d) { return y('Youtube') })
  //   .attr('r', 2.5);

  //   console.log(y('Youtube') + height);

  // point.append('circle')
  // function plot_site(hostname) {
  //   console.log(hostname);
  //   console.log(hostname + y(hostname)); 
  //   var point = vis.selectAll('circle')
  //     .data(data[hostname])
  //     .enter().append('circle')
  //     .attr('cx', function(d) { return x(new Date(d)) })
  //     .attr('cy', function(d) { return y(hostname) })
  //     .attr('r', 2.5);
  // }
}



// formats localStorage JSON data into an array
function format_json(json) {
  var new_json = []
  for (var item in json) {
    var obj = {
      time: item,
      tabs: {}
    };
    json[item].forEach(function(tab) {
      if (hostnames.indexOf(tab.url) === -1) { hostnames.push(tab.url); }
      obj.tabs[tab.url] = { active: tab.active };
    });
    new_json.push(obj);
  }
  // sort the array by date to ensure order
  return new_json.sort(function(a,b) {
    return (new Date(a.time)) - (new Date(b.time))
  });
}

function format_json2(json) {
  var new_json = {};
  for (var item in json) {
    json[item].forEach(function(tab) {
      // add to hostnames array
        if (hostnames.indexOf(tab.url) === -1) { hostnames.push(tab.url); }
        if (!(tab.url in new_json)) {
          new_json[tab.url] = [item];
        } else {
          new_json[tab.url].push(item);
        }
    });
  }
  return new_json;
}

function sort_hostnames(hostnames) {
  hostnames.sort(function(a,b) {
    return data[a].length - data[b].length;
  });

  return hostnames;
}

// function get_time_ranges(data) {
//   var time_ranges = {};
//   hostnames.forEach(function(hostname) {
//     var interval = false;
//     time_ranges[hostname] = [];
//     data.forEach(function(datum) {
//         if (interval && (hostname in datum.tabs)) {

//         } else {
//           timeranges[hostname].push()
//         }
//     });
//   });
// }

init();
