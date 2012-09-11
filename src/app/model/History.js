Ext.define('EatSense.model.History', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'billId'}, 
			{ name: 'billTime'}, 
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
			url: '/b/businesses/{pathId}/checkins/history'
		}
	}
});