Ext.define('EatSense.view.HistoryItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'historyitem',
	config: {

		spot: {
			cls: 'historyitem-spot',
			flex: 3
		},

		nickname: {
			cls: 'historyitem-customer',
			flex: 4
		},

		billTime: {
			cls: 'historyitem-time',
			flex: 2
		},

		total: {
			cls: 'historyitem-total',
			flex: 1
		},

		dataMap: {
			getSpot: {
				setHtml: 'spotName'
			},
			getNickname: {
				setHtml: 'nickname'
			},
			// getBillTime: {
			// 	setHtml: 'billTime'
			// },
			// getTotal: {
			// 	setCustomValue: 'billTotal'
			// }
		},
		layout: {
			type: 'hbox',
			align: 'stretch'
		}
	},

	applySpot: function(config) {
		return Ext.factory(config, Ext.Label, this.getSpot());
	},

	updateSpot: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);
		}
		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applyNickname: function(config) {
		return Ext.factory(config, Ext.Label, this.getNickname());
	},

	updateNickname: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);
		}
		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applyBillTime: function(config) {
		return Ext.factory(config, Ext.Label, this.getBillTime());
	},

	updateBillTime: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);
		}
		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applyTotal: function(config) {
		return Ext.factory(config, Ext.Label, this.getTotal());
	},

	updateTotal: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);
		}
		if(oldItem) {
			this.remove(oldItem);
		}
	},
	/**
	*	Overrides the private updateRecord method. Does some special actions
	*	which could not be done in dataMap.
	*
	*/
	updateRecord: function(newRecord, oldRecord) {
		var billTime = "",
			dateFormat = null,
			formattedDate = "",
			billTotal = "";

		if(newRecord) {
			billTotal = appHelper.formatPrice(newRecord.get('billTotal'));
			billTime = newRecord.get('billTime');
			dateFormat = appConstants.DateTimeFormat[appConfig.language];
			formattedDate = Ext.util.Format.date(billTime, dateFormat);

			this.getBillTime().setHtml(formattedDate);
			this.getTotal(billTotal).setHtml(billTotal);
			
		}

		this.callParent([newRecord, oldRecord]);
	}
});