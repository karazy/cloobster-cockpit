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
		left: '20%',
		right: '5%',
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
				cls: 'history-info-panel',
				itemId: 'infoPanel',
				layout: {
					type: 'hbox',
					align: 'start'
				},
				tpl: new Ext.XTemplate(
					'<div class="row">'+
					'<div><span class="font-bold">'+i10n.translate('history.detail.info.spot')+'</span> {spotName}</div>'+
					'<div><span class="font-bold">'+i10n.translate('history.detail.info.nickname')+'</span> {nickname}</div>'+
					'</div><div class="row">'+
					'<div><span class="font-bold">'+i10n.translate('history.detail.info.billtime')+'</span> {[this.formatTime(values.billTime)]}</div>'+
					'<div><span class="font-bold">'+i10n.translate('history.detail.info.billtotal')+'</span> {[this.formatPrice(values.billTotal)]} - {paymentMethod}</div>'+
					'</div>'
					,
					{
						formatTime: function(time) {
							var dateFormat = appConstants.DateTimeFormat[appConfig.language],
								formattedDate = Ext.util.Format.date(time, dateFormat);
							return formattedDate;
						},
						formatPrice: function(price) {
							return appHelper.formatPrice(price);
						}
					})
			},
			{
				xtype: 'label',
				docked: 'top',
				cls: 'history-detail-list-title',
				html: i10n.translate('history.detail.list.title')
			},
			{
				xtype: 'list',
				itemId: 'historyDetailOrders',
				store: {
					model: 'EatSense.model.Order'
				},
				cls: 'spotdetailitem-order',
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
			}, 
			]
		}
		]
	}
});