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
			EUR: '$1,$2 €',
			USD: '\$ $1.$2'
		},
		//general date format
		DateTimeFormat : {
			'DE' : 'd.m.Y H:i',
			'EN' : 'm/d/Y H:i'
		},
		//general date format
		DateFormat : {
			'DE' : 'd.m.Y',
			'EN' : 'm/d/Y'
		},
		FORCE_LOGOUT : 'FORCE_LOGOUT'
	}
});

