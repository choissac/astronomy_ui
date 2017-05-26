
d3.csv("data/observations.csv", function(err, observations){
    d3.csv("data/timeseries.csv", function(err, timeseries){

        var headerNames = d3.keys(observations[0]);
        var table_header = [];
        headerNames.forEach(function(d){
            table_header.push({"data": d, "title": d});
        });
        console.log(table_header);
        var obs_table = $('#observation').DataTable( {
            "columns": table_header
        } );
        obs_table.rows.add(observations).draw();

        console.log(observations);
        var output = [];

        var headerNames = d3.keys(timeseries[0]);
        var table_header = [];
        headerNames.forEach(function(d){
            table_header.push({"data": d, "title": d});
        });
        console.log(table_header);
        $('#timeseries').DataTable( {
            "columns": table_header
        } ).rows.add(timeseries).draw();

        timeseries.forEach(function(d){
            if(output[d["idx"]] == undefined)
                output[d["idx"]]= {id: d["idx"], cnt: 0, mag:[], class: d["type"]} ;
        });
        observations.forEach(function(d){
            if(output[d['id']] == undefined)
                console.log(d['id']);
            else {
                output[d['id']].cnt++;
                output[d['id']].mag.push(d["mag"]);
            }
        });
        var classes =[];

        var stats = [];
        output.forEach(function(d){
            if(classes.indexOf(d["class"]) == -1)
                classes.push(d["class"]);
            var tmp = {id: d.id, cnt: d.cnt, mean: d3.mean(d["mag"]), median: d3.median(d["mag"]), class: d["class"]};
            stats.push(tmp);
        });
        $(".btn.dropdown-toggle").text(classes[0]);
        classes.forEach(function(d){
           $("#class_drop").append('<a class="dropdown-item" href="#" id="' + d + '">' + d + '</a>');
            jQuery("#" + d).click(function(e){
//do something
                $(".btn.dropdown-toggle").text(d);
            });
        });
        headerNames.forEach(function(d){
            table_header.push({"data": d, "title": d});
        });
        console.log(table_header);
        var stats_table = $('#stats').DataTable({
                "columns": [{data: "id", title: "id"},
                    {data: "cnt", title: "N obs"},
                    {data: "mean", title: "Mean"},
                    {data: "median", title: "Median"},
                    {data: "class", title: "Class"}
                ]
            }
        );
        stats_table.rows.add(stats).draw();

    });

});

var svg = d3.select("#line").append("svg").attr("width", 600).attr("height", 300),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    // width = svg.attr("width") - margin.left - margin.right,
    // height = svg.attr("height") - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

d3.tsv("data.tsv", type, function(error, data) {
    if (error) throw error;

    var cities = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {date: d.date, temperature: d[id]};
            })
        };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
        d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
        d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
    ]);

    z.domain(cities.map(function(c) { return c.id; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Temperature, ºF");

    var city = g.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); });

    city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
});

function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}