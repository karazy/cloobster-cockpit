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
				{name: 'trash'},
				{name: 'currency'}
			],
			associations: [
			{
	            type: 'hasMany',
	            model: 'EatSense.model.PaymentMethod',
	            primaryKey: 'id',
	            name: 'payments',
	            //autoLoad: true,
	            associationKey: 'paymentMethods', // read child data from child_groups
	            store: {
	            	sorters: [
						{
							property: 'order',
							direction: 'ASC'
						}
	            	]
	            }
	        }],
			proxy: {
				type: 'rest',
				enablePagingParams: false,
				url: '/b/businesses/'
			}
		}	
});