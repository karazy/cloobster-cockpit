Ext.define('EatSense.view.ChooseBusiness', {
	extend: 'Ext.Panel',
	xtype: 'choosebusiness',
	config: {
		layout: {
				type: 'vbox'
			},
		padding: '5',
		items: [
		{
			xtype: 'label',
			html: i10n.translate('login.choosebusiness.title'),
			cls: 'loginbox-text',
			width: '100%'
		},
		{
			xtype: 'list',
			ui: 'round',
			allowDeselect: true,
			store: 'businessStore',
			itemTpl: new Ext.XTemplate(
				"<h2>{name} <tpl if='trash'>(" + i10n.translate('business.status.deleted') + ")</tpl></h2>"
			),
			flex: 1
		},
		{
			xtype: 'button',
			action: 'cancel',
			ui: 'action',
			text: i10n.translate('cancel'),
			width: '100%'
		}
		]
	}
});