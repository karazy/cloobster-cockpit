Ext.define('EatSense.util.Configuration', {
	alternateClassName: ['appConfig'],
	statics: {
		serviceUrl : '',
		msgboxHideTimeout: 1000,
		msgboxHideLongTimeout: 1500,
		currencyFormat: 'EURO',
		version: 0.1,
		//true means caching is disabled
		disableCaching: false,
		language: 'DE',
		channelReconnectTimeout: 10000,
		channelReconnectTries: 20,
		heartbeatInterval: 10000,
		debug: true,
		eventPrefix: 'cloobster'
	}
})