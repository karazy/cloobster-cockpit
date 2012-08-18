/**
*	Represents a question of a feedback form.
*/
Ext.define('EatSense.view.RequestItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'requestitem',
	config: {

		/** An Ext.Label displaying question text. */
		spot : {
			margin: '0 5 0 0'
		},

		customer: {
			margin: '0 5 0 0'
		},

		requestTime : {

		},

		dataMap: {
			getSpot: {
				setHtml: 'spotName'
			},
			getCustomer: {
				setHtml: 'checkInName'
			},
			getRequestTime : {
				setHtml: 'receivedTime'
			}
	 	},
	 	layout: {
			type: 'hbox',
			align: 'center'
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

	applyCustomer: function(config) {
		return Ext.factory(config, Ext.Label, this.getCustomer());
	},

	updateCustomer: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);			
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applyRequestTime: function(config) {
		return Ext.factory(config, Ext.Label, this.getRequestTime());
	},

	updateRequestTime: function(newItem, oldItem) {

		if(newItem) {
			this.add(newItem);
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	}

});