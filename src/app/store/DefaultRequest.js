Ext.define('EatSense.store.DefaultRequest', {
	extend: 'Ext.data.Store',
	config: {
		model: 'EatSense.model.Request',
		storeId: 'defRequestStore',
		syncRemovedRecords: false,
		sorters: [
		{
			property: 'receivedTime',
			direction: 'DESC'
		}]
	}			
});