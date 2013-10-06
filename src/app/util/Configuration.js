Ext.define('EatSense.util.Configuration', {
	alternateClassName: ['appConfig'],
	statics: {
		serviceUrl : '',
		msgboxShortHideTimeout: 500,
		msgboxHideTimeout: 1000,
		msgboxHideLongTimeout: 1500,
		//default currency
		currencyDefaultFormat: 'EUR',
		//default format is EUR, can be changed during runtime depending on business
		currencyFormat: 'EUR',
		version: 'v2.1-6-g4f36197',
		//true means caching is disabled
		disableCaching: false,
		//if language is configured it will be used. otherwise system language
		// language: 'EN',
		channelReconnectTimeout: 15000,
		channelReconnectTries: 20,
		// Interval for channel ping messages.
		channelPingInterval: 240000,
		// Amount of time in ms to wait for a channel message after ping.
		channelMessageTimeout: 30000,
		heartbeatInterval: 10000,
		debug: false,
		eventPrefix: 'cloobster',
		requestTimeCalcRefreshInterval: 60000,
		audioNotificationFile: 'res/sounds/simple.mp3',
		/* Number of times the notification plays. */
		audioNotificationIterations: 5,
		//version indicator of the backend api, will be increased when the api changes
		//in such a way that an old cloobster version is not compatible anymore
		cloobsterApi: 2
	}
});