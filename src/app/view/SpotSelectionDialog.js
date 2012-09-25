Ext.define('EatSense.view.SpotSelectionDialog', {
	extend: 'Ext.Panel',
	xtype: 'spotselection',
	config: {
		modal: true,
		hideOnMaskTap: true,
		layout: 'fit',
		top: '10%',
		right: '30%',
		width: 200,
		height: 300,
		cls: 'general-dialog',
		items: [
		{
			xtype: 'titlebar',
			docked: 'top',
			title: i10n.translate('spotSelectionTitle')
		},
		{
			xtype: 'label',
			docked: 'top',
			cls: 'description',
			html: i10n.translate('spotselection.description')
		},
		{
			xtype: 'list',
			store: 'spotStore',
			itemId: 'spotList',
			itemTpl: '{name}',
			ui: 'round',
			allowDeselect: true,
		}]
	}
});