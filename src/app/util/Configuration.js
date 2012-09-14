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
		channelReconnectTimeout: 20000,
		channelReconnectTries: 20,
		// Interval for channel ping messages.
		channelPingInterval: 31000,
		// Amount of time in ms to wait for a channel message after ping.
		channelMessageTimeout: 30000,
		heartbeatInterval: 10000,
		debug: true,
		eventPrefix: 'cloobster',
		requestTimeCalcRefreshInterval: 60000
	}
});