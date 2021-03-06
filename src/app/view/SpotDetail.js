/**
*	Displays details of a spot.
*	Details are checkIns, orders and statistics.
*/
Ext.define('EatSense.view.SpotDetail', {
	extend: 'Ext.Panel',
	xtype: 'spotdetail',
	requires: ['EatSense.view.SpotDetailItem'],
	config: {
		modal: true,
		hideOnMaskTap: 'true',
		baseCls: 'spotdetail',
		top: '5%',
		left: '7px',
		right: '7px',
		bottom: '4%',
		layout: 'fit',
		fullscreen: true,
		//this should be initially hidden
		hidden: true,
		listeners: {
			/**
			* Toggles enabled/disabled status of buttons.
			* true for disabled
			*/
			'eatSense.customer-update': function(active) {
				//enable/disable action buttons depending on customer status
				try {
					var nestedButtons = null;
					// console.log('customer-update event. active state: ' + active);
					this.down('button[action=switch-spot]').setDisabled(active);
					this.down('button[action=paid]').setDisabled(active);			
					this.down('button[action=cancel-all]').setDisabled(active);
					this.down('button[action=confirm-all]').setDisabled(active);
					this.down('button[action=complete-checkin]').setDisabled(active);
				} catch(e) {
					console.log(e);
				}
			}
		},
		items: [
		{
			xtype: 'titlebar',
			docked: 'top',
			cls: 'spotdetail-titlebar',
			items: [
			{
					xtype: 'button',
					action: 'close',
					// baseCls: 'spotdetail-close',
					text: i10n.translate('close'),
					align: 'right'
			}
			]
		},
		{
			xtype: 'customerrequest',
			docked: 'right',
			layout:'fit',
			minWidth: 200
		},
		{	//customer list
			xtype: 'panel',
			layout:  {
				type: 'fit'
			},
			docked: 'left',
			width: 200,
			items: [{
				xtype: 'label',
				html: i10n.translate('spotDetailCustomerLabel'),
				docked: 'top',
				cls: 'spotdetailitem-customer-label'
			},{
				xtype: 'list',
				itemId: 'checkInList', 
				itemTpl: new Ext.XTemplate(
						 "<tpl if='status == \"ORDER_PLACED\" || status == \"PAYMENT_REQUEST\"'>"+
							 "<div class='spotdetail-customer-flag'> </div>"+
						 "</tpl>"+
						"<h2 class='spotdetail-customer-name {[values.status == \"ORDER_PLACED\" ? \"customer-highlight\" : \"\"]}'>{nickname}</h2>"
						
						),
				store: 'checkInStore',
				ui: 'round'
			}
			]
		},
		{	//status panel
			xtype: 'panel',
			layout: {
				type: 'fit'
			},
			items: [
			{
				xtype: 'panel',
				docked: 'top',
				cls: 'spotdetail-status-panel',
				layout: {
					type: 'vbox',
					pack: 'center',
					align: 'start'

				},
				items: [
				{
					xtype: 'panel',					
					layout: {
						type: 'hbox',
						align: 'start'
					},
					width: '100%',
					items: [
						{
							xtype: 'label',
							itemId: 'checkInTime',
							cls: 'spotdetail-status',
							width: '35%',
							tpl: new Ext.XTemplate(
								'<div class="key">Check-In:</div><div class="value">{[this.formatTime(values.checkInTime)]}</div>',
								{
									formatTime: function(time) {
										var dateFormat = appConstants.DateTimeFormat[appConfig.language];
										
										return Ext.util.Format.date(time, dateFormat);
									}
								}
							)
						},
						{
							xtype: 'label',
							itemId: 'accountDetail',
							cls: 'spotdetail-status',
							width: '65%',
							tpl: new Ext.XTemplate('<div class="key">E-Mail:</div><div class="value">{email}</div>')
						}				
												
					]
				},
				{
					xtype: 'panel',
					layout: {
						type: 'hbox',
						align: 'start'
					},
					width: '100%',
					items: [
					{
						xtype: 'label',
						itemId: 'statusLabel',
						cls: 'spotdetail-status',
						width: '35%',
						tpl: new Ext.XTemplate('<div class="key">Status:</div><tpl if="status"><div class="value {[values.status.toLowerCase()]}">{[this.translateStatus(values.status)]}</div></tpl>',
							{
								translateStatus: function(status) {
									return i10n.translate(status);
								}
							}
						)
					},
					{
						xtype: 'label',
						itemId: 'total',
						width: '25%',
						cls: 'spotdetail-status',
						tpl: new Ext.XTemplate('<div class="key">Total:</div><div class="value">{[this.formatPrice(values.total)]}</div>',
							{
								formatPrice: function(price) {
									return appHelper.formatPrice(price);
								}
							}
						)
					},
					{
						xtype: 'label',
						itemId: 'paymentLabel',
						cls: 'spotdetail-status',
						width: '30%',
						hidden: true,
						tpl: new Ext.XTemplate('<div class="key">'+i10n.translate('paymentMethodLabel')+':</div><div class="value">{paymentMethod}</div>',
							{
								translateStatus: function(status) {
									return i10n.translate(status);
								}
							}
						)
					}					
					]
				},
				{
					xtype: 'panel',
					layout: {
						type: 'hbox',
						align: 'start'
					},
					width: '100%',
					defaults: {
						width: '50%'
					},
					items: [
						{
							xtype: 'label',
							itemId: 'spotLabel',
							cls: 'spotdetail-status',
							tpl: new Ext.XTemplate('<div class="key">Spot:</div><div class="value">{[values.spotName]}</div>')
						},
						{
							xtype: 'label',
							itemId: 'areaLabel',
							cls: 'spotdetail-status',
							tpl: new Ext.XTemplate('<div class="key">Area:</div><div class="value">{[values.areaName]}</div>')
						}
					]
				},
				{
					xtype: 'toolbar',
					// layout: {
					// 	type: 'hbox',
					// 	align: 'center'
					// },
					// margin: '5 0 5 0',
					ui: 'gray',
					border: 0,
					docked: 'bottom',
					defaults: {
						ui: 'action',
						cls: 'spotdetail-toolbar-button',
						xtype: 'lockbutton',
					},
					items: [
					{
						xtype: 'lockbutton',
						action: 'confirm-all',
						disabled: true,
						text: i10n.translate('confirmAllOrdersButton'),
						ui: 'action',
					},
					{
						text: i10n.translate('spotdetail.checkin.complete'),
						action: 'complete-checkin',
						disabled: true,
						ui: 'action'
					},
					{
						text: i10n.translate('paidButton'),
						action: 'paid',
						disabled: true,
						ui: 'action'
					},
					{
						xtype: 'spacer'
					},
					{
						// text: i10n.translate('cancelAllOrdersButton'),
						action: 'cancel-all',
						disabled: true,
						ui: 'action',
						iconCls: 'trash',
						iconMask: true
					},
					{
						// text: i10n.translate('switchSpotButton'),
						action: 'switch-spot',
						disabled: true,
						iconMask: true,
						iconCls: 'move'
					}								
					]
				},
				]
			},
			{
				xtype: 'dataview',
				itemId: 'spotDetailOrders',
				store: 'orderStore',
				useComponents: true,
				defaultType: 'spotdetailitem'				
			}, 
			]
		}
		]
	},

	hideRequestsPanel: function() {
		var panel = this.down('customerrequest');

		if(panel) {
			panel.hide();
		}
	},

	showRequestsPanel: function() {
		var panel = this.down('customerrequest');

		if(panel) {
			panel.show();
		}
	},

	isRequestPanelHidden: function() {
		var panel = this.down('customerrequest');

		if(panel) {
			return panel.getHidden();
		}

		return false;
	}
});