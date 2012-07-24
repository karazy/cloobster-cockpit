Ext.define('EatSense.model.Account', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
		{
			name: 'login'
		}, 
		{
			name: 'email'
		},
		{
			name: 'accessToken'
		},
		{
			name: 'role'
		}, 
		{
			name: 'businessId'
		},	
		//TODO maybe store an association?
		{
			name: 'business'
		},
		{	//channel token
			name: 'token'
		}
		],
		proxy : {
			type : 'rest',
			enablePagingParams: false,
			url : '/accounts/',
			reader : {
				type : 'json',
			}
		}
	}
});