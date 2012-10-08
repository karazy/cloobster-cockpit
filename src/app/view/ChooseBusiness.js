Ext.define('EatSense.view.ChooseBusiness', {
	extend: 'Ext.Panel',
	xtype: 'choosebusiness',
	config: {
		layout: {
				type: 'vbox',
				// align: 'middle',
				// pack: 'center'
			},
		padding: '5',
		items: [
		{
			xtype: 'label',
			html: i10n.translate('login.choosebusiness.title'),
			// docked: 'top',
			cls: 'loginbox-text',
			width: '100%',
			// flex: 1
		},
		{
			xtype: 'list',
			ui: 'round',
			layout: 'fit',
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
			// docked: 'bottom',
			text: i10n.translate('cancel'),
			width: '100%',
			// flex: 1
		}]
	}
});