/*
* The login controller handles login and storing application state.
*/
Ext.define('EatSense.controller.Login', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.model.Account', 'Ext.data.proxy.LocalStorage', 'EatSense.model.AppState'],
	config: {
		control: {
			loginButton: {
				tap: 'login'
			},
			logoutButton: {
				tap: 'showLogoutDialog'
			},
		 	businessList: {
		 		select: 'chooseBusiness'
		 	},
		 	cancelLoginButton: {
	 			tap: 'cancelLogin'
		 	}
		},		
		refs: {
			loginPanel: {
				selector: 'login',
				xtype: 'login',
				autoCreate: true
			},
			loginButton: 'login button[action=login]',
			logoutButton: 'button[action=logout]',
			loginField: 'textfield[name=login]',
			passwordField: 'passwordfield[name=password]',
			savePassword: 'login togglefield[name=savePasswordToggle]',
			businessList: 'choosebusiness list',
			cancelLoginButton: 'choosebusiness button[action=cancel]',			
		},		
		/**
      	* Contains information to resume application state after the app was closed.
      	*/
      	appState : null,
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
	 		var 	appStateStore = Ext.data.StoreManager.lookup('cockpitStateStore');

			if(me.getSavePassword().getValue() === 1) {
				//set dirty so that store.sync does its work
				me.getAppState().setDirty();
				appStateStore.add(me.getAppState());
				appStateStore.sync();
			} else {
				appStateStore.removeAll();
				appStateStore.sync();
			};
	 	};
	 	/*
	 	*	Reset login fields.
	 	*/
	 	this.resetLoginFields = function() {
	 		me.getLoginField().setValue("");
	 		me.getPasswordField().setValue("");
	 		me.getSavePassword().setValue(0);
	 	};
	},
	/**
	* 	Tries to restore saved credentials from local webstorage.
	*	If this fails login screen is shown.
	*/
	restoreCredentials: function() {
		console.log('restoreCredentials');
		var me = this,
			appStateStore = Ext.data.StoreManager.lookup('cockpitStateStore'),
			spotCtr = this.getApplication().getController('Spot'),
			messageCtr = this.getApplication().getController('Message'),
			account = null,
			//don't call get loginview to prevent creation
			// loginview = this.getLoginPanel(),
			businessId,
			//create appState and force use of id=1 so that only one element gets stored
			appState = Ext.create('EatSense.model.AppState', {id: '1'}),
			token;

		this.setAppState(appState);

	   	 try {
	   			appStateStore.load();	   	
		   	 if(appStateStore.getCount() == 1) {
		   		console.log('app state found');		   		

		   		this.setAppState(appStateStore.first());
		   		appState = this.getAppState();

		   		//save token
		   		token = appState.get('accessToken');
		   		businessId = appState.get('businessId');

		   		 //Set default headers so that always credentials are send
				Ext.Ajax.setDefaultHeaders({
					'X-Auth': appState.get('accessToken'),
					'pathId' : appState.get('businessId')
				});

				//check if saved credentials are valid
				//account.get('login')
				EatSense.model.Account.load('login', {
					success: function(record, operation) {
						//credentials are valid, proceed
						account = record;
						me.setAccount(record);
						//generate clientId for channel
						account.set('clientId', record.get('login') + new Date().getTime());
						account.set('accessToken', token);
						//restore businessId on Account
						account.set('businessId', businessId);

						EatSense.model.Business.load(businessId, {
							success: function(record) {
								me.setBusiness(record);
								me.setCurrency(me.getBusiness());
								Ext.create('EatSense.view.Main');
								spotCtr.loadAreas();
								messageCtr.openChannel();
							}
						});
					},
					failure: function(record, operation) {					
						//error verifying credentials, maybe account changed on server or server ist not aaccessible
						me.resetDefaultAjaxHeaders();
						//show login screen
						Ext.create('EatSense.view.Login');


						if(operation.error) {
							//not authorized
							if(operation.error.status == "401" || operation.error.status == "403") {
								errorMessage = i10n.translate('restoreCredentialsErr');
								//login data not valid. delete
								me.clearAppState();
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
		   	 	me.clearAppState();
		   	 	//auto creates the panel and shows it
		   	 	me.getLoginPanel().show();	
		   	 }
	   	  } catch (e) {
	   	 	console.log('Failed restoring cockpit state.');
	   		me.clearAppState();
	   	 	//auto creates the panel and shows it
	   	 	me.getLoginPanel().show();	
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
			loginview = this.getLoginPanel(),
			login = this.getLoginField().getValue(),
			password = this.getPasswordField().getValue(),				
			spotCtr = this.getApplication().getController('Spot'),
			me = this,
			errorMessage,
			timestamp = new Date().getTime();

		if(Ext.String.trim(login).length == 0 || Ext.String.trim(password).length == 0) {
			
			Ext.Msg.alert(i10n.translate('error'), i10n.translate('needCredentials')); 
			return;
		}

		loginview.setMasked({
			xtype: 'loadmask',
			message: i10n.translate('loadingMsg')
		});

		//Generate a token via a POST. Getting the account in response is a covenient shortcut, compared to explicitly loading the account
		Ext.Ajax.request({
    	    url: appConfig.serviceUrl+'/accounts/tokens',
    	    method: 'POST',
    	    headers: {
				//provide credentials, they will be added to request header
				'login': login,
				'password': password
			},
			//submit a timestamp to prevent iOS6 from caching the POST request
			jsonData: timestamp,
    	    scope: this,
    	    success: function(response) {
    	    	loginview.unmask();
    	    	me.setAccount(Ext.create('EatSense.model.Account', Ext.decode(response.responseText)));
				//generate clientId for channel
				me.getAccount().set('clientId', me.getAccount().get('login') + new Date().getTime());

				//Set default headers so that always credentials are send
				Ext.Ajax.setDefaultHeaders({
					'X-Auth': me.getAccount().get('accessToken')
				});

				me.getAppState().set('accessToken', me.getAccount().get('accessToken'));
				me.showBusinesses();
    	    },
    	    failure: function(response) {
    	    	loginview.unmask();
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
	},
	/**
	*	Logout signed in user and show login screen.
	*	Removes credentials.
	*	
	*/
	logout: function() {
		console.log('Login.logout');
		var spotStore = Ext.data.StoreManager.lookup('spotStore'),
			checkInStore = Ext.data.StoreManager.lookup('checkInStore'),
			areaStore = Ext.data.StoreManager.lookup('areaStore'),
			historyStore = Ext.data.StoreManager.lookup('historyStore'),
			billStore = Ext.data.StoreManager.lookup('billStore'),
			businessStore = Ext.data.StoreManager.lookup('businessStore'),
			requestStore = Ext.data.StoreManager.lookup('requestStore'),
			defRequestStore = Ext.data.StoreManager.lookup('defRequestStore'),			
			spotDetail = this.getApplication().getController('Spot').getSpotDetail(),
			business = this.getBusiness(),
			loginview = this.getLoginPanel(),
			mainview;
		
		//make sure to close spot detail if it is still open
		if(!spotDetail.isHidden()) {
			console.log('hide spot detail');
			spotDetail.hide();
		};

		//always unlock buttons
		this.fireEvent('eatSense.unlock');


		//clear stores
		try {			
			spotStore.removeAll();		
			checkInStore.removeAll();
			areaStore.removeAll();
			historyStore.removeAll();
			billStore.removeAll();
			businessStore.removeAll();
			requestStore.removeAll();
			defRequestStore.removeAll();
		}catch(e) {
			console.log('Login.logout > error clearing all stores. ' + e);
		}

		this.getApplication().getController('Spot').stopRequestRefreshTask();

		appChannel.closeChannel();
		//remove all stored credentials
		this.clearAppState();

		this.resetDefaultAjaxHeaders();

		//remove main view
		mainview = Ext.Viewport.down('main');
		Ext.Viewport.remove(mainview);
		mainview.destroy();
		
		//console.log('Login.logout > Show loginview');
		loginview.show();	

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

		// Ext.create('EatSense.view.ChooseBusiness');

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
		var me = this,
			account = this.getAccount(),
			appState = this.getAppState(),
			spotCtr = this.getApplication().getController('Spot'),
			messageCtr = this.getApplication().getController('Message'),
			loginview = this.getLoginPanel();

		account.set('businessId', business.get('id'));
		account.set('business', business.get('name'));

		me.setBusiness(business);

		me.setCurrency(business);

		appState.set('businessId', business.get('id'));
		
		//set pathId in default Ajax headers to avoid setting it with every request
		Ext.Ajax.getDefaultHeaders().pathId = account.get('businessId');

		me.saveAppState();

		//hide loginview, reset values
		loginview.hide();
		loginview.setActiveItem(0);
		me.resetLoginFields();

		Ext.create('EatSense.view.Main');
		spotCtr.loadAreas();

		if(business.get('trash') == true) {
			//activate readonly mode
			this.fireEvent('eatSense.read-only');
		}

		messageCtr.openChannel();		
	},
	/**
	*	Event handler for choose business list tap.
	*	
	*/
	chooseBusiness: function(dv, record) {		
		dv.deselectAll(true);
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
	},
	/**
	* @private
	* Sets the currency in appconfig used by the given business.
	* If no valid currency is given, fallback to default
	* @param business
	*	Business whos currency will be used.
	*/
	setCurrency: function(business) {
		try {
          if(appConstants.Currency[business.get('currency')]) {
            //if the business currency is available in app set it
            appConfig.currencyFormat = business.get('currency');
          } else {
          	//if no valid currency exists make sure to always use default!
          	appConfig.currencyFormat = appConfig.currencyDefaultFormat;
          }
        } catch(e) {
          console.log('CheckIn.loadBusiness > failed setting currency');
          appConfig.currencyFormat = appConfig.currencyDefaultFormat;
        }
	},
	/**
	*
	*/
	clearAppState: function() {
		var appStateStore = Ext.StoreManager.lookup('cockpitStateStore');

		appStateStore.removeAll();
		appStateStore.sync();
	}
});