Ext.define('EatSense.view.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'main',
	requires: ['EatSense.view.Spot'],
	config: {
		fullscreen: true,
		items: [
		{
			xtype: 'spotcard'
		}, 
		{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [
			{
			xtype: 'label',
			itemId: 'info'
			},
			{	
				text: i10n.translate('spot.filter.title'),
				action: 'show-filter'
			},
			{
				xtype: 'spacer'
			},
			{
				xtype: 'label',
				itemId: 'connectionStatus',
				cls: 'status-indicator',
				tpl: '<span>Status:</span><span class="{0}"></span>'
			},
			{
				xtype: 'button',
				iconCls: 'delete',
    			iconMask: true,
    			action: 'logout'
			}]
		},
		{
			xtype: 'panel',
			layout: 'fit',					
			docked: 'bottom',
			hidden: !appConfig.debug,	
			height: 150,			
			items: [
			{
				xtype: 'titlebar',
				title: 'Debug console',
				docked: 'top',
				style: 'font-size: 0.6em; font-weight: bold;'
			},
			{
				xtype: 'panel',
				id: 'debugConsole',
				scrollable: true		
			}
			]
		}
		]
	}
});