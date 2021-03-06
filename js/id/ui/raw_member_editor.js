iD.ui.RawMemberEditor = function(context) {
    var id;

    function selectMember(d) {
        context.enter(iD.modes.Select(context, [d.member.id]));
    }

    function changeRole(d) {
        var role = d3.select(this).property('value');
        context.perform(
            iD.actions.ChangeMember(id, _.extend({}, d.member, {role: role}), d.index),
            t('operations.change_role.annotation'));
    }

    function deleteMember(d) {
        context.perform(
            iD.actions.DeleteMember(id, d.index),
            t('operations.delete_member.annotation.' + context.geometry(d.member.id)));
    }

    function rawMemberEditor(selection) {
        var entity = context.entity(id),
            memberships = [];

        entity.members.forEach(function(member, index) {
            memberships.push({member: member, index: index, entity: context.hasEntity(member.id)});
        });

        selection.call(iD.ui.Disclosure()
            .title(t('inspector.all_members') + ' (' + memberships.length + ')')
            .expanded(true)
            .on('toggled', toggled)
            .content(content));

        function toggled(expanded) {
            if (expanded) {
                selection.node().parentNode.scrollTop += 200;
            }
        }

        function content($wrap) {
            var $list = $wrap.selectAll('.member-list')
                .data([0]);

            $list.enter().append('ul')
                .attr('class', 'member-list');

            var $items = $list.selectAll('li')
                .data(memberships, function(d) { return iD.Entity.key(entity) + ',' + d.index; });

            var $enter = $items.enter().append('li')
                .attr('class', 'member-row form-field');

            $enter.each(function(d) {
                if (d.entity) {
                    var $label = d3.select(this).append('label')
                        .attr('class', 'form-label')
                        .append('a')
                        .attr('href', '#')
                        .on('click', selectMember);

                    $label.append('span')
                        .attr('class', 'member-entity-type')
                        .text(function(d) { return context.presets().match(d.entity, context.graph()).name(); });

                    $label.append('span')
                        .attr('class', 'member-entity-name')
                        .text(function(d) { return iD.util.localeName(d.entity); });

                } else {
                    d3.select(this).append('label')
                        .attr('class', 'form-label member-incomplete')
                        .text(t('inspector.incomplete'));
                }
            });

            $enter.append('input')
                .attr('class', 'member-role')
                .property('type', 'text')
                .attr('maxlength', 255)
                .attr('placeholder', t('inspector.role'))
                .property('value', function(d) { return d.member.role; })
                .on('change', changeRole);

            $enter.append('button')
                .attr('tabindex', -1)
                .attr('class', 'remove button-input-action member-delete minor')
                .on('click', deleteMember)
                .append('span')
                .attr('class', 'icon delete');

            $items.exit()
                .remove();
        }
    }

    rawMemberEditor.entityID = function(_) {
        if (!arguments.length) return id;
        id = _;
        return rawMemberEditor;
    };

    return rawMemberEditor;
};
