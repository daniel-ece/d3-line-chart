d3-line-chart
=============

A d3.js library to help you draw line charts easily.

## How to use it
- include `d3.js`, `d3-line-char.js`
```javascript
<script type="text/javascript" src="./d3.js" charset="utf-8"></script>
<script type="text/javascript" src="./d3-line-chart.js" charset="utf-8"></script>
```
- simplest way to draw the graph
```javascript
	var data = {
		name: 'series',
		values: [{x: 1, y: 2}, {x: 2, y : 4}, {x:3, y: 3}]
	};
	new LineChart().for([data]).plot();
```

![d3-line-chart](https://raw.githubusercontent.com/ngzhian/d3-line-chart/master/d3-line-chart.png "a simple line chart drawn with d3-line-chart")


## API
d3-line-chart actually provides a lot more options for drawing line chart, you can customize the following things.
- `id` of the svg chart, defaults to no id
- `parent` of the chart, defaults to `body`
- `all_series` an array of series that will be plotted
- `graph-width`, width of the entire graph, defaults to 960
- `graph-height`, height of the entire graph, defaults to 500
-	`margin`, margins around the chart, this can be used to draw axis and legent, defaults to (20, 100, 30, 60)
- `x_axis_text` text that is printed beside the x-axis
- `y_axis_text` text that is printed beside the y-axis
- `x_parse` function that is used to parse the `x` values of each data point, defaults to identity function
- `y_parse` function that is used to parse the `y` values of each data point, defaults to identity function
-	`x_scale` scale function for `x` values, defaults to `d3.scale.linear()` 
-	`y_scale` scale function for `y` values, defaults to `d3.scale.linear()`
- `width` the maximum width the line chart can appear in, equals to `graph_width - margin.left - margin.right`, defaults to 960 - 100 - 60
- `height` the maximum height the line chart can appear in, equals to `graph_height - margin.right - margin.bottom`, defaults to 500 - 20 - 30

## More advanced stuff
### Specify colours
### Tooltips on hover
### Date on the x axis
