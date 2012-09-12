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
	channelReconnectTimeout : appConfig.channelReconnectTimeout ||  10000,
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
		var me = this;
		
		if(this.connectionStatus == 'ONLINE') {
			console.log('onOpen: Channel still online.');
			return;
		}
		console.log('channel opened');
		this.connectionLost = false;	
		this.timedOut = false;		
		this.channelReconnectTimeout = appConfig.channelReconnectTimeout;

		this.setStatusHelper('ONLINE');
		this.statusHandlerFunction.apply(this.executionScope, [{
			'status' : this.connectionStatus, 
			'prevStatus': this.previousStatus
		}]);
		
		if(!this.pingInterval) {
			// Set online ping to 30s for tests.
			this.pingInterval = window.setInterval(function() {
				me.repeatedOnlinePing();
			} , appConfig.channelPingInterval);
		}
		
		/*		
		 This is mainly for mobile devices when going into standby. 
		 It is not possible in a webapp to be notified when standy is entered.
		 However we can listen to the pageshow event which gets called when the window gets resumed. 
		 http://stackoverflow.com/questions/4401764/what-event-fires-when-a-webkit-webapp-is-terminated
		*/
		if(!this.pageshowListenerRegistered) {
			this.pageshowListenerRegistered = true;
			window.addEventListener("pageshow", function(){			
				me.setStatusHelper('RECONNECT');
				me.statusHandlerFunction.apply(this.executionScope, [{
					'status' : this.connectionStatus, 
					'prevStatus': this.previousStatus
				}]);
				console.log('online check');
				// repeatedOnlineCheck();
				me.checkOnlineFunction.apply(this.executionScope, [function() {
					me.setStatusHelper('TIMEOUT');
					me.statusHandlerFunction.apply(me.executionScope, [{
						'status' : me.connectionStatus, 
						'prevStatus': me.previousStatus
					}]);
					me.timedOut = true;
					me.socket.close();
				}]);
			}, false);
		}
	},

	onMessage: function(data) {
		console.log('channel message received');
		this.messageHandlerFunction.apply(this.executionScope, [data.data]);
	},

	onError: function(error) {
		var errorDesc = (error && error.description) ? error.description : "",
			me = this;

		console.log('channel error: ' + errorDesc);

		if(error && ( error.code == '401' || error.code == '400') ) {
			console.log('onError: reason TIMEOUT, code: ' + error.code);
			this.timedOut = true;
			this.setStatusHelper('TIMEOUT');
			this.statusHandlerFunction.apply(this.executionScope, [{
				'status' : this.connectionStatus, 
				'prevStatus': this.previousStatus
			}]);
			this.socket.close();
			
		} else if (!this.connectionLost && error && (error.code == '-1' || error.code == '0')) {
			console.log('onError: reason CONNECTION_LOST');
			this.connectionLost = true;
			this.setStatusHelper('CONNECTION_LOST');
			this.statusHandlerFunction.apply(this.executionScope, [{
				'status' : this.connectionStatus, 
				'prevStatus': this.previousStatus
			}]);
			console.log('start online check interval every 5s');
			this.interval = window.setInterval(function() {
						me.repeatedOnlineCheck(); 
					}, 5000);
		}
	},

	onClose: function() {
		if(!appHelper.isFunction(this.requestTokenHandlerFunction)) {
			console.log('requestTokenHandlerFunction is not of type function!');
			return;
		};

		if(this.timedOut === true && this.connectionStatus == 'TIMEOUT') {
			console.log('onClose: reason TIMEOUT');
			this.setStatusHelper('RECONNECT');
			this.repeatedConnectionTry();
		} else if(this.connectionLost === true && this.connectionStatus == 'CONNECTION_LOST') {
			console.log('onClose: reason CONNECTION_LOST');
			this.setStatusHelper('RECONNECT');
			this.repeatedConnectionTry();
		} else if(this.connectionStatus == 'DISCONNECTED'){
			console.log('onClose: reason DISCONNECTED');
			this.statusHandlerFunction.apply(this.executionScope, [{
				'status' : this.connectionStatus, 
				'prevStatus': this.previousStatus
			}]);
		}
	},
	repeatedOnlineCheck: function() {
		var me = this;
		if(this.connectionStatus == 'ONLINE' || this.connectionStatus == 'DISCONNECTED') {
			if(this.interval) {
				console.log('Stopping fast online check (every 5s).');
				window.clearInterval(this.interval);
			}
		}
		if(this.connectionStatus == 'CONNECTION_LOST') {
			this.checkOnlineFunction.apply(this.executionScope, [
				function() {
					// disconnect function. Called after checking with the server if the channel disconnected.
					if(me.interval) {
						window.clearInterval(me.interval);	
					}
					me.timedOut = true;
					me.setStatusHelper('TIMEOUT');
					me.socket.close();
					me.socket = null;
				}
			]);
		}
	},
	repeatedOnlinePing: function() {
		var me = this;
		if(this.connectionStatus == 'DISCONNECTED') {
			this.stopOnlinePing();
			return;
		}
		else {
			this.checkOnlineFunction.apply(this.executionScope, [
 				function() {
 					// DISCONNECTED response from server. Channel was disconnected but script did not react.
 					// close socket and set status accordingly.
 					me.stopOnlinePing();
 					me.timedOut = true;
 					me.setStatusHelper('TIMEOUT');
 					me.socket.close();
 				},
 				function() {
 					// CONNECTED response from server. Channel should still be operational. Wait 30s for channel message.
 					me.messageTimeout = window.setTimeout(function() {
 						me.messageTimedOut();
 					}, appConfig.channelMessageTimeout);
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
	messageTimedOut: function() {
		// Called after 30s if we did not receive a channel message from the server.
		this.messageTimeout = null;
		this.timedOut = true;
		this.setStatusHelper('TIMEOUT');
		this.socket.close();
	},
	/**
	*	Repeatedly tries to reopen a channel after it has been close.
	*
	*/
	repeatedConnectionTry: function() {
		var me = this;

		if(!this.connectionLost && !this.timedOut) {
			return;
		}

		console.log('Trying to connect and request new token.');

		var tries = 0;
		var connect = function() {
			if(me.connectionStatus == 'ONLINE' || me.connectionStatus == 'DISCONNECTED') {
				return;
			}

			if(tries > appConfig.channelReconnectTries) {
				console.log('Maximum tries reached. No more connection attempts.');
				me.setStatusHelper('DISCONNECTED');	
				if(appHelper.isFunction(this.statusHandlerFunction)) {
					me.statusHandlerFunction.apply(me.executionScope, [{
						'status' : me.connectionStatus, 
						'prevStatus': me.previousStatus
					}]);
				}
				return;
			}

			me.statusHandlerFunction.apply(me.executionScope, [{
				'status' : me.connectionStatus, 
				'prevStatus': me.previousStatus,
				'reconnectIteration' : tries
			}]);

			console.log('repeatedConnectionTry: iteration ' + tries);
			tries += 1;
			me.channelReconnectTimeout = (me.channelReconnectTimeout > 300000) ? me.channelReconnectTimeout : me.channelReconnectTimeout * me.channelReconnectFactor;
			// setupChannel(channelToken);
			
			me.requestTokenHandlerFunction.apply(me.executionScope, [function(token) {me.setupChannel(token)}, function() {
				console.log('repeatedConnectionTry: Next reconnect try in '+me.channelReconnectTimeout);					
				window.setTimeout(connect, me.channelReconnectTimeout);
			}]);
		};
		connect();
	},
	setStatusHelper: function(newStatus) {
		this.previousStatus = this.connectionStatus;
		this.connectionStatus = newStatus;
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
		
		var handler = new Object();
		handler.onopen =  function() {
			me.onOpen();
		};

		handler.onmessage = function(data) {me.onMessage(data)};
		handler.onerror = function(error) {me.onError(error)};
		handler.onclose = function() {me.onClose()};

		console.log('setupChannel: token ' + token);

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
			console.log('setup channel communication');

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
			this.connectionLost = true;
			this.connectionStatus = 'INITIALIZING';
			this.repeatedConnectionTry();

		},
		connectedReceived: function () {
			if(this.messageTimeout) {
				// Channel message received. Clear the timeout
				window.clearTimeout(this.messageTimeout);
				this.messageTimeout = null;
			}
			this.onOpen();
		},
		/**
		* Closes the cannel and prevents a new token request.
		*/
		closeChannel: function() {
			this.timedOut = false;
			this.connectionLost = false;	
			this.channelToken = null;
			
			this.stopOnlinePing();
			
			console.log('normal channel closing');
			this.setStatusHelper('DISCONNECTED');
			this.socket.close();
			this.socket = null;
		}	
});