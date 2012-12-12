/**
*	This controller handles push messages send from the server
*	and fires events when they arrive. Any component interested in those events
* 	can listen.
*/
Ext.define('EatSense.controller.Message', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.util.Channel'],
	config: {
		refs: 
		{
			connectionStatus: 'toolbar[docked=bottom] #connectionStatus'
		},
		control: {
			connectionStatus: {
				tap: 'connectionStatusTapped'
			}
		},
		evtPrefix: 'eatSense',
		interval: null,
		//indicates if polling is active and a refreshAll events get fired 
		pollingActive: false
	},


	/**
	*	Called after receiving a channel message.
	*	
	*	@param rawMessages	
	*		The raw string message(s) which will be parsed as JSON.
	*		This could be a single object or an array.
	*/
	processMessages: function(rawMessages) {
		var 	me = this,
				message = Ext.JSON.decode(rawMessages, true);

		if(Ext.isArray(message)) {
				for(index = 0; index < message.length; index++) {
				if(message[index]) {					
					this.broadcastMessage(message[index]);
				}	
			}
		}
		else if(message) {
			this.broadcastMessage(message);
		}				
	},
	/**
	*	Fires events to notify listeners about a new message.
	*	Naming schmeme: eatSense.messageType
	*   where message type can be something like spot, order ...
	*
	*	The fired event submits two additional parameters
	*	1. action type (e. g. update, new , delete)
	*	2. content - the data
	*   
	*	@param message	
	*		A message consists of 3 fields
	*			type	- a type like spot
	*			action	- an action like update, new ... 
	*			content - the data
	*			silent - true to only process, but don't notify
	*/
	broadcastMessage: function(message) {
		var 	me = this,
				evtPrefix = 'eatSense.',
				model = message.content;						

		if(!message) {
			console.log('no message send');
			return;
		}
		if(message.type == 'channel') {
			console.log('received service message ' + message.action);
			if(message.action == 'connected') {
				appChannel.connectedReceived();
			}
		}
		else {
			console.log('broadcast message type '+message.type+', action '+message.action);

			//fire event based on the message
			me.fireEvent(evtPrefix+message.type.toLowerCase(), message.action, message.content, message);
		}
	},
	/**
	* Requests a new token from server and executes the given callback with new token as parameter.
	* @param successCallback
	*	callback function to invoke on success
	* @param connectionCallback
	*	
	*/
	requestNewToken: function(successCallback, connectionCallback) {
		var me = this,
			account = this.getApplication().getController('Login').getAccount(),
			clientId = account.get('id') + '-' + new Date().getTime(),
			businessId = account.get('businessId');
		
		account.set('clientId', clientId);
		console.log('requestNewToken: clientId ' + clientId);

		Ext.Ajax.request({
		    url: appConfig.serviceUrl+'/b/businesses/'+businessId+'/channels',	    
		    method: 'POST',
		    params: {
		    	'clientId' : clientId
		    },
		    success: function(response){
		       	token = response.responseText;
		       	successCallback(token);	
		       	connectionCallback(response.status);
		    }, 
		    failure: function(response) {
		    	//just log don't show message or force logout!
		    	me.getApplication().handleServerError({
					'error': {
						'status' : response.status,
						'statusText': response.statusText
					}, 
					'forceLogout': false, 
					'hideMessage':true, 
				});
				connectionCallback(response.status);
		    }
		});
	},
	/**
	* 	Let the server know we are still there.
	*/
	checkOnline: function(disconnectCallback, connectedCallback) {
		var account = this.getApplication().getController('Login').getAccount(),
			clientId = account.get('clientId'),
			me = this;
		
		console.log('checkOnline: clientId ' + clientId);
		Ext.Ajax.request({
		    url: appConfig.serviceUrl+'/accounts/channels',		    
		    method: 'GET',
		    params: {
		    	'businessId' :  account.get('businessId'),
		    	'clientId' : clientId
		    },
		    success: function(response) {
		       	console.log('online check request result: ' + response.responseText);
		       	if(response.responseText == 'DISCONNECTED') {
		       		disconnectCallback();
		       	}
		       	else if(response.responseText == 'CONNECTED') {
		       		if(connectedCallback) {
		       			connectedCallback();
		       		}
		       	}
		    }, 
		    failure: function(response) {
		    	if(appChannel.connectionStatus != 'CONNECTION_LOST') {
		    		appChannel.setStatusHelper('CONNECTION_LOST');
		    		appChannel.stopOnlinePing();
		    		appChannel.clearMessageTimeout();
		    		appChannel.startOnlineCheck();
		    		me.handleStatus({
		    			'status' : appChannel.connectionStatus, 
		    			'prevStatus': appChannel.previousStatus
		    		});
		    	}
		    	console.log('online check request failed with code: ' + response.status);

		    	me.getApplication().handleServerError({
					'error': {
						'status' : response.status,
						'statusText': response.statusText
					}, 
					'forceLogout': {403 : true}, 
					//hide message, because a notification is shown
					'hideMessage': {0 : true}
				});
		    }
		});
	},
	/**
	* 	Requests a token and
	*	opens a channel for server side push messages.
	*
	*/
	openChannel: function() {
		var		me = this;

		appChannel.setup({
			messageHandler: me.processMessages,
			requestTokenHandler: me.requestNewToken,
			statusHandler: me.handleStatus,
			checkOnlineHandler: me.checkOnline,
			executionScope: me
		});
	},
	/**
	* When push communication fails this method acts like a heartbeat for the application.
	* It will fire a refreshAll event in a configured intervall. Every component that needs
	* current data can listen to this event and refresh its view.
	*/
	refreshAll: function(start) {
		var me = this,
			heartbeatInterval = appConfig.heartbeatInterval || 10000,
			interval;

		if(start === true && !me.getPollingActive()) {
			console.log('refreshAll: start polling');
			interval = window.setInterval(function() {
				console.log('fire refresh all event');
				me.fireEvent(me.getEvtPrefix()+'.refresh-all');
			},heartbeatInterval);
			me.setInterval(interval);
			me.setPollingActive(true);
		} else if(start === false && me.getPollingActive()) {
			console.log('refreshAll: stop polling');
			window.clearInterval(me.getInterval());
			me.setInterval(null);
			me.setPollingActive(false);
		}
	},
	/**
	*	Called when the connection status changes.
	*
	*/
	handleStatus: function(opts) {
		var statusLabel = this.getConnectionStatus(),
		connectionStatus = opts.status,
		previousStatus = opts.prevStatus,
		reconnectIteration = opts.reconnectIteration,
		stop = opts.stopAll || false;

		//render status in UI
		console.log('handleStatus: status changed from '+previousStatus+' to '+connectionStatus+' ('+reconnectIteration+' call).');
		if(statusLabel) {
			//no statuslabel exists in login mask. To prevent erros check if label exists.
			// statusLabel.getTpl().overwrite(statusLabel.element, [connectionStatus]);
			statusLabel.setLabelCls('status-indicator-'+connectionStatus);
		}		

		if((previousStatus != 'INITIALIZING') && connectionStatus == 'ONLINE') {
			console.log('handleStatus: back online ... refresh all data');
			this.fireEvent(this.getEvtPrefix()+'.refresh-all');
			this.refreshAll(false);
		} else if((!stop && reconnectIteration && reconnectIteration > 5) && (connectionStatus == 'DISCONNECTED' || connectionStatus == 'RECONNECT')) {
			this.refreshAll(true);
		}

		if((previousStatus == 'ONLINE') && connectionStatus == 'CONNECTION_LOST') {
			this.showConnectivityHint(i10n.translate('errorCommunication'));
		}

		if(stop) {
			this.refreshAll(false);
		}
	},
	/**
	* Show a message when connectivity problems occur.
	*/
	showConnectivityHint: function(message) {
		var me =this,
			msgBox = Ext.create('Ext.MessageBox', {
			// hideOnMaskTap: true,
			modal: false,
			'message' : message,
			buttons: [],
			bottom: '5%',
			right: '3%'
		});

		// msgBox.showBy(this.getActivateSoundButton(), "tl-tr?");
		msgBox.show();

		//make popup to disappear on viewport tap
		Ext.Viewport.element.on('tap', hideActivationHint, this, {
			single: true,
			delay: 200
		});

		function hideActivationHint() {
			msgBox.hide(true);
		};
	},	
	/**
	* Eventhandler for connection status button in bottom toolbar.
	*/
	connectionStatusTapped: function(button) {
		//logic for manual reconnect goes here.
		//only react if connection is in status DISCONNECTED, or CONNECTION_LOST
		if(appChannel.connectionStatus == 'DISCONNECTED' || appChannel.connectionStatus == 'CONNECTION_LOST') {
			appChannel.closeChannel();
			this.openChannel();
		}
	}
});