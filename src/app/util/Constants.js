Ext.define('EatSense.util.Constants', {
	alternateClassName: ['appConstants'],
	statics : {
		//check in status
		INTENT : 'INTENT',
		CHECKEDIN : 'CHECKEDIN',
		ORDER_PLACED: 'ORDER_PLACED',
		SERVED: 'SERVED',
		PAYMENT_REQUEST : 'PAYMENT_REQUEST',
		COMPLETE : 'COMPLETE',
		Order : {
			CART : 'CART',
			PLACED : 'PLACED',
			CANCELED : 'CANCELED',
			RECEIVED: 'RECEIVED',
			COMPLETE : 'COMPLETE'			
		},
		Request : {
			CUSTOM : 'CUSTOM',
			CALL_WAITER : 'CALL_WAITER'
		},
		//regular expressions for different currencies
		Currency : {
			EURO: '$1,$2 €',
			US_DOLLAR: '\$ $1.$2'
		},
		//general date format
		DateTimeFormat : {
			'DE' : 'd.m.yy H:i',
			'EN' : 'm/d/yy H:i'
		},
		FORCE_LOGOUT : 'FORCE_LOGOUT'
	}
});

