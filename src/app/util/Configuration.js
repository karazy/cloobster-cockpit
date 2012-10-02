Ext.define('EatSense.util.Configuration', {
	alternateClassName: ['appConfig'],
	statics: {
		serviceUrl : '',
		msgboxShortHideTimeout: 500,
		msgboxHideTimeout: 1000,
		msgboxHideLongTimeout: 1500,
		currencyFormat: 'EURO',
		version: 0.1,
		//true means caching is disabled
		disableCaching: false,
		language: 'DE',
		channelReconnectTimeout: 15000,
		channelReconnectTries: 20,
		// Interval for channel ping messages.
		channelPingInterval: 120000,
		// Amount of time in ms to wait for a channel message after ping.
		channelMessageTimeout: 30000,
		heartbeatInterval: 10000,
		debug: false,
		eventPrefix: 'cloobster',
		requestTimeCalcRefreshInterval: 60000,
		audioNotificationFile: 'res/sounds/simple.mp3',
		/* Number of times the notification plays. */
		audioNotificationIterations: 5
	}
});
