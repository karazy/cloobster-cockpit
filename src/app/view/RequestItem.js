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
			hoursPassed,
			minutesPassed,
			// time = new Date(),
			elapsedTimeFormatted,
			dayPassed = false;

		if(newRecord) {

			if(newRecord.get('type') == appConstants.ORDER_PLACED) {
				this.getType().setHtml(i10n.translate('request.item.orderplaced'));
			} else if(newRecord.get('type') == appConstants.PAYMENT_REQUEST) {
				this.getType().setHtml(i10n.translate('request.item.paymentrequest'));
			};

			// time.setTime(newRecord.get('receivedTime'));
			substractedTime = Math.abs(Date.now() - newRecord.get('receivedTime').getTime());
			//convert to minutes
			substractedTime = substractedTime/60000;
			elapsedTimeFormatted = Math.round(substractedTime, 0);
			//more then one hour has passed
			if(elapsedTimeFormatted > 60) {
				hoursPassed =  Math.floor(elapsedTimeFormatted/60);
				minutesPassed = elapsedTimeFormatted - (hoursPassed * 60);
			}
			//more then one day has passed
			if(hoursPassed > 24) {
				dayPassed = true;
			}

			if(dayPassed) {
				this.getRequestTime().setHtml(i10n.translate('request.item.elapsedtime.dd'));	
			} else if(hoursPassed && minutesPassed) {
				this.getRequestTime().setHtml(i10n.translate('request.item.elapsedtime.hhmm', hoursPassed, minutesPassed));	
			} 
			else {
				this.getRequestTime().setHtml(i10n.translate('request.item.elapsedtime.mm', elapsedTimeFormatted));		
			}
			
		}

		this.callParent([newRecord, oldRecord]);
	}

});