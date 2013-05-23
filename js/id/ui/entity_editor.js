iD.ui.EntityEditor = function(context) {
    var event = d3.dispatch('choose'),
        id,
        tags,
        preset,
        selection,
        presetUI,
        rawTagEditor;

    function browse() {
        context.enter(iD.modes.Browse(context));
    }

    function update() {
        var entity = context.hasEntity(id);
        if (!entity) return;

        tags = _.clone(entity.tags);

        selection
            .datum(preset)
            .html('');

        var messagewrap = selection.append('div')
            .attr('class', 'header fillL cf');

        messagewrap.append('button')
            .attr('class', 'preset-reset fl ')
            .on('click', function() {
                event.choose(preset);
            })
            .append('span')
            .attr('class', 'icon back');

        messagewrap.append('h3')
            .attr('class', 'inspector-inner')
            .text(t('inspector.editing_feature', { feature: preset.name() }));

        messagewrap.append('button')
            .attr('class', 'preset-close fr')
            .on('click', browse)
            .append('span')
            .attr('class', 'icon close');

        var editorwrap = selection.append('div')
            .attr('class', 'tag-wrap inspector-body fillL2');

        editorwrap.append('div')
            .attr('class', 'col12 inspector-inner preset-icon-wrap')
            .append('div')
            .attr('class','fillL')
            .call(iD.ui.PresetIcon(context.geometry(id)));

        presetUI = iD.ui.preset(context, entity, preset)
            .on('change', changeTags);

        rawTagEditor = iD.ui.RawTagEditor(context, entity)
            .on('change', changeTags);

        var tageditorpreset = editorwrap.append('div')
            .attr('class', 'inspector-preset cf fillL col12')
            .call(presetUI);

        editorwrap.append('div')
            .attr('class', 'inspector-inner raw-tag-editor col12')
            .call(rawTagEditor, preset.id === 'other');

        if (!entity.isNew()) {
            var osmLink = tageditorpreset.append('div')
                .attr('class', 'col12 inspector-inner inspector-external-links')
                .append('a')
                .attr('href', context.connection().entityURL(entity))
                .attr('target', '_blank');

            osmLink.append('span')
                .attr('class','icon icon-pre-text out-link');

            osmLink.append('span').text(t('inspector.view_on_osm'));
        }

        presetUI.change(tags);
        rawTagEditor.tags(tags);

        changeTags();

        context.history()
            .on('change.entity-editor', historyChanged);
    }

    function entityEditor(s) {
        selection = s;
    }

    function clean(o) {
        var out = {};
        for (var k in o) {
            var v = o[k].trim();
            if (v) out[k] = v;
        }
        return out;
    }

    function changeTags(changed) {
        tags = clean(_.extend(tags, changed));
        var entity = context.hasEntity(id);
        if (entity && !_.isEqual(entity.tags, tags)) {
            context.perform(
                iD.actions.ChangeTags(entity.id, tags),
                t('operations.change_tags.annotation'));
        }
    }

    function historyChanged() {
        var entity = context.hasEntity(id);
        if (!entity) return;
        preset = context.presets().match(entity, context.graph());
        update();
    }

    entityEditor.entityID = function(_) {
        if (!arguments.length) return id;
        id = _;
        var entity = context.entity(id);
        preset = context.presets().match(entity, context.graph());
        update();
        return entityEditor;
    };

    entityEditor.current = function(_) {
        if (!arguments.length) return preset;
        var geometry = context.geometry(id);
        tags = preset.removeTags(tags, geometry);
        tags = _.applyTags(tags, geometry);
        preset = _;
        update();
        return entityEditor;
    };

    entityEditor.close = function() {
        // Blur focused element so that tag changes are dispatched
        // See #1295
        document.activeElement.blur();

        // Firefox incorrectly implements blur, so typeahead elements
        // are not correctly removed. Remove any stragglers manually.
        d3.selectAll('div.typeahead').remove();

        context.history()
            .on('change.entity-editor', null);
    };

    return d3.rebind(entityEditor, event, 'on');
};
