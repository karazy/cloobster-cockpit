Ext.define('EatSense.view.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'main',
	requires: ['EatSense.view.Spot', 'Ext.tab.Panel', 'Ext.form.FieldSet', 'Ext.field.Radio'],
	config: {
		fullscreen: true,	
		layout: {
           type: 'card',
           //override default tabpanel animation setting
           animation: null
        },
		items: [
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
				tpl: '<span>'+i10n.translate('toolbar.bottom.status')+'</span><span class="{0}"></span>'
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
			cls: 'spot-filter-panel',
			itemId: 'filterPanel',
			modal: true,
			hideOnMaskTap: true,
			padding: 5,
			width: 200,
			height: 200,
			hidden: true,
			items: [
			{
				xtype: 'label',
				html: i10n.translate('spot.filter.title'),
				cls: 'spot-filter-label'
			},
			{
				 xtype: 'fieldset',
				 defaults: {
				 	labelWidth: '100px',
				 	xtype: 'radiofield'
				 },
				 items: [
					{
			            name : 'filter',
			            label: i10n.translate('spot.filter.none'),
			            value: 'none',
			            checked: true
			        },
			        {
			            name : 'filter',
			            label: i10n.translate('spot.filter.active'),
			            value: 'active',
			        }
				 ]
			}

			]
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