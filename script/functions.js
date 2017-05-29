
d3.csv("data/observations.csv", function(err, observations){
    d3.csv("data/timeseries.csv", function(err, timeseries){
        var scatterplot_data = [];
        var cnt = 0;

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

/*
        timeseries.forEach(function(d){
            if(output[d["idx"]] == undefined)
                output[d["idx"]]= {id: d["idx"], cnt: 0, mag:[], class: d["type"]} ;
        });
*/
        observations.forEach(function(d){
            if(d["id"] == "3")
                scatterplot_data.push(d);
            if(output[d['id']] == undefined)
                output[d["id"]]= {id: d["id"], cnt: 1, mag:[d.mag], class: d["type"]} ;
                // console.log(d['id']);
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
        ScatterPlot(scatterplot_data);
    });

});
