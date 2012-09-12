Ext.define('EatSense.view.Spot', {
	extend: 'Ext.Panel',
	requires: ['Ext.plugin.ListPaging', 'EatSense.view.SpotItem', 'EatSense.view.SpotDetail', 'EatSense.view.RequestItem', 'EatSense.view.HistoryItem'],
	xtype: 'spotcard',
	config: {
		title: i10n.translate('spotsTitle'),
		layout: {
			type: 'card',
			animation : {
				type : 'slide',
				direction : 'left'
			}
		},
		//holds data of assigned area
		area: null,
		//Counts spot requests! Each spot which has at least one request increases the counter by 1.
		areaFilter : null,
		activeItem : 0,
		items: [
					{
						xtype: 'panel',
						layout: 'fit',
						items: [
						{
							xtype: 'titlebar',
							docked: 'top',
							title: i10n.translate('spot.filterbar.spotview'),
							items: [
							{	
								text: i10n.translate('spot.filter.title'),
								action: 'show-filter'
							},
							{
								xtype: 'spacer'
							},
							{
								text: i10n.translate('spot.filterbar.requestview'),
								ui: 'forward',
								action: 'show-requestview',
								align: 'right'
							}
							]
						},
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
					},
					{
						xtype: 'panel',
						layout: 'fit',
						items: [
						{
							xtype: 'titlebar',
							docked: 'top',
							title: i10n.translate('spot.filterbar.requestview'),
							items: [
							{
								text: i10n.translate('spot.filterbar.spotview'),
								ui: 'back',
								action: 'show-spotview'
							},
							{	
								text: i10n.translate('request.sort.title'),
								action: 'show-request-sort'
							},
							{
								xtype: 'spacer'
							},
							{
								text: i10n.translate('spot.filterbar.historyview'),
								ui: 'forward',
								action: 'show-forward-requestview',
								align: 'right'
							}
							]
						},
						{
							xtype: 'dataview',
							itemId: 'requestDataview',
							useComponents: true,
							defaultType: 'requestitem',
							store: 'defRequestStore',
							cls: 'requestitem-container',
							itemCls: 'requestitem-wrapper',
							pressedCls: 'requestitem-wrapper-pressed',
						}	
						]
					},
					{
						xtype: 'panel',
						layout: 'fit',
						items: [
						{
							xtype: 'titlebar',
							docked: 'top',
							title: i10n.translate('spot.filterbar.historyview'),
							items: [
							{
								text: i10n.translate('spot.filterbar.requestview'),
								ui: 'back',
								action: 'show-back-historyview'
							}
							]
						},
						{
							xtype: 'dataview',
							itemId: 'historyDataview',
							useComponents: true,
							defaultType: 'historyitem',
							store: 'historyStore',
							cls: 'historyitem-container',
							itemCls: 'historyitem-wrapper',
							pressedCls: 'historyitem-wrapper-pressed',
							plugins: [
						        {
						            xclass: 'Ext.plugin.ListPaging',
						            loadMoreText: i10n.translate('history.detail.list.paging')
						            // autoPaging: true
						        }
						    ]
						}	
						]
					}

		]
	}
});