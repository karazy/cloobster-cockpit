Ext.define('EatSense.view.CustomerRequestDialog', {
	extend: 'Ext.Panel',
	xtype: 'customerrequest',
	config: {
		// modal: true,
		// hideOnMaskTap: true,
		layout: 'fit',
		// top: '30%',
		// right: '30%',
		// left: '30%',
		// bottom: '30%',
		items: [
		{
				xtype: 'label',
				html: i10n.translate('requestMsgboxTitle'),
				docked: 'top',
				cls: 'spotdetailitem-customer-label'
		},
		// {
		// 	xtype: 'titlebar',
		// 	docked: 'top',
		// 	title: i10n.translate('requestMsgboxTitle')
		// },
		{
			xtype: 'list',
			store: 'requestStore',
			itemTpl: new Ext.XTemplate('{[this.formatMessage(values)]}', {
				formatMessage: function(values) {
					if(values.type == appConstants.Request.CALL_WAITER) {
						return i10n.translate(appConstants.Request.CALL_WAITER, (values.CheckIn) ? values.CheckIn.nickname : "");
					}
				}
			}),
			allowDeselect: true,
		},{
			xtype: 'toolbar',
			docked: 'bottom',
			baseCls: 'spotdetail-toolbar',
			layout: {
				type: 'hbox',
				pack: 'center',
				align: 'middle'
			},
			items: [
				{
					action: 'dismiss',
					text: i10n.translate('requestDismiss'),
					ui: 'action'
				}
			]
		}]
	}
});