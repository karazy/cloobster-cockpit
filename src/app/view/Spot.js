Ext.define('EatSense.view.Spot', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.SpotItem', 'EatSense.view.SpotDetail'],
	xtype: 'spotcard',
	config: {
		id: 'spotcard',
		title: i10n.translate('spotsTitle'),
		fullscreen: true,
		layout: 'fit',
		items: [		
			{
				xtype: 'dataview',
				itemId: 'spotsview',
				store: 'spotStore',
				baseCls: 'dv-baseCls',
				itemCls: 'spot',
				useComponents: true,
				defaultType: 'spotitem',
			},
			{
				xtype: 'toolbar',
				docked: 'right',
				width: 300,
				items: [
				{
					text: i10n.translate('spot.filter.active'),
					action: 'filter-active',
					ui: 'action'
				},
				{
					text: i10n.translate('spot.filter.none'),
					action: 'filter-none',
					ui: 'action'
				},
				{
					 xtype: 'fieldset',
					 items: [
						{
				            xtype: 'radiofield',
				            name : 'filter',
				            label: i10n.translate('spot.filter.none'),
				            value: 'none',
				            labelWidth: '80%',
				            checked: true
				        },
				        {
				            xtype: 'radiofield',
				            name : 'filter',
				            label: i10n.translate('spot.filter.active'),
				            value: 'active',
				            labelWidth: '80%'
				        }
					 ]
				}

				]
			}						
		]
	}

	
})