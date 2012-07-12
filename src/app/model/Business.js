/**
* Reprensents a business like a Hotel or Restaurant.
*/
Ext.define('EatSense.model.Business', {
	extend: 'Ext.data.Model', 
		config: {
			fields: [
				{name: 'id'},
				{name: 'name'},
				{name: 'description'},
				{name: 'trash'}
			],
			proxy: {
				type: 'rest',
				enablePagingParams: false,
				url: '/accounts/{pathId}/businesses'
			}
		}	
});