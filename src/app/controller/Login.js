/*
* The login controller handles login and storing application state.
*/
Ext.define('EatSense.controller.Login', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.model.Account', 'Ext.data.proxy.LocalStorage'],
	config: {
		control: {
			loginButton: {
				tap: 'login'
			},
			logoutButton: {
				tap: 'showLogoutDialog'
			},
		 	businessList: {
		 		itemtap: 'chooseBusiness'
		 	},
		 	cancelLoginButton: {
	 			tap: 'cancelLogin'
		 	}
		},		
		refs: {
			loginPanel: 'login',
			loginButton: 'login button[action=login]',
			logoutButton: 'button[action=logout]',
			loginField: 'textfield[name=login]',
			passwordField: 'passwordfield[name=password]',
			savePassword: 'login togglefield[name=savePasswordToggle]',
			businessList: 'choosebusiness list',
			cancelLoginButton: 'choosebusiness button[action=cancel]',			
		},		
		//Logged in user
		account : {},
		//business active
		business: {}
	},

	init: function() {
		console.log('init');
		var		me = this;

		this.getApplication().on('statusChanged', this.handleStatusChange, this);

		//private functions
		/*
		*	Resets Account proxy headers to prevent passwort from being send plain.
		*/
		this.resetAccountProxyHeaders =  function() {
			console.log('resetAccountProxyHeaders');
			EatSense.model.Account.getProxy().setHeaders({});
	 	};
	 	/*
		*	Resets default Ajax headers.
		*/
	 	this.resetDefaultAjaxHeaders = function() {
	 		Ext.Ajax.setDefaultHeaders({});
	 	};

	 	/*
	 	*	Save application state by using localstorage when getSavePassword is checked.
	 	*/
	 	this.saveAppState = function() {
	 		var 	accountLocalStore = Ext.data.StoreManager.lookup('cockpitStateStore');

			if(me.getSavePassword().getValue() === 1) {
				me.getAccount().setDirty();
				accountLocalStore.add(me.getAccount());
				accountLocalStore.sync();
			} else {
				accountLocalStore.removeAll();
				accountLocalStore.sync();
			};
	 	};
	 	/*
	 	*	Reset login fields.
	 	*/
	 	this.resetLoginFields = function() {
	 		me.getLoginField().setValue("");
	 		me.getPasswordField().setValue("");
	 	};
	},
	/**
	* 	Tries to restore saved credentials from local webstorage.
	*	If this fails login screen is shown.
	*/
	restoreCredentials: function() {
		console.log('restoreCredentials');
		var me = this,
			accountLocalStore = Ext.data.StoreManager.lookup('cockpitStateStore'),
			spotCtr = this.getApplication().getController('Spot'),
			messageCtr = this.getApplication().getController('Message'),
			account,
			token;

	   	 try {
	   			accountLocalStore.load();	   	
		   	 if(accountLocalStore.getCount() == 1) {
		   		console.log('app state found');
		   		account = accountLocalStore.first();
		   		this.setAccount(account);

		   		//save token
		   		token = account.get('accessToken');

		   		 //Set default headers so that always credentials are send
				Ext.Ajax.setDefaultHeaders({
					'X-Auth': account.get('accessToken'),
					'pathId' : account.get('businessId')
				});

				//check if saved credentials are valid
				EatSense.model.Account.load(account.get('login'), {
					success: function(record, operation){
						//credentials are valid, proceed

						//generate clientId for channel
						account.set('clientId', account.get('login') + new Date().getTime());
						account.set('accessToken', token);

						EatSense.model.Business.load(account.get('businessId'), {
							success: function(record) {
								me.setBusiness(record);
								Ext.create('EatSense.view.Main');
								spotCtr.loadSpots();
								//TODO temporary
								// messageCtr.refreshAll(true);
								messageCtr.openChannel();
							}
						});
					},
					failure: function(record, operation) {					
						//error verifying credentials, maybe account changed on server or server ist not aaccessible
						me.resetDefaultAjaxHeaders();
						// me.resetAccountProxyHeaders();

						Ext.create('EatSense.view.Login');

						me.getLoginField().setValue(account.get('login'));

						if(operation.error) {
							//not authorized
							if(operation.error.status == "401" || operation.error.status == "403") {
								errorMessage = i10n.translate('restoreCredentialsErr');
								//login data not valid. delete
								accountLocalStore.removeAll();
								accountLocalStore.sync();
							} else if (operation.error.status == "404") {
								errorMessage = i10n.translate('resourceNotAvailable');
							}
						} 

						(!errorMessage || errorMessage == "") ?	errorMessage = i10n.translate('restoreCredentialsErr') : errorMessage;


						me.getApplication().handleServerError({
							'error': operation.error, 
							'forceLogout': false, 
							'hideMessage':false, 
							'message': errorMessage
						}); 
					}
				});							   			   		 	   		
		   	 } else {
		   	 	//more than one local account exists. That should not happen!
		   	 	accountLocalStore.removeAll();
		   	 	Ext.create('EatSense.view.Login');	
		   	 }
	   	  } catch (e) {
	   	 	console.log('Failed restoring cockpit state.');
	   		accountLocalStore.removeAll();	
	   	 	Ext.create('EatSense.view.Login');	   		
	   	 }
	},
 	/**
 	*	Action called from login button.
 	*	Reads login fields and makes an login attempt. If request is successfull,
 	* 	main application screen is shown.
 	*	If user sets automatic login then credentials will be saved in localstorage.
 	*
 	*/
	login: function() {
		console.log('login');

		var me = this,
			login = this.getLoginField().getValue(),
			password = this.getPasswordField().getValue(),				
			spotCtr = this.getApplication().getController('Spot'),
			me = this,
			errorMessage;

		if(Ext.String.trim(login).length == 0 || Ext.String.trim(password).length == 0) {
			
			Ext.Msg.alert(i10n.translate('error'), i10n.translate('needCredentials')); 
			return;
		}

		// EatSense.model.Account.getProxy().setHeaders({
		// 		//provide credentials, they will be added to request header
		// 		'login': login,
		// 		'password': password
		// });

		Ext.Ajax.request({
    	    url: appConfig.serviceUrl+'/accounts/tokens',
    	    method: 'POST',
    	    headers: {
				//provide credentials, they will be added to request header
				'login': login,
				'password': password
			},
    	    scope: this,
    	    success: function(response) {
    	    	me.setAccount(Ext.create('EatSense.model.Account', Ext.decode(response.responseText)));
				//generate clientId for channel
				me.getAccount().set('clientId', me.getAccount().get('login') + new Date().getTime());

				//Set default headers so that always credentials are send
				Ext.Ajax.setDefaultHeaders({
					'X-Auth': me.getAccount().get('accessToken')
				});

				// me.resetAccountProxyHeaders();
				me.showBusinesses();
    	    },
    	    failure: function(response) {
    	    	// me.resetAccountProxyHeaders();
				me.resetDefaultAjaxHeaders();

				if(response.status) {
					//not authorized
					if(response.status == "401" || response.status == "403") {
						errorMessage = i10n.translate('wrongCredentials');
					} else if (response.status == "404") {
						errorMessage = i10n.translate('resourceNotAvailable');
					}
				};

				(!errorMessage || errorMessage == "") ?	errorMessage = i10n.translate('wrongCredentials') : errorMessage;

    	    	me.getApplication().handleServerError({
						'error': {
							'status': response.status,
							'statusText': response.statusText
						}, 
						'forceLogout': false, 
						'hideMessage':false,
						'message': errorMessage
				});
	   	    }
		});
	},
	/**
	*	Cancel login process in choose business view.
	*
	*/
	cancelLogin: function() {
		var	me = this,
			loginPanel = this.getLoginPanel();

		loginPanel.setActiveItem(0);
		me.resetLoginFields();

		me.resetDefaultAjaxHeaders();
		me.setAccount({});
		// me.resetAccountProxyHeaders();
	},
	/**
	*	Logout signed in user and show login screen.
	*	Removes credentials.
	*	
	*/
	logout: function() {
		console.log('Logout Controller -> logout');
		var 	accountLocalStore = Ext.data.StoreManager.lookup('cockpitStateStore'),
				spotStore = Ext.data.StoreManager.lookup('spotStore'),
				checkInStore = Ext.data.StoreManager.lookup('checkInStore'),
				spotDetail = this.getApplication().getController('Spot').getSpotDetail(),
				business = this.getBusiness();
		
		//make sure to close spot detail if it is still open
		if(!spotDetail.isHidden()) {
			console.log('hide spot detail');
			spotDetail.hide();
		};

		if(business.get('trash')) {
			this.fireEvent('eatSense.unlock');
		};

		spotStore.removeAll();
		checkInStore.removeAll();


		appChannel.closeChannel();
		//remove all stored credentials
		accountLocalStore.removeAll();
		accountLocalStore.sync();

		this.resetDefaultAjaxHeaders();

		//TODO remove in a more reliable way!
		//remove main view				
		Ext.Viewport.remove(Ext.Viewport.down('main'));
		//show main view				
		Ext.create('EatSense.view.Login');		

	},
	/**
	*	Displays a logout dialog and logs user out if he confirms.
	*	
	*/
	showLogoutDialog: function() {
		var 	me = this;

			Ext.Msg.show({
				title: i10n.translate('hint'),
				message: i10n.translate('logoutQuestion'),
				buttons: [{
					text: i10n.translate('yes'),
					itemId: 'yes',
					ui: 'action'
				}, {
					text:  i10n.translate('no'),
					itemId: 'no',
					ui: 'action'
				}],
				scope: this,
				fn: function(btnId, value, opt) {
					if(btnId=='yes') {
						me.logout();	
					};
				}
		});
	},
	/**
	*	Loads all businesses (e. g. restaurants or hotels) this user account is assigned to.
	*
	*/
	showBusinesses: function() {
		console.log('showBusinesses');
		var me = this,
			businessStore = Ext.StoreManager.lookup('businessStore'),
			account = this.getAccount(),
			spotCtr = this.getApplication().getController('Spot'),
			loginPanel = this.getLoginPanel();

		Ext.create('EatSense.view.ChooseBusiness');

		this.getBusinessList().getStore().load({
			// params: {
			// 	pathId: account.get('login')
			// },
			callback: function(records, operation, success) {
			 	if(success) {

			 		if(!records || records.length == 0) {
			 			loginPanel.setActiveItem(0);
			 			Ext.Msg.alert(i10n.translate('error'), i10n.translate('noBusinessAssigned'), Ext.emptyFn);
			 		}

			 		if(records.length > 1) {
			 			//more than one assigned business exists. show chooseBusiness view
			 			loginPanel.setActiveItem(1);
			 		} else if(records.length == 1){
			 			me.setBusinessId(records[0]);					
			 		} 

			 	} else {
			 		//TODO user can't log in because he is not assigned to a business
			 		loginPanel.setActiveItem(0);
			 		me.getApplication().handleServerError({
							'error': operation.error, 
							'forceLogout': false, 
							'hideMessage':false
						}); 
			 	}				
			 },
			 scope: this
		});
	},

	/**
	*	Sets the businessId in account the user wants to log in for.
	*	This Id will be used for calls to the webservice.
	* 	e.g. /businesses/{id}/spots
	* @param business
	*	the business
	*/
	setBusinessId: function(business) {
		var 	me = this,
				account = this.getAccount(),
				spotCtr = this.getApplication().getController('Spot'),
				messageCtr = this.getApplication().getController('Message'); 

		account.set('businessId', business.get('id'));
		account.set('business', business.get('name'));

		me.setBusiness(business);
		
		//set pathId in default Ajax headers to avoid setting it with every request
		Ext.Ajax.getDefaultHeaders().pathId = account.get('businessId');

		me.saveAppState();

		Ext.Viewport.remove(Ext.Viewport.down('login'));
		Ext.create('EatSense.view.Main');
		spotCtr.loadSpots();

		if(business.get('trash') == true) {
			//activate readonly mode
			this.fireEvent('eatSense.read-only');
		};

		messageCtr.openChannel();		
	},
	/**
	*	Event handler for choose business list tap.
	*	
	*/
	chooseBusiness: function(dv, index, target, record) {		
		this.setBusinessId(record);		
	},
	/**
	* Handle status changes for this application.
	* Currently only a forceLogout is handled.
	*/
	handleStatusChange: function(status) {
		if(status == appConstants.FORCE_LOGOUT) {
			this.logout();
		}
	}


});