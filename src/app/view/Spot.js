Ext.define('EatSense.view.Spot', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.SpotItem', 'EatSense.view.SpotDetail'],
	xtype: 'spotcard',
	config: {
		title: i10n.translate('spotsTitle'),
		layout: 'fit',
		//holds data of assigned area
		area: null,
		items: [		
			{
				xtype: 'dataview',
				itemId: 'spotsview',
				store: 'spotStore',
				baseCls: 'dv-baseCls',
				itemCls: 'spot',
				useComponents: true,
				defaultType: 'spotitem'			
			}						
		]
	}
});