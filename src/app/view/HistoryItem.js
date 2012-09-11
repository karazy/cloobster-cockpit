Ext.define('EatSense.view.HistoryItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'historyitem',
	config: {

		spot: {
			margin: 0
		},

		nickname: {
			margin: 0
		},

		billTime: {
			margin: 0
		},

		total: {
			margin: 0
		},

		dataMap: {
			spot: {
				setHtml: 'spotName'
			},
			nickname: {
				setHtml: 'nickname'
			},
			billTime: {
				setHtml: 'billTime'
			},
			total: {
				setHtml: 'billTotal'
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