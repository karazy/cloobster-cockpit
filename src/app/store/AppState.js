Ext.define('EatSense.store.AppState', {
	extend : 'Ext.data.Store',
	requires : [ 'EatSense.model.AppState' ],
	config : {
		storeId : 'cockpitStateStore',
		model : 'EatSense.model.AppState',
		proxy : {
			type : 'localstorage',
			id: 'cloobster_cockpit'
		}
	}
});