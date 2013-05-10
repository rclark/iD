iD.ui.Inspector = function(context, entity) {
    var entityEditor,
        newFeature = false;

    function browse() {
        context.enter(iD.modes.Browse(context));
    }

    function inspector(selection) {

        var reselect = selection.html();

        selection
            .html('')
            .style('display', 'block')
            .style('right', '-500px')
            .style('opacity', 1)
            .transition()
            .duration(reselect ? 0 : 200)
            .style('right', '0px');

        var panewrap = selection
            .append('div')
            .classed('panewrap', true);

        var presetLayer = panewrap
            .append('div')
            .classed('pane grid-pane', true);

        var tagLayer = panewrap
            .append('div')
            .classed('pane tag-pane', true);

        var presetList = iD.ui.PresetList(context, entity)
            .autofocus(newFeature)
            .on('close', browse)
            .on('choose', function(preset) {
                var right = panewrap.style('right').indexOf('%') > 0 ? '0%' : '0px';
                panewrap
                    .transition()
                    .style('right', right);

                tagLayer.call(entityEditor, preset);
            });

        entityEditor = iD.ui.EntityEditor(context, entity)
            .on('close', browse)
            .on('choose', function(preset) {
                var right = panewrap.style('right').indexOf('%') > 0 ?
                    '-100%' :
                    '-' + selection.style('width');
                panewrap
                    .transition()
                    .style('right', right);

                presetList
                    .current(preset)
                    .autofocus(true);

                presetLayer.call(presetList);
            });

        var tagless = _.without(Object.keys(entity.tags), 'area').length === 0;

        if (tagless) {
            panewrap.style('right', '-100%');
            presetLayer.call(presetList);
        } else {
            panewrap.style('right', '-0%');
            tagLayer.call(entityEditor);
        }
    }

    inspector.close = function(selection) {
        entityEditor.close();
        selection.html('');
    };

    inspector.newFeature = function(_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return inspector;
    };

    return inspector;
};
