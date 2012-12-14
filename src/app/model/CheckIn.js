Ext.define('EatSense.model.CheckIn', {
	extend : 'Ext.data.Model',
	// requires: ['EatSense.model.PaymentMethod'],
	config : {
		idProperty : 'id',
		fields : [
		{
			name : 'id',
		},
		{
			name : 'nickname',
			type : 'string'
		},
		{
			name : 'status',
			type : 'string'
		},
		{
			name: 'spotId'
		},
		{
			name : 'checkInTime',
			type : 'date',
			dateFormat : 'time',
			//FR 20120704 fix because time gets send in a weird format
			persist: false
		},
		{	//foreign key for checkIn. Don't send to server.
			name: 'request_id',
			persist: false
		}],
		proxy : {
			type : 'rest',
			enablePagingParams: false,
			url : '/b/businesses/{pathId}/checkins/'
		},
		syncRemovedRecords: false
	}
});