Ext.define('EatSense.model.Area', {
	extend: 'Ext.data.Model',
	config: {
		fields: ['id', 'name', 'description', 'active'],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/b/businesses/{pathId}/areas',
	 		reader: {
	 			type: 'json'
	 		}
		}
	}
});