Ext.define('EatSense.view.ChooseBusiness', {
	extend: 'Ext.Panel',
	xtype: 'choosebusiness',
	config: {
		layout: {
			type: 'fit',
		},
		items: [
		{
			xtype: 'label',
			html: '<h1>'+i10n.translate('chooseStore')+'</h1>',
			docked: 'top'
		},
		{
			xtype: 'list',
			ui: 'round',
			store: 'businessStore',
			itemTpl: new Ext.XTemplate(
				"<h2>{name} <tpl if='trash'>(" + i10n.translate('business.status.deleted') + ")</tpl></h2>"
			),
		},
		{
			xtype: 'button',
			action: 'cancel',
			ui: 'action',
			docked: 'bottom',
			text: i10n.translate('cancel'),
		}]
	}
});