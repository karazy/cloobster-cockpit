/**
 * Contains all information to restore application state.
 * 
 */
Ext.define('EatSense.model.AppState', {
	extend : 'Ext.data.Model',
	config : 
		{
		fields : [
			{
				name : 'id'
			},
			{
				name : 'accessToken',
				type : 'string'
			}, 
			{
				name : 'businessId',
				type : 'string'
			}
		]
	}
});