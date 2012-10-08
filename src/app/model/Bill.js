/**
 * A bill.
 */
Ext.define('EatSense.model.Bill', {
	extend : 'Ext.data.Model',
	config : {
		idProperty : 'id',
		fields : [ {
			name : 'id'
		}, {
			name : 'billnumber',
			type : 'string'
		}, 
		{
			name : 'paymentMethod',
			type : 'string'
		}, 
		{
			name : 'total',
			type : 'number',
			defaultValue: 0
		}, {
			name : 'time',
			type : 'date',
			dateFormat : 'time',
			//FR 20120704 fix because time gets send in a weird format
			persist: false
		}, {
			name: 'cleared',
			type: 'boolean'
		}, 
		{
			name: 'checkInId'
		}
		],
		associations: [{
            type: 'hasOne',
            model: 'EatSense.model.PaymentMethod',
            // primaryKey: 'id',
            // associatedName: 'paymentMethod'
		 }],
		proxy: {
	 		type: 'rest',
	 		enablePagingParams: false,
	 		url : '/b/businesses/{pathId}/bills',
	 		reader: {
	 			type: 'json'
	 		},
	 		// writer: new EatSense.override.CustomJsonWriter({
	   // 			type: 'json',
	   // 			writeAllFields: true
	   // 		})
	 	}
	}
});