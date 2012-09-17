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
		{	//only used locally
			name: 'businessId',
			persist: false
		},	
		//TODO maybe store an association?
		{	//only used locally
			name: 'business',
			persist: false
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