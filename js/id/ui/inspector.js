iD.ui.Inspector = function(context) {
    var paneWrap,
        presetPane,
        editorPane,
        presetList,
        entityEditor,
        entityID,
        newFeature = false;

    presetList = iD.ui.PresetList(context)
        .autofocus(newFeature)
        .on('choose', function(preset) {
            paneWrap
                .transition()
                .style('right', '0%');

            entityEditor.current(preset);
        });

    entityEditor = iD.ui.EntityEditor(context)
        .on('choose', function(preset) {
            paneWrap
                .transition()
                .style('right', '-100%');

            presetList
                .current(preset)
                .autofocus(true);
        });

    function inspector(selection) {
        paneWrap = selection.append('div')
            .attr('class', 'panewrap');

        presetPane = paneWrap.append('div')
            .attr('class', 'pane grid-pane')
            .call(presetList);

        editorPane = paneWrap.append('div')
            .attr('class', 'pane tag-pane')
            .call(entityEditor);
    }

    function update() {
        presetList.entityID(entityID);
        entityEditor.entityID(entityID);

        var entity = context.entity(entityID),
            tagless = _.without(Object.keys(entity.tags), 'area').length === 0;

        paneWrap.style('right', tagless ? '-100%' : '-0%');
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
