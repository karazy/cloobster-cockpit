Ext.define('EatSense.view.CompleteCheckInDialog', {
	extend: 'Ext.Panel',
	requires: [],
	xtype:'completecheckin',
	config: {
		modal: true,
		hideOnMaskTap: true,
		layout: 'fit',
		top: '10%',
		right: '30%',
		width: 300,
		height: 300,
		cls: 'general-dialog',
		items: [
		{
			xtype: 'titlebar',
			docked: 'top',
			title: i10n.translate('completecheckin.title')
		},
		{
			xtype: 'label',
			docked: 'top',
			cls: 'description',
			html: i10n.translate('completecheckin.description')
		},
		{
			xtype: 'list',
			itemTpl: '{name}',
			ui: 'round',
			allowDeselect: true
		}]
	}
});