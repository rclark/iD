iD.ui.Sidebar = function(context) {
    return function(selection) {
        var wrap = selection.append('div')
            .style('display', 'none')
            .attr('class', 'inspector-wrap fr');

        context.on('hover.sidebar', function(entity) {
            if (context.selection().length === 1) return;

            if (entity) {
                wrap.classed('inspector-hover', true)
                    .call(iD.ui.Inspector(context)
                        .entityID(entity.id));
            } else {
                wrap.html('');
            }
        });

        context.on('select.sidebar', function(selection) {
            if (selection.length === 1) {
                wrap.classed('inspector-hover', false)
                    .call(iD.ui.Inspector(context)
                        .entityID(selection[0]));
            } else {
                wrap.html('');
            }
        })
    }
};
