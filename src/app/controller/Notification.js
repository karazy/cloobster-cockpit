/**
* Controls audio notifications.
*
*/
Ext.define('EatSense.controller.Notification', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		refs: {
			mainview: 'main',
			activateSoundButton: 'main button[action=activate-sound]'
		},
		control: {
			activateSoundButton: {
				tap: 'toggleNotificationSound'
			}
		},
		/* html5 audio element */
		notificationSound : null,
		/* */
		soundInterval: null,
		/* Indicates if a notification is active */
		notificationActive: false,
		/* Indicates that user activated notification sound once. */
		userInit: false,
		/* Counts played alarms when alarm is active. */
		playCounter: 0,
		/* Contains manually completed checkInIds to prevent activating notificiation on cockpit which issued the bill. */
		completedCheckIns: new Array()

	},

	showActivationHint: function() {
		var me =this,
			msgBox = Ext.create('Ext.MessageBox');

		msgBox = Ext.create('Ext.MessageBox', {
			// hideOnMaskTap: true,
			modal: false,
			title: i10n.translate('notification.sound.manual.title'),
			'message' : i10n.translate('notification.sound.manual.msg'),
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
	* Initialize Sound by inserting a HTML5 Audio Tag into the DOM.
	*
	*/
	initNotificationSound: function() {
		var contentEl = this.getMainview().getContentEl(),
			audioEle = new Audio();
			audioEle.src = appConfig.audioNotificationFile;
			// audioEle.loop = true;
			this.getMainview().setHtml(audioEle);
			this.setNotificationSound(audioEle),
			me = this;

		Ext.Viewport.element.on('tap', function() {
			me.stopAudioNotification();
		});

	},
	/**
	* Event handler for activate sound button.
	* Toggles the sound on and off.
	*/
	toggleNotificationSound: function(button) {
		var messageCtr = this.getApplication().getController('Message'),
			active = this.getNotificationActive(),
			msgBox;

		if(!this.getUserInit()) {
			console.log('Notification.toggleNotificationSound -> user init');
			this.initNotificationSound();					
			this.setUserInit(true);
		};

		msgBox = Ext.create('Ext.MessageBox', {
			modal: false,
			centered: false,
			bottom: '5%',
			right: '3%',
			// left: '3%',
			'message' : (!active) ? i10n.translate('notification.sound.activate') : i10n.translate('notification.sound.deactivate'),
			buttons : []
		});	

		//show short alert and then hide
		Ext.defer((function() {
			if(!appHelper.getAlertActive()) {
				msgBox.destroy();
			}					
		}), appConfig.msgboxHideLongTimeout, this);

		
		if(!active) {
			console.log('Notification.toggleNotificationSound -> activate');
			this.setNotificationActive(true);
			button.setIconCls('volume');
			button.setCls('volume-status-on');
			this.getNotificationSound().autoplay = true;
			this.getNotificationSound().load();	
			// this.getNotificationSound().play();	
			//register events
			messageCtr.on('eatSense.request', this.processRequest, this);
			messageCtr.on('eatSense.bill', this.processBill, this);
			messageCtr.on('eatSense.checkin', this.processCheckIn, this);
		} else {
			console.log('Notification.toggleNotificationSound -> deactivate');
			this.setNotificationActive(false);
			button.setIconCls('volume_mute');
			button.setCls('volume-status-off');
			//deregister events
			messageCtr.un('eatSense.request', this.processRequest, this);
			messageCtr.un('eatSense.bill', this.processBill, this);
			messageCtr.un('eatSense.checkin', this.processCheckIn, this);
		};

		msgBox.show();
	},
	/**
	* Starts an audio notification alarm.
	* Only one alarm can be active. Other notifcations triggering the alarm won't start it new.
	* 
	*/
	startAudioNotification: function() {
		var me = this,
			sound = this.getNotificationSound();
		
		this.setPlayCounter(0);

		function playSound() {
			me.setPlayCounter(me.getPlayCounter()+1);
			if(me.getPlayCounter() > appConfig.audioNotificationIterations) {
				me.stopAudioNotification();
			} else {
				sound.autoplay = true;
				sound.load();
				console.log('played ' + me.getPlayCounter() + ' out of ' + appConfig.audioNotificationIterations);
			}								
			// sound.pause();
			// sound.currentTime = 0.1;
			// sound.play();
		};

		if(!this.getSoundInterval()) {
			playSound();
			this.setSoundInterval(window.setInterval(playSound, 5000));	
			console.log("Trying to play sound every 5s.");
		}

	},
	/**
	* Stops the audio notification alarm.
	* 
	*/
	stopAudioNotification: function() {
		var sound = this.getNotificationSound();
		
		//clear interval
		if(this.getSoundInterval()) {
			sound.pause();
			window.clearInterval(this.getSoundInterval());
			this.setSoundInterval(null);	
			console.log("Stopping sound interval.");	
		}
		
	},
	/**
	*
	*
	*/
	processRequest: function(action, data, message) {

		if(message.silent == true) {
			//don't notify
			return;
		}

		if(action == "new") {
			this.startAudioNotification();	
		};
	},
	/**
	*
	*
	*/
	processBill: function(action, data, message) {
		var completedId = this.removeCompletedCheckIn(data.checkInId);

		if(message.silent == true) {
			//don't notify
			return;
		}

		if(action == "new" && !completedId) {
			this.startAudioNotification();	
		};
	},
	/**
	*
	*
	*/
	processCheckIn: function(action, data, message) {
		if(message.silent == true) {
			//don't notify
			return;
		}

		if(action == "update-orders") {
			this.startAudioNotification();
		};
	},
	/**
	* Adds a checkInId to completedCheckIns Array.
	* @param checkInId
	*	Id to add.
	*/
	addCompletedCheckIn: function(checkInId) {
		var checkIns = this.getCompletedCheckIns(),
			found = false;

		//only proceed if notifications are active
		if(!this.getNotificationActive()) {
			return;
		}

		for (var i = checkIns.length - 1; i >= 0; i--) {
			if(checkIns[i] == checkInId) {
				found = true;
				break;
			}			
		};

		if(!found) {
			checkIns.push(checkInId);	
		}
	},
	/**
	* If exists removes given checkIn Id from completedCheckIns Array.
	* @checkInId
	*	Id to remove
	* @return
	*	null if no Id was found otherwise the checkInId
	*/
	removeCompletedCheckIn: function(checkInId) {
		var checkIns = this.getCompletedCheckIns(),
			foundId = null;

		//only proceed if notifications are active
		if(!this.getNotificationActive()) {
			return;
		}

		for (var i = checkIns.length - 1; i >= 0; i--) {
			if(checkIns[i] == checkInId) {
				foundId = checkInId;
				checkIns.splice(i,1);
				break;
			}
		};

		return foundId;
	}

});