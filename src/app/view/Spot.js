Ext.define('EatSense.view.Spot', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.SpotItem', 'EatSense.view.SpotDetail', 'EatSense.view.RequestItem'],
	xtype: 'spotcard',
	config: {
		title: i10n.translate('spotsTitle'),
		layout: 'fit',
		//holds data of assigned area
		area: null,
		//Counts spot requests! Each spot which has at least one request increases the counter by 1.
		areaFilter : null,
		items: [
			{
				xtype: 'carousel',
				// layout: {
				// 	type: 'card'
				// },
				activeItem : 0,
				items: [
					{
						xtype: 'dataview',
						itemId: 'spotsview',
						store: 'spotStore',
						baseCls: 'dv-baseCls',
						itemCls: 'spot',
						useComponents: true,
						defaultType: 'spotitem'
					},
					{
						xtype: 'dataview',
						itemId: 'requestDataview',
						useComponents: true,
						// width: 400,
						// height: 400,
						defaultType: 'requestitem',
						// store: {
						// 	model: 'EatSense.model.Request',
						// }
						store: 'defRequestStore'
					}	
				]
			}

		]
	}
});