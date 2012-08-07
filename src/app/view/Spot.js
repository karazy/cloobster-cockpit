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
				xtype: 'panel',
				// docked: 'right',
				cls: 'spot-filter-panel',
				itemId: 'filterPanel',
				// margin: '0 5 0 0',
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
				            // xtype: 'radiofield',
				            name : 'filter',
				            label: i10n.translate('spot.filter.none'),
				            value: 'none',
				            // labelWidth: '90%',
				            checked: true
				        },
				        {
				            // xtype: 'radiofield',
				            name : 'filter',
				            label: i10n.translate('spot.filter.active'),
				            value: 'active',
				            // labelWidth: '90%'
				        }
					 ]
				}

				]
			}						
		]
	}

	
})