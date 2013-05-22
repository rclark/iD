iD.ui.Sidebar = function(context) {
    var inspector = iD.ui.Inspector(context);

    return function(selection) {
        var wrap = selection.append('div')
            .attr('class', 'inspector-hidden inspector-wrap fr')
            .call(inspector);

        context.on('hover.sidebar', function(entity) {
            if (context.selection().length === 1) return;

            if (entity) {
                inspector.entityID(entity.id);

                wrap.classed('inspector-hidden', false)
                    .classed('inspector-hover', true);
            } else {
                wrap.classed('inspector-hidden', true);
            }
        });

        context.on('select.sidebar', function(selection) {
            if (selection.length === 1) {
                inspector.entityID(selection[0]);

                wrap.classed('inspector-hidden', false)
                    .classed('inspector-hover', false);
            } else {
                wrap.classed('inspector-hidden', true);
            }
        })
    }
};
