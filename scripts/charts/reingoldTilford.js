(function(){

    var tree = DiginD3.models.tree();

    tree.dimensions().remove('size');
    tree.dimensions().remove('color');
    tree.dimensions().remove('label');

    var chart = DiginD3.chart()
        .title('Reingold–Tilford Tree')
        .description(
            "The tree layout implements the Reingold-Tilford algorithm for efficient, tidy arrangement of layered nodes. The depth of nodes is computed by distance from the root, leading to a ragged appearance.")
        .thumbnail("styles/css/images/charts/reingoldTilford.png")
        .category('Hierarchies')
        .model(tree)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)

    chart.dDiginD3(function (selection, data){
      
        var g = selection
            .attr("width", +width() )
            .attr("height", +height() )
            .append("g")
                .attr("transform", "translate(40,0)");

        var layout = d3.layout.tree()
            .size([+height(), +width() -160]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        var nodes = layout.nodes(data),
            links = layout.links(nodes);

        var link = g.selectAll("path.link")
            .data(links)
            .enter().append("path")
                .attr("class", "link")
                .style("fill","none")
                .style("stroke","#cccccc")
                .style("stroke-width","1px")
                .attr("d", diagonal);

        var node = g.selectAll("g.node")
            .data(nodes)
            .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.append("circle")
            .style("fill", "#eeeeee")
            .style("stroke","#999999")
            .style("stroke-width","1px")
            .attr("r", 4.5);

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .style("font-size","11px")
            .style("font-family","Arial, Helvetica")
            .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function (d){ return d.name; });

    })
})();
