Ext.define('EatSense.store.History', {
	extend: 'Ext.data.Store',
	config: {
		model: 'EatSense.model.History',
		storeId: 'historyStore',
		syncRemovedRecords: false,
		pageSize: 15,
		remoteFilter: true
	}
});