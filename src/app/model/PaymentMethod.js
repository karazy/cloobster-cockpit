Ext.define('EatSense.model.PaymentMethod', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ 
		{
			name: 'id',
			persist: false
		},
		{
			name : 'name',
			type : 'string'
		},
		{
			name: 'order',
			type: 'number'
		},		
		{
			name: 'business_id',
			persist: false
		}]	
	}
});