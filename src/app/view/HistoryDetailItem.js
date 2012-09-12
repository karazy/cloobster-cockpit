Ext.define('EatSense.view.HistoryDetailItem', {
	extend: 'Ext.Panel',
	xtype: 'historydetailitem',
	requires: [
        'Ext.Label',
        'Ext.Button'
    ],
	config: {
		modal: true,
		hideOnMaskTap: 'true',
		baseCls: 'spotdetail',
		top: '5%',
		left: '10%',
		right: '15%',
		bottom: '5%',
		layout: 'fit',
		fullscreen: true,
		//this should be initially hidden
		hidden: true,
		showAnimation: 'slideIn',
		hideAnimation:  {
			type: 'slideOut',
			direction: 'right'
		},
		items: [
		{
			xtype: 'titlebar',
			docked: 'top',
			cls: 'spotdetail-titlebar',
			title: i10n.translate('history.detail.title'),
			items: [
			{
					xtype: 'button',
					action: 'close',
					text: i10n.translate('close'),
					align: 'right'
			}
			]
		},
		{
			xtype: 'panel',
			layout: {
				type: 'fit'
			},
			// fullscreen: true,
			items: [
			{
				xtype: 'panel',
				docked: 'top',
				layout: {
					type: 'hbox',
					align: 'start'
				},
				height: 100,
				items: [
				{
					xtype: 'panel',					
					// itemId: 'statistics',
					cls: 'spotdetail-statistics',
					items: [
						{
							xtype: 'label',
							itemId: 'title',					
							html: '<p>'+i10n.translate('statistic')+'</p>'
						},
						{
							xtype: 'label',
							itemId: 'checkInTime',
							tpl: new Ext.XTemplate(
								'<p>Check-In: {[this.formatTime(values.checkInTime)]}</p>',
								{
									formatTime: function(time) {
										return Ext.util.Format.date(time, 'H:i');
									}
								}
							)
						},				
						{
							xtype: 'label',
							itemId: 'total',
							tpl: new Ext.XTemplate('<p>Total: {[this.formatPrice(values.total)]}</p>',
								{
									formatPrice: function(price) {
										return appHelper.formatPrice(price);
									}
								}
							)
						}
					]
				},
				{
					xtype: 'panel',
					layout: {
						type: 'vbox',
						pack: 'start',
						align: 'start'
					},
					items: [
					{
						xtype: 'label',
						itemId: 'statusLabel',
						cls: 'spotdetail-status',
						tpl: new Ext.XTemplate('<table width="100%"><td width="100px">Status:</td><td align="right" class="{[values.status.toLowerCase()]}">{[this.translateStatus(values.status)]}</td></table>',
							{
								translateStatus: function(status) {
									return i10n.translate(status);
								}
							}
						)
					},
					{
						xtype: 'label',
						itemId: 'paymentLabel',
						cls: 'spotdetail-status',
						hidden: true,
						tpl: new Ext.XTemplate('<table><td width="100px">'+i10n.translate('paymentMethodLabel')+':</td><td class="payment">{paymentMethod}</td></table>',
							{
								translateStatus: function(status) {
									return i10n.translate(status);
								}
							}
						)
					}
					]
				}
				]
			},
			 {
				xtype: 'list',
				itemId: 'historyDetailOrders',
				store: {
					model: 'EatSense.model.Order'
				},
				itemTpl: new Ext.XTemplate(
					"<h2>{amount} x {productName} - {[this.formatPrice(values.priceCalculated)]}</h2>" +
					"<h4>Uhrzeit: {[values.orderTime.toLocaleTimeString()]}</h4>"+
					"<div class='choices'>" +
						"<tpl for='choices'>" +	
							"<tpl if='this.checkSelections(values, xindex)'>" +
								"<tpl if='!parent'><h3>{text}</h3></tpl>" +
								"<ul>" +
									"<tpl for='options'>" +
										"<tpl if='selected === true'>" +
											"<li>{name}</li>" +
										"</tpl>" +
									"</tpl>" +
								"</ul>" +
							"</tpl>" +
						"</tpl>" +
						"<tpl if='comment!=\"\"'>" +
						"<p>"+i10n.translate('comment')+": {comment}</p>" +
						"</tpl>" +
					"</div>" 
				, {
				//checks if the current choice has selections. If not it will not be shown.
				//we need to pass the product as the choices object in this context is raw data
				checkSelections: function(values, xindex) {
					console.log('Cart Overview -> checkSelections');				
					var result = false;
					Ext.each(values.options,
							function(option) {
						if(option.selected === true) {
							result = true;
						}
					});
					
					return result;
				},
				formatPrice: function(price) {
					return appHelper.formatPrice(price);
				}
			})
				// useComponents: true,
				// defaultType: 'spotdetailitem'				
			}, 
			// {
			// 	xtype: 'toolbar',
			// 	baseCls: 'spotdetail-toolbar',
			// 	docked: 'bottom',
			// 	layout: {
			// 		type: 'hbox',
			// 		align: 'middle',
			// 		pack: 'center'
			// 	},
			// 	defaults: {
			// 		ui: 'action',
			// 		cls: 'spotdetail-toolbar-button',
			// 		xtype: 'lockbutton',
			// 	},
			// 	items: [
			// 	{
			// 		text: i10n.translate('paidButton'),
			// 		action: 'paid',
			// 		disabled: true
			// 	},
			// 	{
			// 		text: i10n.translate('switchSpotButton'),
			// 		action: 'switch-spot',
			// 		disabled: true
			// 	},
			// 	{
			// 		text: i10n.translate('cancelAllOrdersButton'),
			// 		action: 'cancel-all',
			// 		disabled: true
			// 	}
			// 	]				
			// }
			]
		}
		]
	}
});