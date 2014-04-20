function LineChart(opts) {
	opts = opts || {};
	var lc = {
		id: opts.id,
		parent: opts.parent || 'body',
		class: 'd3-line-chart',
		all_series: [],
		graph_width: opts.graph_width || 960,
		graph_height: opts.graph_height || 500,
		margin: opts.margin || {top: 20, right: 100, bottom: 30, left: 60},
		x_axis_text: opts.x_axis_text || 'x-axis',
		y_axis_text: opts.y_axis_text || 'y-axis',
		x_parse: opts.x_parse || function(d) { return d; },
		y_parse: opts.y_parse || function(d) { return d; },
		x_scale: opts.x_scale || d3.scale.linear(),
		y_scale: opts.y_scale || d3.scale.linear(),
		tooltip: opts.tooltip || function(div, point) {
			div.select(".title").text(lc.x_axis_text + ': ' + point.x);
			div.select(".desc").text(point.y);
		}
	};

	lc.width = lc.graph_width - lc.margin.left - lc.margin.right;
	lc.height = lc.graph_height - lc.margin.top - lc.margin.bottom;
	lc.x_scale.range([0, lc.width]);
	lc.y_scale.range([lc.height, 0]);

	lc.at = function(id) {
		lc.parent = id || 'body';
	}

	lc.parse_using = function(x_parse, y_parse) {
  	lc.x_parse = x_parse || lc.x_parse;
  	lc.y_parse = y_parse || lc.y_parse;
  	return lc;
  } 

  lc.scale_using = function(x_scale, y_scale) {
  	lc.x_scale = x_scale || lc.x_scale;
  	lc.y_scale = y_scale || lc.y_scale;
  }

  lc.for = function(data) {
  	lc.all_series = data;
  	return lc;
  }

  lc.addSeries = function(series) {
  	lc.all_series.push(series);
  	return lc;
  }

  function calculate_domain(lc) {
  	lc.x_scale.domain([
  		d3.min(lc.all_series, function(s) { return d3.min(s.values, function(c) { return c.x }); }),
  		d3.max(lc.all_series, function(s) { return d3.max(s.values, function(c) { return c.x }); })
  		]);
  	lc.y_scale.domain([
  		d3.min(lc.all_series, function(s) { return d3.min(s.values, function(c) { return c.y }); }),
  		d3.max(lc.all_series, function(s) { return d3.max(s.values, function(c) { return c.y }); })
  		]);
  }

  function parse_all_data_points(lc) {
  	lc.all_series.forEach(function (data) {
  		data.values.forEach(function(d) {
  			d.x = lc.x_parse(d.x);
  			d.y = lc.y_parse(d.y);
  		});
  	});
  }

  function plot_axis(lc) {
  	var xAxis = d3.svg.axis().scale(lc.x_scale).orient("bottom");
  	var yAxis = d3.svg.axis().scale(lc.y_scale).orient("left");

  	lc.graph.append("g")
  	.attr("class", "x axis")
  	.attr("transform", "translate(0," + lc.height + ")")
  	.call(xAxis)
  	.append("text")
  	.attr("x", lc.width)
  	.attr("y", -10)
  	.style("text-anchor", "end")
  	.text(lc.x_axis_text);

  	lc.graph.append("g")
  	.attr("class", "y axis")
  	.call(yAxis)
  	.append("text")
  	.attr("transform", "rotate(-90)")
  	.attr("y", 6)
  	.attr("dy", ".71em")
  	.style("text-anchor", "end")
  	.text(lc.y_axis_text);
  }

  function build_svg(lc) {
  	var svg = d3.select(lc.parent).append("svg")
  	.attr("id", lc.id)
  	.attr("width", lc.graph_width)
  	.attr("height", lc.graph_height)
  	.append("g")
  	.attr("transform", "translate(" + lc.margin.left + "," + lc.margin.top + ")");
  	lc.graph = svg;
  }

  function plot_points(series_index, data) {
  		lc.graph.selectAll(".commit-circle-" + series_index).data(data)
  		.enter().append("g")
  		.append("circle")
  		.attr("class", "commit-circle")
  		.attr("cx", function(d) { return lc.x_parse(d.x); })
  		.attr("r", 10)
  		.attr("cy", function(d) { return lc.y_parse(d.y); })
  		.style("stroke", d3.rgb(lc.color(series_index)).brighter())
  		.style("fill", lc.color(series_index))
  		.on("mouseenter", function(d) {
  			var xPosition = d3.event.pageX + 10;
  			var yPosition = d3.event.pageY;
  			var tooltip = d3.select("#tooltip")
  			.style("left", xPosition + "px")
  			.style("top", yPosition + "px");
  			tooltip.select(".title").text(lc.x_axis_text + ': ' + d.x);
  			tooltip.select(".desc").text(d.y);
  			tooltip.classed("hidden", false);
  		})
  		.on("mouseleave", function() {
  			d3.select("#tooltip").classed("hidden", true);
  		});
  	}

  lc.plot = function() {
  	var x = lc.x_scale;
  	var y = lc.y_scale;

  	build_svg(lc);

  	parse_all_data_points(lc);

  	calculate_domain(lc);

  	plot_axis(lc);

  	var color = d3.scale.category10();
  	color.domain(lc.all_series.map(function(d) { return d.name }));
  	lc.color = color;

  	lc.all_series.forEach(function(val, index, array) {
  		var legend = lc.graph.append("g");
  		legend.append("text")
  		.attr("class", "legend-text-" + index)
  		.text(val.name)
  		.attr("x", lc.width + 15)
  		.attr("y", 4 + index*20);

  		legend.append("circle")
  		.attr("class", "legend-circle-" + index)
  		.attr("cx", lc.width)
  		.attr("cy", index*20)
  		.attr("r", 8)
  		.style("stroke", d3.rgb(color(index)).brighter())
  		.style("stroke-width", "0.4em")
  		.style("fill", color(index));

  		var line = d3.svg.line()
  		.x(function(d) { return x(d.x); })
  		.y(function(d) { return y(d.y); });

  		var data = val.values;
  		lc.graph.append("path")
  		.attr("class", "line")
  		.attr("d", line(data))
  		.style("stroke", color(index));

  		// plot_points(index, data);

  		lc.graph.selectAll(".commit-circle-" + index).data(data)
  		.enter().append("g")
  		.append("circle")
  		.attr("class", "commit-circle")
  		.attr("cx", function(d) { return x(d.x); })
  		.attr("r", 10)
  		.attr("cy", function(d) { return y(d.y); })
  		.style("stroke", d3.rgb(color(index)).brighter())
  		.style("fill", color(index))
  		.on("mouseenter", function(d) {
  			var xPosition = d3.event.pageX + 10;
  			var yPosition = d3.event.pageY;
  			var tooltip = d3.select("#tooltip")
  			.style("left", xPosition + "px")
  			.style("top", yPosition + "px");
  			lc.tooltip(tooltip, d);
  			tooltip.classed("hidden", false);
  		})
  		.on("mouseleave", function() {
  			d3.select("#tooltip").classed("hidden", true);
  		});
  	});
}
return lc;
}