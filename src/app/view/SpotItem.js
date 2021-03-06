/**
*	A single spot in spot view.
* 	Displays spot name and number of checkIns.
*/
Ext.define('EatSense.view.SpotItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'spotitem',
	config: {

		spot : {
			tpl: '<div><h2>{name}</h2><p>Check-ins: {checkInCount}</p></div>',
			cls: 'spot-button',
			baseCls: 'spotitem',
			pressedCls: 'spotitem-pressed'
		},

		 cls: 'di-cls',
		 baseCls: 'di-baseCls',		 
	},

	applySpot: function(config) {
		var button = Ext.factory(config, Ext.Button, this.getSpot()),
			status = this.getRecord().get('status'),
			checkInCount = this.getRecord().get('checkInCount');
			//this is a hack because getParent().getRecord() doesn't work flawless
			button.oRec = this.getRecord();
			button.getTpl().overwrite(button.element, this.getRecord().getData());

			if(status == appConstants.ORDER_PLACED  
				|| status == appConstants.PAYMENT_REQUEST){
				button.addCls('spotitem-placed');
				button.removeCls('spotitem-checkedin');
				button.removeCls('spotitem-request');
			}
			else if (status == appConstants.Request.CALL_WAITER) {
				button.addCls('spotitem-request');
				button.removeCls('spotitem-checkedin');
				button.removeCls('spotitem-placed');
			}
			 else if(this.getRecord().get('checkInCount') >  0) {
				button.addCls('spotitem-checkedin');
				button.removeCls('spotitem-request');
				button.removeCls('spotitem-placed');
			}  else {
				button.removeCls('spotitem-checkedin');
				button.removeCls('spotitem-placed');
				button.removeCls('spotitem-request');
			}

		return button;
	},

	updateSpot: function(newSpot, oldSpot) {
		if(newSpot) {
			this.add(newSpot);
		}

		if(oldSpot) {
			this.remove(oldSpot);
		}
	},

	updateRecord: function(newRecord) {
		if(!newRecord) {
			return;
		};
		
		var 	button = this.getSpot(),
				status = newRecord.get('status');

			
			if(this.getSpot()) {
				//this is a hack because getParent().getRecord() doesn't work when view is filtered and neither does itemtap work
				button.oRec = newRecord;					
				if(status == appConstants.ORDER_PLACED  
					|| status == appConstants.PAYMENT_REQUEST){
					button.addCls('spotitem-placed');
					button.removeCls('spotitem-checkedin');
					button.removeCls('spotitem-request');
				}
				else if (status == appConstants.Request.CALL_WAITER) {
					button.addCls('spotitem-request');
					button.removeCls('spotitem-checkedin');
					button.removeCls('spotitem-placed');
				}
				 else if(newRecord.get('checkInCount') >  0) {
					button.addCls('spotitem-checkedin');
					button.removeCls('spotitem-request');
					button.removeCls('spotitem-placed');
				}  else {
					button.removeCls('spotitem-checkedin');
					button.removeCls('spotitem-placed');
					button.removeCls('spotitem-request');
				}
				
				button.getTpl().overwrite(this.getSpot().element, newRecord.getData());
		}
		//this.callParent([newRecord]);	
	}


})