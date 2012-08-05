Ext.define('EatSense.view.Spot', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.SpotItem', 'EatSense.view.SpotDetail', 'Ext.Audio'],
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
				itemId: 'notificationSound',
            	xtype : 'audio',
            	hidden: true,
            	url   : 'res/sounds/simple.mp3'
        	}					
		]
	}

	
})