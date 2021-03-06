Ext.define('EatSense.model.History', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'checkInId',
		fields: [
			{ name: 'billId'}, 
			{ 
				name: 'billTime',
				type : 'date',
				dateFormat : 'time'
			}, 
			{ name: 'billTotal'}, 
			{ name: 'paymentMethod'}, 
			{ name: 'checkInTime'}, 
			{ name: 'checkInId'}, 
			{ name: 'nickname'}, 
			{ name: 'spotId'}, 
			{ name: 'areaId'}, 
			{ name: 'spotName'}
		],
		proxy: {
			type: 'rest',
			url: '/b/businesses/{pathId}/checkins/history',
			enablePagingParams: true
		}
	}
});