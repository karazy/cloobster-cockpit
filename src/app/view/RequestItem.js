/**
*	Represents a single request item for list view.
*/
Ext.define('EatSense.view.RequestItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'requestitem',
	config: {

		spot : {
			margin: '0 5 0 0',
			cls: 'requestitem-spot'
		},

		customer: {
			margin: '0 5 0 0',
			cls: 'requestitem-customer'
		},

		type : {
			margin: '0 5 0 0',
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
			// getType: {
			// 	setHtml: 'type'
			// },
			// getRequestTime : {
			// 	setHtml: 'receivedTime'
			// }
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

	applyType: function(config) {
		return Ext.factory(config, Ext.Label, this.getType());
	},

	updateType: function(newItem, oldItem) {
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
	},

	/**
	*	Overrides the private updateRecord method. Does some special actions
	*	which could not be done in dataMap.
	*
	*/
	updateRecord: function(newRecord, oldRecord) {
		var passedTime = "",
			substractedTime,
			time = new Date(),
			elapsedTimeFormatted;

		if(newRecord) {

			if(newRecord.get('type') == appConstants.ORDER_PLACED) {
				this.getType().setHtml(i10n.translate('request.item.orderplaced'));
			} else if(newRecord.get('type') == appConstants.PAYMENT_REQUEST) {
				this.getType().setHtml(i10n.translate('request.item.paymentrequest'));
			};

			time.setTime(newRecord.get('receivedTime'));
			substractedTime = Math.abs(Date.now() - time);
			//convert to minutes
			substractedTime = substractedTime/60000;
			elapsedTimeFormatted = Math.round(substractedTime, 0);
			elapsedTimeFormatted += "";
			this.getRequestTime().setHtml(i10n.translate('request.item.elapsedtime', elapsedTimeFormatted));	
		}

		this.callParent([newRecord, oldRecord]);
	}

});