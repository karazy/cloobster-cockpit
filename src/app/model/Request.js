/**
*	Used for incoming request like a customer calling a waiter.
*	Those request normaly have a short lifespan and will be deleted after
*	being processed.
*/
Ext.define('EatSense.model.Request', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'id',
		fields: [
		{
			name: 'id'
		},
		{
			name: 'type'
		},
		{
			name: 'checkInId'
		},
		{
			name: 'spotId'
		},
		{
			name: 'spotName'
		},
		{
			name: 'checkInName'
		},
		{
			name: 'areaId'
		},
		{
			name: 'receivedTime',
			// type: 'time'
			type : 'date',
			dateFormat: 'time',
		}	
		],
		associations : {
			type : 'hasOne',
			model : 'EatSense.model.CheckIn',
		},
		proxy: {
			type: 'rest',
			enablePagingParams: false,
			url: '/b/businesses/{pathId}/requests'
		}
	}
});