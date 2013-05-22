iD.ui.Sidebar = function(context) {
    return function(selection) {
        var wrap = selection.append('div')
            .style('display', 'none')
            .attr('class', 'inspector-wrap fr');

        context.on('hover.sidebar', function(entity) {
            if (!context.selection().length) {
                if (entity) {
                    wrap.call(iD.ui.Inspector(context, entity))
                        .classed('inspector-hover', true);
                } else {
                    wrap.html('');
                }
            }
        });

        context.on('select.sidebar', function(selection) {
            if (selection.length === 1) {
                wrap.call(iD.ui.Inspector(context, context.entity(selection[0])))
                    .classed('inspector-hover', false);
            } else {
                wrap.html('');
            }
        })
    }
};
