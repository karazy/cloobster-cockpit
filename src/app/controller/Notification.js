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

	},

	launch: function(){
		
	},
	/**
	* Initialize Sound by inserting a HTML5 Audio Tag into the DOM.
	*
	*/
	initNotificationSound: function() {
		var contentEl = this.getMainview().getContentEl(),
			audioEle = new Audio();
			audioEle.src = appConfig.audioNotificationFile;
			this.getMainview().setHtml(audioEle);
			this.setNotificationSound(audioEle),
			me = this;			

		this.getMainview().mon(this.getMainview().el, {
    		tap : function(e, t) {
				console.log('main was tapped');
				me.stopAudioNotification();
    		}
		});
	},

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
			top: '5%',
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
			this.getNotificationSound().load();
			this.getNotificationSound().play();	
			//register events
			messageCtr.on('eatSense.request', this.processRequest, this);
		} else {
			console.log('Notification.toggleNotificationSound -> deactivate');
			this.setNotificationActive(false);
			button.setIconCls('volume_mute');
			//deregister events
			messageCtr.un('eatSense.request', this.processRequest, this);

		};

		msgBox.show();
	},

	startAudioNotification: function() {
		var sound = this.getNotificationSound();

		function playSound() {
			sound.load();
			sound.play();
		};

		if(!this.getSoundInterval()) {
			playSound();
			this.setSoundInterval(window.setInterval(playSound, 3500));	
			console.log("Trying to play sound every 2s.");
		}

	},

	stopAudioNotification: function() {
		// this.setNotificationActive(false);
		//clear interval
		if(this.getSoundInterval()) {
			window.clearInterval(this.getSoundInterval());
			this.setSoundInterval(null);
			console.log("Stopping sound interval.");	
		}
		
	},

	processRequest: function(action, message) {

		this.startAudioNotification();
	}

});