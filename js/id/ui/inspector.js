iD.ui.Inspector = function(context) {
    var paneWrap,
        presetPane,
        editorPane,
        presetList,
        entityEditor,
        entityID,
        newFeature = false;

    function inspector(selection) {
        paneWrap = selection.append('div')
            .attr('class', 'panewrap');

        presetPane = paneWrap.append('div')
            .attr('class', 'pane grid-pane');

        editorPane = paneWrap.append('div')
            .attr('class', 'pane tag-pane');
    }

    function update() {
        var entity = context.entity(entityID);

        presetList = iD.ui.PresetList(context, entity)
            .autofocus(newFeature)
            .on('choose', function(preset) {
                paneWrap
                    .transition()
                    .style('right', '0%');

                editorPane.call(entityEditor, preset);
            });

        entityEditor = iD.ui.EntityEditor(context, entity)
            .on('choose', function(preset) {
                paneWrap
                    .transition()
                    .style('right', '-100%');

                presetList
                    .current(preset)
                    .autofocus(true);

                presetPane.call(presetList);
            });

        var tagless = _.without(Object.keys(entity.tags), 'area').length === 0;

        if (tagless) {
            paneWrap.style('right', '-100%');
            presetPane.call(presetList);
        } else {
            paneWrap.style('right', '-0%');
            editorPane.call(entityEditor);
        }
    }

    inspector.entityID = function(_) {
        if (!arguments.length) return entityID;
        entityID = _;
        update();
        return inspector;
    };

    inspector.newFeature = function(_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return inspector;
    };

    return inspector;
};
