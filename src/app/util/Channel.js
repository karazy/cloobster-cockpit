Ext.define('EatSense.util.Channel', {	
	alternateClassName: ['appChannel'],
	requires: ['EatSense.util.Configuration', 'EatSense.util.Helper'],
	singleton: true,


	//holds a reference to the channel
	channel : null,	
	//socket used for communication
	socket : null,
	//function called when a message is received
	messageHandlerFunction : null,
	//function called to request a new token when an error occurs or channel is closed
	requestTokenHandlerFunction : null,
	//called whenever connection status changes
	statusHandlerFunction : null,
	//scope in which to execute handler functions function
	executionScope : null,
	//indicates if the client forced a close and won't try to request a new token.
	timedOut : false,
	//indicates if connection was lost or none existed
	connectionLost : true,
	//token used for this channel
	channelToken : null,
	//timeout used when attempting to reconnect the channel
	channelReconnectTimeout : appConfig.channelReconnectTimeout ||  20000,
	//a factor by which the intervall for requesting a new token increases over time to prevent mass channel creations
	channelReconnectFactor : 1.3,
	//the status for the connection
	connectionStatus : 'INITIALIZING',
	//previous connection status
	previousStatus : 'NONE',
	//online check interval object
	interval : null,
	//ping interval object
	pingInterval : null,
	//timeout 
	messageTimeout: null,
	//true when the listener for window event pageshow has been connected
	pageshowListenerRegistered : null,

	self : null,

	constructor: function() {
		console.log('Channel constructor');
		this.self = this;

	},

	onOpen: function() {
		var me = this,
			intervalLength = appConfig.channelPingInterval || 31000;
		
		if(this.connectionStatus == 'ONLINE') {
			console.log('Channel.onOpen: still online');
			return;
		}

		console.log('Channel.onOpen: channel opened');
		this.connectionLost = false;	
		this.timedOut = false;		
		this.channelReconnectTimeout = appConfig.channelReconnectTimeout;

		this.setStatusHelper('ONLINE', true);
		
		if(!this.pingInterval) {
			// Start online ping, with configured interval.
			console.log('Channel.onOpen: start online ping every (ms) ' + intervalLength);
			this.pingInterval = window.setInterval(function() {
				me.repeatedOnlinePing();
			} , intervalLength);
		}
		this.clearMessageTimeout();
		this.stopOnlineCheck();
		this.stopConnectionTry();
		
		/*		
		 This is mainly for mobile devices when going into standby. 
		 It is not possible in a webapp to be notified when standy is entered.
		 However we can listen to the pageshow event which gets called when the window gets resumed. 
		 http://stackoverflow.com/questions/4401764/what-event-fires-when-a-webkit-webapp-is-terminated
		*/
		if(!this.pageshowListenerRegistered) {
			this.pageshowListenerRegistered = true;
			window.addEventListener("pageshow", function(){			
				me.setStatusHelper('RECONNECT', true);
				console.log('online check');
				// repeatedOnlineCheck();
				me.checkOnlineFunction.apply(this.executionScope, [function() {
					me.setStatusHelper('TIMEOUT', true);

					me.closeSocket();
				}]);
			}, false);
		}
	},

	onMessage: function(data) {
		console.log('Channel.onMessage: message received');
		this.messageHandlerFunction.apply(this.executionScope, [data.data]);
	},
	onError: function(error) {
		var errorDesc = (error && error.description) ? error.description : "",
			me = this;

		console.log('channel error: ' + errorDesc);

		if(error && ( error.code == '401' || error.code == '400') ) {
			console.log('Channel.onError: reason TIMEOUT, code: ' + error.code);
			this.setStatusHelper('TIMEOUT');
			this.statusHandlerFunction.apply(this.executionScope, [{
				'status' : this.connectionStatus, 
				'prevStatus': this.previousStatus
			}]);
			this.socket.close();
			
		} else if (this.connectionStatus != 'CONNECTION_LOST' && error && (error.code == '-1' || error.code == '0')) {
			console.log('Channel.onError: reason CONNECTION_LOST');
			this.setStatusHelper('CONNECTION_LOST', true);
			this.stopOnlinePing();
			this.clearMessageTimeout();
			this.startOnlineCheck();
		}
	},
	onClose: function() {
		console.log("Channel.onClose");
		if(!appHelper.isFunction(this.requestTokenHandlerFunction)) {
			console.log('Channel.onClose: requestTokenHandlerFunction is not of type function!');
			return;
		};

		if(this.connectionStatus == 'RECONNECT') {
			console.log("Channel.onClose: already reconnecting, returning.")
			return;
		}

		
		if(this.connectionStatus == 'TIMEOUT') {
			console.log('Channel.onClose: reason TIMEOUT');
			this.setStatusHelper('RECONNECT');
			this.repeatedConnectionTry();
		} else if(this.connectionStatus == 'CONNECTION_LOST') {
			console.log('Channel.onClose: reason CONNECTION_LOST');
			this.setStatusHelper('RECONNECT');
			this.repeatedConnectionTry();
		} else if(this.connectionStatus == 'DISCONNECTED'){
			console.log('Channel.onClose: reason DISCONNECTED');
			this.statusHandlerFunction.apply(this.executionScope, [{
				'status' : this.connectionStatus, 
				'prevStatus': this.previousStatus
			}]);
		}
	},
	startOnlineCheck: function() {
		var me = this;
		if(!this.interval) {
			console.log('Channel.startOnlineCheck: check every 5s');
			this.interval = window.setInterval(function() {
				me.repeatedOnlineCheck(); 
			}, 5000);
		}
	},
	stopOnlineCheck: function() {
		if(this.interval) {
			console.log('Channel.stopOnlineCheck: Stopping check every 5s');
			window.clearInterval(this.interval);
			this.interval = null;
		}
	},
	repeatedOnlineCheck: function() {
		var me = this;
		if(this.connectionStatus == 'ONLINE' || this.connectionStatus == 'DISCONNECTED') {
			console.log('Channel.repeatedOnlineCheck: Channel online or closed by user.')
			me.stopOnlineCheck();
		}
		if(this.connectionStatus == 'CONNECTION_LOST') {
			this.checkOnlineFunction.apply(this.executionScope, [
				function() {
					// disconnect function. Called after checking with the server if the channel disconnected.
					me.stopOnlineCheck();
					if(this.connectionStatus != 'RECONNECT') {
						me.setStatusHelper('TIMEOUT', true);
						me.closeSocket();
					}
				},
				function() {
					// connected function.
					me.stopOnlineCheck();
					me.startMessageTimeout();
				}
			]);
		}
	},
	repeatedOnlinePing: function() {	
		var me = this;
		if(this.connectionStatus == 'DISCONNECTED') {
			console.log('Channel.repeatedOnlinePing: Channel closed by user.');
			this.stopOnlinePing();
			return;
		}
		else {
			this.startMessageTimeout();
			this.checkOnlineFunction.apply(this.executionScope, [
 				function() {
 					// DISCONNECTED response from server. Channel was disconnected but script did not react.
 					// close socket and set status accordingly.
 					me.stopOnlinePing();
 					me.clearMessageTimeout();

 					if(this.connectionStatus != 'RECONNECT' || this.connectionStatus != 'CONNECTION_LOST') {
 						me.setStatusHelper('TIMEOUT');
 						me.closeSocket();
 					}
 				},
 				function() {
 					// CONNECTED response from server. Channel should still be operational.
 				}
 			]);
		}
	},
	stopOnlinePing: function() {
		if(this.pingInterval) {
			console.log('Stopping online ping.');
			window.clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
	},
	startMessageTimeout: function() {
		var me = this;
		if(!me.messageTimeout) {
			console.log('Channel.startMessageTimeout: Waiting for message (ms)' + (appConfig.channelMessageTimeout || 30000));
			me.messageTimeout = window.setTimeout(function() {
				me.messageTimedOut();
			}, appConfig.channelMessageTimeout || 30000);						
		}
	},
	clearMessageTimeout: function() {
		if(this.messageTimeout) {
			console.log('Channel.clearMessageTimeout');
			window.clearTimeout(this.messageTimeout);
			this.messageTimeout = null;
		}
	},
	messageTimedOut: function() {
		// Called after 30s if we did not receive a channel message from the server.
		console.log("Channel.messageTimedOut: No message received after timeout.");
		this.messageTimeout = null;

		if(this.connectionStatus != 'RECONNECT') {
			this.setStatusHelper('TIMEOUT', true);
			this.closeSocket();
		}
	},
	/**
	*	Repeatedly tries to reopen a channel after it has been close.
	*
	*/
	repeatedConnectionTry: function() {
		var me = this;

		console.log('Channel.repeatedConnectionTry: Trying to request new token and open socket.');

		var tries = 0;
		var connect = function() {
			if(me.connectionStatus == 'ONLINE' || me.connectionStatus == 'DISCONNECTED') {
				console.log('Channel.repeatedConnectionTry: Stopping connection tries. Channel online or closed by logout.')
				return;
			}

			if(tries > appConfig.channelReconnectTries) {
				console.log('Channel.repeatedConnectionTry: Maximum tries reached. No more connection attempts.');
				me.setStatusHelper('DISCONNECTED', true);
				return;
			}

			me.statusHandlerFunction.apply(me.executionScope, [{
				'status' : me.connectionStatus, 
				'prevStatus': me.previousStatus,
				'reconnectIteration' : tries
			}]);

			console.log('Channel.repeatedConnectionTry: try ' + tries);
			tries += 1;
			me.channelReconnectTimeout = (me.channelReconnectTimeout > 300000) ? me.channelReconnectTimeout : me.channelReconnectTimeout * me.channelReconnectFactor;
			// setupChannel(channelToken);
			
			me.requestTokenHandlerFunction.apply(me.executionScope, [function(token) {me.setupChannel(token)}, function(status) {
				if(status == 0) {
					console.log('Channel.repeatedConnectionTry: Status 0 received, no connection to server.');
					me.setStatusHelper('CONNECTION_LOST',true);
					me.startOnlineCheck();
				}
				else {
					console.log('Channel.repeatedConnectionTry: Next try in '+me.channelReconnectTimeout);
					me.connectionTryTimeout = window.setTimeout(connect, me.channelReconnectTimeout);
				}
			}]);
		};
		connect();
	},
	stopConnectionTry: function() {
		if(this.connectionTryTimeout) {
			console.log("Channel.stopConnectionTry");
			window.clearTimeout(this.connectionTryTimeout);
			this.connectionTryTimeout = null;
		}
	},
	setStatusHelper: function(newStatus, broadcast) {
		this.previousStatus = this.connectionStatus;
		this.connectionStatus = newStatus;
		if(broadcast === true && appHelper.isFunction(this.statusHandlerFunction)) {
			this.statusHandlerFunction.apply(this.executionScope, [{
				'status' : this.connectionStatus, 
				'prevStatus': this.previousStatus
			}]);
		}
		else {
			console.log("Channel.setStatusHelper: Status changed from "+this.previousStatus + " to " + this.connectionStatus);
		}
	},
	closeSocket: function() {
		if(this.socket) {
			console.log("Channel.closeSocket: closing");
			this.socket.close();
			this.socket = null;
		}
		this.onClose();
	},
	/**
	* Creates the channel and set the handler.
	* @param token
	*	Token for channel generation
	*/
	setupChannel: function(token) {
		var me = this;

		if(!token) {
			return;
		}

		this.closeSocket();
		
		var handler = new Object();
		handler.onopen =  function() {
			me.onOpen();
		};

		handler.onmessage = function(data) {me.onMessage(data)};
		handler.onerror = function(error) {me.onError(error)};
		handler.onclose = function() {me.onClose()};

		console.log('Channel.setupChannel: token ' + token);

		this.channelToken = token;
		try {
			this.channel = new goog.appengine.Channel(token);	
		} catch(e) {
			console.log('setupChannel: failed to open channel! reason '+ e);
			return;
		}
		
		this.socket = this.channel.open(handler);
	},

	/**
	* Setup channel comunication and try to establish a connection.
	* @param options
	*/
	setup: function(options) {
		console.log('Channel.setup: init channel');

		if(!appHelper.isFunction(options.messageHandler)) {
			throw "No messageHandler provided";
		};

		this.messageHandlerFunction = options.messageHandler;

		if(!appHelper.isFunction(options.requestTokenHandler)) {
			throw "No requestTokenHandler provided";
		};

		this.requestTokenHandlerFunction = options.requestTokenHandler;

		if(!appHelper.isFunction(options.statusHandler)) {
			throw "No statusHandler provided";
		};

		this.statusHandlerFunction = options.statusHandler;

		if(!appHelper.isFunction(options.checkOnlineHandler)) {
			throw "No checkOnlineHandler provided";
		};

		this.checkOnlineFunction = options.checkOnlineHandler;
		

		(options.executionScope) ? this.executionScope = options.executionScope : this;

		this.connectionStatus = 'INITIALIZING';
		this.repeatedConnectionTry();

	},
	connectedReceived: function () {
		this.clearMessageTimeout();
		this.onOpen();
	},
	/**
	* Closes the cannel and prevents a new token request.
	*/
	closeChannel: function() {
		this.channelToken = null;
		
		this.stopOnlinePing();
		this.stopOnlineCheck();
		this.stopConnectionTry();
		this.clearMessageTimeout();

		console.log('Channel.closeChannel: normal channel closing');
		this.setStatusHelper('DISCONNECTED');
		this.closeSocket();
	}
});
