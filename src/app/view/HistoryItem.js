Ext.define('EatSense.view.HistoryItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'historyitem',
	config: {

		spot: {
			cls: 'historyitem-spot'
		},

		nickname: {
			cls: 'historyitem-customer'
		},

		billTime: {
			cls: 'historyitem-time'
		},

		total: {
			cls: 'historyitem-total',
			setCustomValue: function(value) {
				setHtml(value + "TEST");
			}
		},

		dataMap: {
			getSpot: {
				setHtml: 'spotName'
			},
			getNickname: {
				setHtml: 'nickname'
			},
			getBillTime: {
				setHtml: 'billTime'
			},
			getTotal: {
				setCustomValue: 'billTotal'
			}
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
});