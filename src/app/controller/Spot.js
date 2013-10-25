/**
*	Controlls actions for the spot view.
* 	- showing and updating status for spots (tables, rooms, ...)
*	- processing incoming orders, payment requests ...
*/
Ext.define('EatSense.controller.Spot', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Main', 'EatSense.view.SpotSelectionDialog', 'EatSense.view.CompleteCheckInDialog',
		'EatSense.view.CustomerRequestDialog', 
		'Ext.util.DelayedTask',
		'EatSense.view.HistoryDetailItem'],
	config: {
		refs: {
			spotitem: 'spotitem button',
			// spotsview: '#spotsview',
			spotcard: 'spotcard',
			viewCarousel: 'spotcard #views',
			mainview: 'main',
			// spotTab: 'tab',
			info: 'toolbar[docked=bottom] #info',
			spotDetail: {
		        selector: 'spotdetail',
		        xtype: 'spotdetail',
		        autoCreate: true
		    },
			spotDetailCustomerList: 'spotdetail #checkInList',
			spotDetailOrderList: 'spotdetail #spotDetailOrders',		    
			confirmOrderButton: 'spotdetail button[action=confirm]',
			cancelOrderButton: 'spotdetail button[action=cancel]',
			closeSpotDetailButton: 'spotdetail button[action=close]',
			paidSpotDetailButton: 'spotdetail button[action=paid]',
			cancelAllButton: 'spotdetail button[action=cancel-all]',    
			confirmAllButton: 'spotdetail button[action=confirm-all]',
			switchSpotButton: 'spotdetail button[action=switch-spot]',
			completeCheckInButton: 'spotdetail button[action=complete-checkin]',
			completeCheckInDialog: {
				selector: 'completecheckin',
				xtype: 'completecheckin',
				autoCreate: true
			},
			completeCheckInList: 'completecheckin list',
			spotDetailStatistic: 'spotdetail #statistics',
			spotSelectionDialog: {
				selector: 'spotselection',
				xtype: 'spotselection',
				autoCreate: true
			},			
			switchSpotList: 'spotselection list',
			spotDetailItem: 'spotdetailitem',
			filterRadios: 'radiofield[name=filter]',
			requestSortRadios: 'radiofield[name=sort-request]',
			showFilterButton: 'main button[action=show-filter]',
			showRequestSortButton: 'main button[action=show-request-sort]',
			filterPanel: 'main #filterPanel',
			requestSortPanel: 'main #requestSortPanel',
			requestDataview: 'spotcard #requestDataview',
			showSpotViewButton: 'spotcard button[action=show-spotview]',
			showRequestViewButton: 'spotcard button[action=show-requestview]',
			showHistoryViewButton: 'spotcard button[action=show-historyview]',
			historyDataview: 'spotcard #historyDataview',
			historyDetail: {
				selector: 'historydetailitem',
				xtype: 'historydetailitem',
				autoCreate: true
			},
			closeHistoryDetailButton: 'historydetailitem button[action=close]',
			infoButton: 'main button[action=show-info]',
			inactiveCheckInButton: 'main button[action=inactive-checkins]'
		},

		control : {
			spotitem: {
		 		tap:  'spotItemTapped'
		 	},
		 	spotDetailCustomerList: {
		 		select: 'showCustomerDetail'
		 	},
		 	confirmOrderButton: {
		 		tap: 'confirmOrder'
		 	},
		 	cancelOrderButton: {
		 		tap: 'cancelOrder'
		 	},
		 	closeSpotDetailButton: {
		 		tap: 'closeSpotDetail'
		 	},
		 	spotDetail: {
		 		hide: 'hideSpotDetail',
		 		show: 'showSpotDetail'
		 	},
		 	paidSpotDetailButton: {
		 		tap: 'confirmPayment'
		 	},
		 	cancelAllButton: {
		 		tap: 'cancelAll'
		 	},
		 	confirmAllButton: {
		 		tap: 'confirmAll'
		 	},
		 	switchSpotButton: {
		 		tap: 'showSpotSelection'
		 	}, 
		 	switchSpotList: {
		 		select: 'switchSpot'
		 	},
		 	completeCheckInButton: {
		 		tap: 'showCompleteCheckInDialog'
		 	},
		 	completeCheckInList: {
		 		select: 'completeCheckIn'
		 	},
		 	dismissRequestsButton : {
		 		tap: 'deleteCustomerRequests'
		 	},
		 	spotDetailItem : {
		 		updatedata: 'showSpotDetailItem'
		 	},
		 	filterRadios : {
		 		check: 'filterSpotsRadio'
		 	},
		 	requestSortRadios: {
		 		check: 'sortRequestRadio'	
		 	},
		 	showFilterButton : {
		 		tap : 'showFilterPanel'
		 	},
		 	showRequestSortButton : {
		 		tap: 'showRequestSortPanel'
		 	},
		 	mainview: {
		 		activeitemchange: 'areaChanged'	
		 	},
		 	requestDataview : {
		 		itemtap : 'requestItemTapped'
		 	},
		 	showSpotViewButton: {
		 		tap: 'showSpotView'
		 	},
		 	showRequestViewButton: {
		 		tap: 'showRequestView'
		 	},
		 	showHistoryViewButton: {
		 		tap: 'showHistoryView'
		 	},
		 	forwardRequestViewButton: {
		 		tap: 'forwardRequestView'
		 	},
		 	backHistoryViewButton: {
		 		tap: 'backHistoryView'
		 	},
		 	historyDataview: {
		 		itemtap: 'historyItemTapped'
		 	},
		 	closeHistoryDetailButton: {
		 		tap: 'closeHistoryDetail'
		 	},
		 	infoButton: {
		 		tap: 'infoButtonTapped'
		 	},
		 	inactiveCheckInButton: {
		 		tap: 'loadAndShowInactiveCheckIns'
		 	}
		},

		//the active spot, when spot detail view is visible
		activeSpot: null,
		//active customer in detail spot view
		activeCustomer: null,
		//active bill of active Customer
		activeBill : null,
		//contains active area
		activeArea : null,
		activeCustomerAccount: null,

		refreshRequestTask: null,

		/** If true will display spot and area name for each checkin */
		displayCheckInLocation: false
	},

	init: function() {
		console.log('initializing Spot Controller');
		//add listeners for message events
		var messageCtr = this.getApplication().getController('Message'),
			loginCtr = this.getApplication().getController('Login');
		
		messageCtr.on('eatSense.spot', this.updateSpotIncremental, this);
		//refresh all is only active when push communication is out of order
		messageCtr.on('eatSense.refresh-all', this.loadSpots, this);

		//update request view when pus communication isn't working
		messageCtr.on('eatSense.refresh-all', this.updateRequests, this);

		messageCtr.on('eatSense.business', this.updateBusinessIncremental, this);

		loginCtr.on('eatSense.read-only', this.lockActions, this);
		loginCtr.on('eatSense.unlock', this.unlockActions, this);

		//update requests in request view
		messageCtr.on('eatSense.order', this.updateRequests, this);
		messageCtr.on('eatSense.request', this.updateRequests, this);
		messageCtr.on('eatSense.bill', this.updateRequests, this);
		messageCtr.on('eatSense.checkin', this.updateRequests, this);

		messageCtr.on('eatSense.checkin', this.updateHistory, this);

		messageCtr.on('eatSense.checkin', this.processInactiveCheckins, this);
	},

	// start load and show data
	/**
	* Load all available areas and create tabs dynamically.
	* Also acts as initialization method. This method gets directly called after successful login
	* or restore state.
	*/
	loadAreas: function() {
		var me = this,
			areaStore = Ext.StoreManager.lookup('areaStore'),
			spotStore = Ext.StoreManager.lookup('spotStore'),
			tabPanel = this.getMainview(),
			tab,
			carousel,
			areaFilter,
			delayedTask,
			areaName;

		areaStore.load({
			callback: function(records, operation, success) {
			 	if(!success) {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': true, 
						'hideMessage':false
					});
			 	} else {
			 		//clear filters, otherwise spots are not shown when logging out and switching accounts
			 		spotStore.clearFilter(true);

			 		//Create a custom tab for each service area
			 		areaStore.each(function(area, index) {
			 			areaFilter	= new Ext.util.Filter({
					    	root : 'data',
					    	property: 'areaId',
					    	value: area.get('id'),
					    	exactMatch: true
						});

			 			tab = Ext.create('EatSense.view.Spot', {
			 				//BUGFIX enclosing divs area for chrome cutting of the titles
			 				title: '<div>' + area.get('name') + '</div>',
			 				'area': area,
			 				'areaFilter' : areaFilter
			 			});

			 			//attach change listener to carousel
			 			// carousel = tab.down('carousel');
			 			// carousel.on('activeitemchange', this.spotCarouselItemChange, this);

			 			tabPanel.add(tab);
			 			if(index == 0) {
			 				me.setActiveArea(area);
							spotStore.filter(tab.getAreaFilter());
			 			};
			 			console.log("add tab " + area.get('name'));
			 		});

			 		me.loadSpots();
			 		me.loadRequests();
			 		me.loadHistory();

			 		me.startRequestRefreshTask();
			 	}			
			 }
		});

		//show user the audio notification box as a reminder
		this.getApplication().getController('Notification').showActivationHint();
	},
	/**
	* Loads all requests displayed in request list view
	* @param callback
	*	(optional) gets called when requests are loaded
	*/
	loadRequests: function(callback) {
		var me = this,
			store = Ext.StoreManager.lookup('defRequestStore'),
			mainview = this.getMainview();
			// dataview = this.getRequestDataview();

		store.load({
			params: {
				'areaId' : this.getActiveArea().getId(),
				//don't filter
				// 'type': ['ORDER', 'BILL']
			},
			callback: function(records, operation, success) {
				if(success) {
					//get the active requestview!
					me.getMainview().getActiveItem().down('#requestDataview').refresh();
					if(records.length > 0) {
						me.getMainview().getActiveItem().down('#requestListDescPanel').setHidden(true);
					} else {
						me.getMainview().getActiveItem().down('#requestListDescPanel').setHidden(false);
					};

					if(appHelper.isFunction(callback)) {
						callback();
					}
					
				} else {
					me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true},
						'hideMessage':false
					});
				}
			}
		});
	},
	/**
	* Loads the history for history view.
	*
	*/
	loadHistory: function() {
		var me = this,
			store = Ext.StoreManager.lookup('historyStore');

		//user ExtraParam so that they are always submitted
		store.getProxy().setExtraParam('areaId', this.getActiveArea().getId());

		store.loadPage(1, {
			callback: function(records, operation, success) {
				if(success) {
					//get the active historyview!
					me.getMainview().getActiveItem().down('#historyDataview').refresh();
				} else {
					me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true},
						'hideMessage':false
					});
				}
			}
		});	
	},

	/**
	*	Loads all spots and refreshes spot view.
	*	Called after a successful login or credentials restore.
	*	If spot loading fails user will be logged out.
	*/
	loadSpots: function() {
		console.log('loadSpots');
		var me = this,
			loginCtr = this.getApplication().getController('Login'),
			account = loginCtr.getAccount(),
			business = loginCtr.getBusiness(),
			info = this.getInfo(),
			spotStore = Ext.StoreManager.lookup('spotStore'),
			statusInfo = i10n.translate('spot.bar.bottom.status', [account.data.login || account.data.email, business.data.name]),
			filters = spotStore.getFilters();

		if(loginCtr.getBusiness().get('trash')) {
			statusInfo += " " + i10n.translate('spot.bar.bottom.status.locked');
		};

		info.setHtml(statusInfo);

		spotStore.load({
			 callback: function(records, operation, success) {
			 	if(!success) {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true}, 
						'hideMessage':false
					});
			 	} else {
			 		spotStore.clearFilter(true);
			 		spotStore.each(function(spot) {
			 			//sets badge text depending on status
			 			me.updateTabBadgeText(spot);
			 		});
			 		spotStore.setFilters(filters);
					spotStore.filter();
			 	}
			 },
			 scope: this
		});	

	},

	/**
	* Loads account data for given id
	* @param checkInId
	* @param callback
	* @return
	*	The account.
	*/
	loadAccountByCheckIn: function(checkInId, callback) {
		var loginCtr = this.getApplication().getController('Login');

		if(!checkInId) {
			console.error('Spot.loadAccountByCheckIn: no checkInId given');
			callback(false);
			return;
		}

		if(!callback) {
			console.error('Spot.loadAccountByCheckIn: no callback given');
			callback(false);
			return;
		}

		Ext.Ajax.request({
			url: appConfig.serviceUrl+'/b/businesses/'+loginCtr.getAccount().get('businessId')+'/checkins/'+checkInId+'/account',
			success: function(response) {
				if(!response.responseText) {
					callback(false);
				}

				var account = Ext.JSON.decode(response.responseText);
				
				callback(true, account);
			},
			failure: function(response) {
				if(callback) {
					callback(false);
				}
				this.getApplication().handleServerError({
					'error': response, 
					'forceLogout': {403: true}, 
					'hideMessage': {404: true}
				});
			},
			scope: this
		});

	},


	/**
	* Event handler for SpotItem tap.
	*
	*/
	spotItemTapped: function(button, eventObj, eOpts) {
		this.showSpotDetails(button.oRec);
	},

	/**
	*	Gets called when user taps on a spot. Shows whats going on at a particular spot.
	*   Like incoming orders, payment requests ...
	* @param spot
	*	Spot to show details for.
	* @param checkInId
	*	if existing checkInId to select
	*/
	showSpotDetails: function(spot, checkInId) {
		console.log('showSpotDetails');
		var	me = this,
			loginCtr = this.getApplication().getController('Login'),
			// messageCtr = this.getApplication().getController('Message'),
			requestCtr = this.getApplication().getController('Request'),
			detail = me.getSpotDetail(),
			checkInList = detail.down('#checkInList'),
			//see SpotItem for details why button.oRec is called
			// data = button.getParent().getRecord(),			
			data = spot,
			checkInStore = Ext.StoreManager.lookup('checkInStore'),
			restaurantId = loginCtr.getAccount().get('businessId'),
			titlebar = detail.down('titlebar'),
			requestStore = Ext.StoreManager.lookup('requestStore'),
			checkInToSelect;

		//add listeners for channel messages
		// messageCtr.on('eatSense.checkin', this.updateSpotDetailCheckInIncremental, this);
		// messageCtr.on('eatSense.order', this.updateSpotDetailOrderIncremental, this);
		// messageCtr.on('eatSense.bill', this.updateSpotDetailBillIncremental, this);
		// messageCtr.on('eatSense.request', requestCtr.processCustomerRequest, requestCtr);
		// //refresh all is only active when push communication is out of order
		// messageCtr.on('eatSense.refresh-all', this.refreshActiveSpotCheckIns, this);
		
		
		me.setActiveSpot(data);	
		//TODO enclosing divs area for chrome cutting of the titles, fixed in 2.1
		titlebar.setTitle('<div>' + data.get('name') + '</div>');

		//load checkins and orders and set lists
		checkInStore.load({
			params: {
				pathId: restaurantId,
				spotId: data.get('id')
			},
			 callback: function(records, operation, success) {
			 	if(success) { 		
			 		requestCtr.loadRequests(function()
			 		{
			 			try {
			 				spotStatusData = me.getLocalSpotStatusData(me.getActiveSpot().get('id'), checkInStore, requestStore);
			 				me.updateSpotIncremental('update', spotStatusData);	
				 		} catch(e) {
				 			console.log('Spot.showSpotDetails: failed to update spot status');
				 		}	
			 		});			 		

			 		if(records.length > 0) {			 						 		
			 			if(!checkInId) {
			 				//selects the first customer. select event of list gets fired and calls showCustomerDetail	 	
			 				me.getSpotDetailCustomerList().select(0);
			 			} else {
			 				checkInToSelect = checkInStore.getById(checkInId);
			 				if(checkInToSelect) {
			 					me.getSpotDetailCustomerList().select(checkInToSelect);
			 				} else {
			 					me.getSpotDetailCustomerList().select(0);
			 				}
			 			}	
			 		}
			 	} else {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true},
						'hideMessage':false
						// 'message': i10n.translate('errorSpotDetailCheckInLoading')
					});
			 	}			
			 },
			 scope: this
		});

		//show detail view
		Ext.Viewport.add(detail);
		detail.show();
	},

	/**
	*	Shows details (orders, bills, requests) of a customer.
	*	Fired when customer in checkInList in spot detail view is tapped.
	*	Loads all orders based on the passed checkin.
	*
	*	@param record
	*			selected checkIn
	*
	*/
	showCustomerDetail: function(dataview, record, options) {
		var me = this,
			loginCtr = this.getApplication().getController('Login');
		
		if(!record) {
			return;
		}

		me.setActiveCustomer(record);		
		// me.getSpotDetail().fireEvent('eatSense.customer-update', false);
		me.setSpotdetailButtonsActive(true);

		this.refreshActiveCustomerOrders();
		this.refreshActiveCustomerPayment();

		this.loadAccountByCheckIn(record.get('id'), loadAccountSuccess);

		function loadAccountSuccess(success, account) {
			if(success) {
				me.setActiveCustomerAccount(account);
			} else {
				me.setActiveCustomerAccount(null);
			}
			me.updateCustomerAccountPanel(account);
		}
	},
	/**
	* @private
	* Loads all checkins for selected spot.
	* This method is only active during refresh-all.
	*/
	refreshActiveSpotCheckIns: function() {
		var me = this,
			requestCtr = this.getApplication().getController('Request'),
			checkInStore = Ext.StoreManager.lookup('checkInStore'),
			tempCheckIn;

		checkInStore.removeAll();
		checkInStore.load({
			params: {
				// pathId: restaurantId,
				spotId: me.getActiveSpot().get('id')
			},
			 callback: function(records, operation, success) {
			 	if(success) { 		
			 		requestCtr.loadRequests();
			 		tempCheckIn = checkInStore.getById(me.getActiveCustomer().get('id'))
			 		if(tempCheckIn) {
			 			me.setActiveCustomer(tempCheckIn);
			 			me.refreshActiveCustomerOrders();
						me.refreshActiveCustomerPayment();
			 		}
			 	} else {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true},
						'hideMessage':false
					});
			 	}		
			 }
		});
	},
	/**
	* @private
	* Loads all orders for selected customer.
	*/
	refreshActiveCustomerOrders: function() {
		var me = this,
			orderStore = Ext.StoreManager.lookup('orderStore'),
			completeButton = this.getCompleteCheckInButton();

		if(!me.getActiveCustomer()) {
			console.log('Spot.refreshActiveCustomerOrders > no active customer');
			return;
		}

		orderStore.load({
			params: {
				checkInId: me.getActiveCustomer().getId(),
				//currently not evaluated
				// spotId: 
			},
			 callback: function(records, operation, success) {
			 	if(success) {
			 		// if(records.length == 0) {
			 		// 	completeButton.setDisabled(true);
			 		// } else {
			 		// 	completeButton.setDisabled(false);
			 		// };
			 			
			 		me.updateCustomerStatusPanel(me.getActiveCustomer());
			 		me.updateCustomerTotal(records);
			 	} else {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true}, 
						'hideMessage':false
						// 'message': i10n.translate('errorSpotDetailOrderLoading')
					});
			 	}				
			 }
		});			
	},
	/**
	* @private
	* Loads bill for selected customer.
	*/
	refreshActiveCustomerPayment: function() {
		var me = this,
			billStore = Ext.StoreManager.lookup('billStore'),
			paidButton = this.getPaidSpotDetailButton(),
			completeButton = this.getCompleteCheckInButton();

		if(!me.getActiveCustomer()) {
			console.log('no active customer');
			return;
		}

		if(me.getActiveCustomer().get('status') == appConstants.PAYMENT_REQUEST) {
			// paidButton.setDisabled(false);
			// completeButton.setDisabled(true);
			billStore.load({
				params: {
					// pathId: restaurantId,
					checkInId: me.getActiveCustomer().getId()
				},
				 callback: function(records, operation, success) {
				 	if(success && records.length == 1) { 
				 		me.setActiveBill(records[0]);
				 		me.updateCustomerPaymentMethod(records[0].getPaymentMethod().get('name'));
				 	} else {				 		
			    		me.updateCustomerPaymentMethod();
				 	}				
				 },
				 scope: this
			});
		} else {
			me.setActiveBill(null);
			//make sure to hide payment method label
			me.updateCustomerPaymentMethod();
			// paidButton.disable();
		}
	},
	// end load and show data

	// start push message handlers

	/**
	*	Takes a spot and refreshes the associated item in view.
	*	
	*	@param updatedSpot
	*		A spot where only updated fields are set. (raw data)
	*/
	updateSpotIncremental: function(action, updatedSpot) {
		console.log('updateSpotIncremental');
		//load corresponding spot
		var dirtySpot, 
			index, 
			spotStore = Ext.StoreManager.lookup('spotStore'),
			filters = spotStore.getFilters();
		
		//use getById because this ignores Filters!
		spotStore.clearFilter(true);
		dirtySpot = spotStore.getById(updatedSpot.id);
		spotStore.setFilters(filters);
		spotStore.filter();

		if(dirtySpot) {
			if(updatedSpot.status) {
				dirtySpot.set('status', updatedSpot.status);
			} else if(updatedSpot.checkInCount === 0) {
				dirtySpot.set('status', '');
			};

			if(updatedSpot.checkInCount || typeof updatedSpot.checkInCount == "number") {
				dirtySpot.set('checkInCount', updatedSpot.checkInCount);
			};

			this.updateTabBadgeText(dirtySpot);

		};
	},
	/**
	* Searches the corresponding tab for this spot and updates the badge text.
	*/
	updateTabBadgeText: function(updatedSpot) {	
		var me = this,
			dirtySpot,
			tabs = this.getMainview().query('spotcard'),
			status = updatedSpot.get('status'),
			areaId = updatedSpot.get('areaId'),
			tabBadgeText,
			activeStatusValues = [appConstants.Request.CALL_WAITER, appConstants.PAYMENT_REQUEST, appConstants.ORDER_PLACED];

		if(!updatedSpot || !areaId) {
			console.log('Spot withouth areaId!');
			return;
		};

		// console.log('updateTabBadgeIncremental spot '+ updatedSpot.get('id') + ' name ' + updatedSpot.get('name') + ' status: ' + status);

		Ext.Array.each(tabs, function(tab, index) {
			//don't applay new flag if tab to update is active
			//this.getMainview().getActiveItem() != tab && 
			if(me.getMainview().getActiveItem() != tab && tab.getArea().getId() == areaId) {
				me.setTabBadgeText(tab, status);
				return false;
			};
		});
	},
	/**
	* Set badge text based on status.
	* @param tab
	*	Tab to set badge text
	* @param status
	*	Status to check.
	*/
	setTabBadgeText: function(tab, status) {
		var tabBadgeText = "",
			activeStatusValues = [appConstants.Request.CALL_WAITER, appConstants.PAYMENT_REQUEST, appConstants.ORDER_PLACED];
				
			if(activeStatusValues.indexOf(status) != -1) {
				tab.tab.setBadgeText(i10n.translate('area.request.new.badge'));
			}			
	},
	/**
	* Updates spotdetail view when a checkIn change at this spot occurs.
	* @param action
	*	message action type eg. new, upadte, delete, confirm-orders
	* @param updatedCheckIn
	*	raw json object with new checkin data
	*/
	updateSpotDetailCheckInIncremental: function(action, updatedCheckIn) {
		var		me = this,
				detail = this.getSpotDetail(),
				store = this.getSpotDetailCustomerList().getStore(),
				orders = Ext.StoreManager.lookup('orderStore'),
				customerList = this.getSpotDetailCustomerList(),
				dirtyCheckIn,
				index,
				listElement,
				//the raw data object
				origCheckIn = updatedCheckIn,
				checkInFromStore,
				//convert to sencha model
				updatedCheckIn = Ext.create('EatSense.model.CheckIn', updatedCheckIn),
				requestCtr = this.getApplication().getController('Request'),
				customerIndex;


		//check if spot detail is visible
		if(!detail.isHidden()) {		
		// checkInFromStore = this.getCheckinInStore(origCheckIn.id);	
			//only proceed if a checkIn was found
			// if(checkInFromStore) {			
			if(action == 'new') {
				//only add if this belongs to active spot
				if(me.getActiveSpot() && origCheckIn.spotId == me.getActiveSpot().get('id')) {
					store.add(updatedCheckIn);
					if(store.getCount() == 1) {
						//only one checkIn exists so set this checkIn as selected
						customerList.select(0);
					}
					//make sure to load new request so they exist
					requestCtr.loadRequests();
				}					
			} else if (action == 'update' || action == 'confirm-orders') {
				dirtyCheckIn = store.getById(updatedCheckIn.get('id'));
				if(dirtyCheckIn) {
					//update existing checkin
					dirtyCheckIn.setData(updatedCheckIn.getData());

					//always refresh list to flag incoming orders on non active customers
					me.getSpotDetailCustomerList().refresh();

					if(me.getActiveCustomer() && me.getActiveCustomer().get('id') == updatedCheckIn.get('id')) {
						//update status only if this is the active customer
						me.updateCustomerStatusPanel(updatedCheckIn);
						if(action == 'confirm-orders') {
							orders.queryBy(function(order){
								if(order.get('status') == appConstants.Order.PLACED) {
									return true;
								}
							}).each(function(order) {
								order.set('status', appConstants.Order.RECEIVED);
							});
						}
					}
				} else {
					console.log('Spot.updateSpotDetailCheckInIncremental: no checkin for open spot found');
				}
			} else if (action == 'delete') {					
				dirtyCheckIn = store.getById(updatedCheckIn.get('id'));
				// console.log('Spot.updateSpotDetailCheckInIncremental > PRE delete checkin with get(id) ' + updatedCheckIn.get('id') + ' data.id ' + updatedCheckIn.data.id);
				if(dirtyCheckIn) {
					// console.log('Spot.updateSpotDetailCheckInIncremental > POST delete checkin with id ' + updatedCheckIn.get('id'));
					customerIndex = store.indexOf(dirtyCheckIn);
					store.remove(dirtyCheckIn);
					//make sure to reload requests so stale ones are removed
					if(!detail.isRequestPanelHidden()) {
						requestCtr.loadRequests();
					}					

					//clear status panel if deleted checkin is activeCustomer or select another checkin
					if(me.getActiveCustomer() && updatedCheckIn.get('id') == me.getActiveCustomer().get('id')) {
						if(store.getCount() > 0) {
							if(store.getAt(customerIndex)) {
								customerList.select(customerIndex);	
							} else {
								customerList.select(customerIndex-1);
							}
							
						} else {
							me.setSpotdetailButtonsActive(false);
							orders.removeAll();
							me.setActiveCustomer(null);
							me.setActiveBill(null);
							me.updateCustomerStatusPanel();
							me.updateCustomerTotal();
							me.updateCustomerPaymentMethod();
						}
					}						
				}
			} else if(action = 'update-orders') {
				//update all orders
				if(me.getActiveCustomer() && me.getActiveCustomer().get('id') == updatedCheckIn.get('id')) {
						//select customer whos orders where updated							
						// me.getSpotDetailCustomerList().select(me.getActiveCustomer());
						me.refreshActiveCustomerOrders();
				}
			}
			// }
		}
	},
	/**
	* Update the request list. Will be called when order, bill or checkin messages arrive.
	* @param action
	*	ignored
	* @param data
	*	ignored
	* @see EatSense.controller.Spot.loadRequests()
	*/
	updateRequests: function(action, data) {

		//TODO only load requests if it belongs to the active area!
		//currently not possible
		this.loadRequests();	
	},

	/**
	* Update the history list. Will be called when checkin messages arrive.
	* @param action
	*	
	* @param data
	*	
	* @see EatSense.controller.Spot.loadRequests()
	*/
	updateHistory: function(action, data) {

		if(action == 'delete' && data.status == appConstants.COMPLETE) {
			this.loadHistory();	
		}
	},

	/**
	*	Updates spotdetail view when a new/changed bill arrives.
	*
	*/
	updateSpotDetailBillIncremental: function(action, billData) {
		var		me = this,
				detail = this.getSpotDetail(),
				paymentLabel = detail.down('#paymentLabel'),
				paidButton = this.getPaidSpotDetailButton(),
				completeButton = this.getCompleteCheckInButton(),
				bill;

		//check if spot detail is visible
		if(!detail.isHidden()) {
			if(me.getActiveCustomer() && billData.checkInId == me.getActiveCustomer().get('id')) {
				bill = Ext.create('EatSense.model.Bill');
				bill.setData(billData);
				bill.setId(billData.id);
				//this is an already persistent object!
				bill.phantom = false;

				if(action == 'new') {
					this.setActiveBill(bill);
					// paidButton.setDisabled(false);
					// completeButton.setDisabled(true);
					me.updateCustomerPaymentMethod(bill.getPaymentMethod().get('name'));
				} else if (action == 'update') {
					//currently no action needed. update occurs when a bill is cleared
					//since we also receive a checkin delete method no further action required
				}
			}
		}
	},
	/**
	*	Updates spotdetail view with a new/changed order.
	*
	*/
	updateSpotDetailOrderIncremental: function(action, updatedOrder) {
		var		me = this,
				detail = me.getSpotDetail(),
				store = me.getSpotDetailOrderList().getStore(),
				oldOrder,
				statisticsLabel = detail.down('#total'),
				sum = 0,
				totalLabel = detail.down('#total');
		//Be careful! updatedOrder is not yet a model

		//check if spot detail is visible
		//and if the order belongs to current selected checkin		
		if(!detail.isHidden() && me.getActiveCustomer()) {
			if(updatedOrder.checkInId == me.getActiveCustomer().get('id')) {
				if(action == 'new') {
					
				} else if(action == 'update') {
					console.log('order id %s update channel message received', updatedOrder.id);
					oldOrder = store.getById(updatedOrder.id);
					//TODO set data and don't remove would be a better way. Test it!
					if(oldOrder) {
						// oldOrder.setData(updatedOrder);
						store.remove(oldOrder);
					} 
					store.add(updatedOrder);										
				}
				//update total sum 
				me.updateCustomerTotal(store.getData().items);
			}
		}
	},
	/**
	* Updates the business.
	* 
	*/
	updateBusinessIncremental: function(action, updatedBusiness) {

		//activate read-only mode because the business has been marked for deletion
		if(action == 'delete') {
			this.lockActions();			
		}

	},

	// end push message handlers

	// start view update methods

	/**
	*	Updates the status panel of selected customer in spotdetail view.
	*	@param checkIn
	*		contains the checkin information. If none provided, fields will be reseted.
	*/
	updateCustomerStatusPanel: function(checkIn) {
		var 	me = this,
				detail = me.getSpotDetail(),
				statusLabel = detail.down('#statusLabel'),
				checkInTimeLabel = detail.down('#checkInTime'),
				accountLabel,
				displayCheckInLocation = this.getDisplayCheckInLocation(),
				spotLabel,
				areaLabel,
				spotStore,
				areaStore,
				// areaFilters,
				spotFilters,
				spot,
				area,
				sum = 0;

		spotLabel = detail.down('#spotLabel');
		areaLabel = detail.down('#areaLabel');
		accountLabel = detail.down('#accountDetail');

		if(checkIn) {
			//render order status					
			statusLabel.getTpl().overwrite(statusLabel.element, checkIn.getData());
			checkInTimeLabel.getTpl().overwrite(checkInTimeLabel.element, {'checkInTime': checkIn.get('checkInTime')});
			if(displayCheckInLocation === true) {
				//show checkIn location info				
				spotStore = Ext.StoreManager.lookup('spotStore');
				areaStore = Ext.StoreManager.lookup('areaStore');

				//clear area and spot filters to get the records by Id

				//areaStore has currently no filters set
				// areaStore.suspendEvents();
				spotStore.suspendEvents();
				areaFilters = areaStore.getFilters();
				// areaStore.clearFilter(true);
				spotFilters = spotStore.getFilters();
				spotStore.clearFilter(true);

				spot = spotStore.getById(checkIn.get('spotId'));
				if(spot) {
					spotLabel.setHidden(false);
					spotLabel.getTpl().overwrite(spotLabel.element, {'spotName' : spot.get('name')});

					area = areaStore.getById(spot.get('areaId'));
					if(area) {
						areaLabel.setHidden(false);
						areaLabel.getTpl().overwrite(areaLabel.element, {'areaName' : area.get('name')});
					}
				}

				spotStore.setFilters(spotFilters);
				spotStore.filter();
				// areaStore.setFilters(areaFilters);			
				// areaStore.filter();
				// areaStore.resumeEvents();
				spotStore.resumeEvents();
			}

		} else {
			//pass dummy objects with no data
			statusLabel.getTpl().overwrite(statusLabel.element, {'spotName': ''});
			checkInTimeLabel.getTpl().overwrite(checkInTimeLabel.element, {'checkInTime' : ''});

			spotLabel.setHidden(true);
			// spotLabel.getTpl().overwrite(spotLabel.element, {'status': ''});
			areaLabel.setHidden(true);
			// areaLabel.getTpl().overwrite(areaLabel.element, {'areaName' : ''});
		}			
	},
	/**
	*	Updates the account panel of selected customer in spotdetail view.
	*   @param account
	*		contains account information, if no account provided clears the field
	*/
	updateCustomerAccountPanel: function(account) {
		var 	me = this,
				detail = me.getSpotDetail(),
				accountLabel;

		accountLabel = detail.down('#accountDetail');

		if(accountLabel) {
			if(account) {
				accountLabel.getTpl().overwrite(accountLabel.element, account);
			} else {
				accountLabel.getTpl().overwrite(accountLabel.element, {'email': ''});
			}	
		}
	},
	/**
	*	Updates the displayed total sum of selected customer in spotdetail view.
	*	@param orders
	*		all orders for the current checkin
	*/
	updateCustomerTotal: function(orders) {
		var 	me = this,
				detail = me.getSpotDetail(),
				totalLabel = detail.down('#total'),
				sum = 0;

		if(orders) {
			//if orders exist calculate total sum 
			try {
				Ext.each(orders, function(o) {
					if(o.get('status') != appConstants.Order.CANCELED) {
						sum += o.calculate();
					}					
				});
				sum = appHelper.roundPrice(sum);
			} catch(e) {
				console.log('failed calculating total price ' + e);
			}
			totalLabel.getTpl().overwrite(totalLabel.element, {'total': sum});	
		} else {
			totalLabel.getTpl().overwrite(totalLabel.element, {'total': sum});
		}
	},
	/**
	*	Displays the chose paymentMethod when a payment request is active.
	*	@param paymentMethod
	* 		if empty hides the payment label, otherwise shows the paymentMethod
	*/
	updateCustomerPaymentMethod: function(paymentMethod) {
		var		me = this,
				detail = this.getSpotDetail(),
				paymentLabel = detail.down('#paymentLabel');

				//check if spot detail is visible and if it is the same spot the checkin belongs to
		if(paymentMethod) {
			paymentLabel.getTpl().overwrite(paymentLabel.element, {'paymentMethod' : paymentMethod});
			paymentLabel.show();
		} else {
			paymentLabel.getTpl().overwrite(paymentLabel.element, {'paymentMethod' : ''});
			paymentLabel.hide();
		}
	},
	// end view update methods

	// start actions

	/**
	*	Marks a single order as confirmed. This indicates that the business received 
	*	the order and starts to process it.
	*
	*/
	confirmOrder: function(button, eventObj, eOpts) {
		var 	me = this,
				loginCtr = this.getApplication().getController('Login'),
				orderStore = Ext.StoreManager.lookup('orderStore'),
				order = button.getParent().getRecord(),
				prevStatus = order.get('status');

		if(order.get('status') == appConstants.Order.RECEIVED) {
			console.log('order already confirmed')
			//you can confirm an order only once
			return;
		};

		//update order status
		order.set('status', appConstants.Order.RECEIVED);
		order.getData(true);


		//same approach as in eatSense App. Magic lies in getRawJsonData()
		//model.save() doesn't work because unecessary data gets send
		//still kind of a workaround
		Ext.Ajax.request({			
    	    url: appConfig.serviceUrl+'/b/businesses/'+loginCtr.getAccount().get('businessId')+'/orders/'+order.getId(),
    	    method: 'PUT',
    	    jsonData: order.getRawJsonData(),
    	    scope: this,
    	    success: function(response) {
    	    	console.log('order confirmed');
    	    },
    	    failure: function(response) {
    	    	order.set('status', prevStatus);
    	    	me.getApplication().handleServerError({
						'error': response, 
						'forceLogout': {403: true}, 
						'hideMessage':false
						// 'message': i10n.translate('errorSpotDetailOrderSave')
				});
	   	    }
		});
	},
	/**
	* Marks a bill as paid.
	*
	*/
	confirmPayment: function(button, eventObj, eOpts){
		var	me = this,
			orderStore = Ext.StoreManager.lookup('orderStore'),
			customerStore = Ext.StoreManager.lookup('checkInStore'),
			unprocessedOrders,
			loginCtr = this.getApplication().getController('Login'),
			requestCtr = this.getApplication().getController('Request'),
			bill = this.getActiveBill(),
			customerList = this.getSpotDetailCustomerList(),
			checkInId = me.getActiveCustomer().getId(),
			customerIndex = customerStore.indexOf(me.getActiveCustomer());

		if(!bill) {
			appHelper.showNotificationBox('paidButton', 'payment.nobill.message', '20px', '20px');
			console.log('cannot confirm payment because no bill exists');
			return;
		}

		//check if all orders are processed
		unprocessedOrders = orderStore.queryBy(function(record, id) {
			if(record.get('status') == appConstants.Order.PLACED) {
				return true;
			}

		});

		if(unprocessedOrders.getCount() > 0 ) {
			Ext.Msg.alert(i10n.translate('hint'), i10n.translate('processOrdersFirst'), Ext.emptyFn);
		} else {
			bill.set('cleared', true);
			bill.save({
				params: {
					pathId: loginCtr.getAccount().get('businessId')
				},
				success: function(record, operation) {

					requestCtr.removeRequestsForCustomerById(checkInId);
					//although a message will be received we update the view directly					
					if(me.getActiveCustomer() && checkInId == me.getActiveCustomer().get('id')) {				
						//remove customer						
						customerStore.remove(me.getActiveCustomer());
						if(customerStore.getCount() > 0) {
							if(customerStore.getAt(customerIndex)) {
								customerList.select(customerIndex);	
							} else {
								customerList.select(customerIndex-1);
							}
						} else {
							orderStore.removeAll();
							me.setActiveCustomer(null);
							me.updateCustomerStatusPanel();
							me.updateCustomerTotal();
							me.updateCustomerPaymentMethod();
							me.setSpotdetailButtonsActive(false);
						}
						me.setActiveBill(null);	
						//update requests
						// requestCtr.loadRequests();
					}			
				},
				failure: function(record, operation) {
					console.log('saving bill failed');
					button.enable();
					me.getApplication().handleServerError({
						'error': operation.error,
						'forceLogout': {403: true}
						// 'message': i10n.translate('errorSpotDetailOrderSave')
					});
				}
			});			
		}

	},
	/**
	*	Marks a single order as canceled. 
	*
	*/
	cancelOrder: function(button, event, eOpts) {
		var 	me = this,
				loginCtr = this.getApplication().getController('Login'),
				orderStore = Ext.StoreManager.lookup('orderStore'),				
				order = button.getParent().getRecord(),
				prevStatus = order.get('status');

		if(order.get('status') == appConstants.Order.CANCELED) {
			console.log('order already canceled')
			//you can cancel an order only once
			return;
		};

		Ext.Msg.show({
			title: i10n.translate('hint'),
			message: i10n.translate('cancelOrderQuestion', order.get('productName')),
			buttons: [{
				text: i10n.translate('yes'),
				itemId: 'yes',
				ui: 'action'
			}, {
				text: i10n.translate('no'),
				itemId: 'no',
				ui: 'action'
			}],
			scope: this,
			fn: function(btnId, value, opt) {
				if(btnId == 'yes') {
					//update order status
					order.set('status', appConstants.Order.CANCELED);
					
					//same approach as in Cloobster App. Magic lies in getRawJsonData()
					//still kind of a workaround
					Ext.Ajax.request({				
			    	    url: appConfig.serviceUrl+'/b/businesses/'+loginCtr.getAccount().get('businessId')+'/orders/'+order.getId(),
			    	    method: 'PUT',    	    
			    	    jsonData: order.getRawJsonData(),
			    	    scope: this,
			    	    success: function(response) {
			    	    	console.log('order %s canceled', order.getId());
			    	    	me.updateCustomerTotal(orderStore.getData().items);
			    	    },
			    	    failure: function(response) {
			    	    	order.set('status', prevStatus);
		    	    		me.getApplication().handleServerError({
								'error': response, 
								'forceLogout': {403: true}, 
							});
				   	    }
					});
				}
			}
		});
	},
	/**
	*	Cancels all orders and removes customer from spot.
	*/
	cancelAll: function(button, event) {
		var 	me = this,
				loginCtr = this.getApplication().getController('Login'),
				requestCtr = this.getApplication().getController('Request'),
				orders = Ext.StoreManager.lookup('orderStore'),
				checkins = Ext.StoreManager.lookup('checkInStore'),
				checkInId = me.getActiveCustomer().getId(),
				customerList = this.getSpotDetailCustomerList(),
				prevStatus,
				customerIndex;

		if(!this.getActiveCustomer()) {
			return;
		}

		Ext.Msg.show({
			title: i10n.translate('hint'),
			message: i10n.translate('cancelAllOrders'),
			buttons: [{
				text: 'Ja',
				itemId: 'yes',
				ui: 'action'
			}, {
				text: 'Nein',
				itemId: 'no',
				ui: 'action'
			}],
			scope: this,
			fn: function(btnId, value, opt) {
				if(btnId=='yes') {
					customerIndex = checkins.indexOf(me.getActiveCustomer());

					if(customerIndex < 0) {
						return;
					}

					me.getActiveCustomer().erase({
						callback: function(records, operation) {
							if(!operation.success) {
								me.getApplication().handleServerError({
									'error': operation.error,
									'forceLogout': {403: true}
								});
							} else {
								requestCtr.removeRequestsForCustomerById(checkInId);
								//although a message will be received we update the view directly
								if(me.getActiveCustomer() && checkInId == me.getActiveCustomer().get('id')) {					
									checkins.remove(me.getActiveCustomer());
									if(checkins.getCount() > 0) {
										if(checkins.getAt(customerIndex)) {
											customerList.select(customerIndex);	
										} else {
											customerList.select(customerIndex-1);
										}								
									} else {
										orders.removeAll();
										me.setActiveCustomer(null);
										me.setActiveBill(null);
										me.updateCustomerStatusPanel();
										me.updateCustomerTotal();
										me.updateCustomerPaymentMethod();
										me.setSpotdetailButtonsActive(false);
									}
								}
							}					
						}
					});
				}
			}
		});		

	},
	/**
	*	Confirms all open orders for active customer.
	*/
	confirmAll: function(button, event) {
		var me = this,
			orderStore = Ext.StoreManager.lookup('orderStore'),
			loginCtr = this.getApplication().getController('Login'),
			unprocessedOrders;

		if(!this.getActiveCustomer()) {
			console.log('confirm all not possible: no active customer.');
			return;
		}

				//check if all orders are processed
		unprocessedOrders = orderStore.queryBy(function(record, id) {
			if(record.get('status') == appConstants.Order.PLACED) {
				return true;
			}
		});

		if(unprocessedOrders.getCount() > 0) {
			Ext.Ajax.request({				
	    	    url: appConfig.serviceUrl+'/b/businesses/'+loginCtr.getAccount().get('businessId')+'/checkins/'+this.getActiveCustomer().getId()+'/cart',
	    	    method: 'PUT',
	    	    jsonData: {}, //empty object needed, otherwise 411 gets thrown
	    	    success: function(response) {
	    	    	console.log('all orders confirmed');
	    	    	orderStore.queryBy(function(order){
						if(order.get('status') == appConstants.Order.PLACED) {
							return true;
						}
					}).each(function(order) {
						order.set('status', appConstants.Order.RECEIVED);
					});
	    	    },
	    	    failure: function(response) {
	    	    	me.getApplication().handleServerError({
							'error': response, 
							'forceLogout': {403: true}, 
							'hideMessage':false
					});
		   	    }
			});
		}

	},
	/**
	*	Shows a list of all available spots.
	*	A select triggers switchSpot.
	*/
	showSpotSelection: function(button, event) {
		var 	me = this,
				spotStore = Ext.StoreManager.lookup('spotStore'),
				spotSelectionDlg = this.getSpotSelectionDialog(),
				spotList = this.getSwitchSpotList(),
				filteredSpots;

		//don't show active spot
		// filteredSpots = spotStore.queryBy(function(record, id) {
		// 	if(record.getId() != me.getActiveSpot().getId()) {
		// 		return true;
		// 	}
		// });
		// spotList.setData(filteredSpots);

		// filteredSpots.each(function(spot) {
		// 	spotList.add(spot);	
		// });
		spotSelectionDlg.showBy(button, 'tr-bc?');
	},
	/**
	*	Switch user to another table.	
	*
	*/
	switchSpot: function(list, record, options) {
		var 	me = this,
				activeCustomer = this.getActiveCustomer(),
				loginCtr = this.getApplication().getController('Login'),
				requestCtr = this.getApplication().getController('Request'),
				//cache customer nickname, to prevent usage name of a new active customer
				cusomerNickname = activeCustomer.get('nickname'),
				spotName = record.get('name');

		if(activeCustomer) {
			//set new spot id
			activeCustomer.set('spotId', record.get('id'));
			activeCustomer.save({
				params: {
					pathId: loginCtr.getAccount().get('businessId')
				},
				success: function(record, operation) {
					//TODO refactor!
					// requestCtr.loadRequests();
				},
				failure: function(record, operation) { 
					me.getApplication().handleServerError({
						'error': operation.error,
						'forceLogout': {403: true}
					});
				}
			});

			//show success message to give user the illusion of success ;)
			Ext.Msg.show({
				title : i10n.translate('hint'),
				message : i10n.translate('switchSpotMessage', cusomerNickname, spotName),
				buttons : []
			});
			
			Ext.defer((function() {
				Ext.Msg.hide();
			}), appConfig.msgboxHideLongTimeout, this);

		}

		//deselect items
		list.deselectAll();
		//hide dialog
		list.getParent().hide();
		//prevent list selection
		return false;
	},
	/**
	* Handler for a tab change when switching areas. Filters the store so that
	* only spots and requests of this area are shown.
	*/
	areaChanged: function(container, newTab, oldTab) {
		var spotStore = Ext.StoreManager.lookup('spotStore');

		console.log('tab changed');
		if(!oldTab || newTab.getId() != oldTab.getId()) {
			if(spotStore.getFilters().length > 0 && oldTab && oldTab.getAreaFilter()) {
				spotStore.getData().removeFilters([oldTab.getAreaFilter()]);
			};

			spotStore.filter(newTab.getAreaFilter());
			//Bug? Call filter again, because sometimes it isn't filtered directly.
			spotStore.filter();

			this.setActiveArea(newTab.getArea());
			this.updateRequests();
			this.loadHistory();

			newTab.down('dataview').refresh();
			newTab.tab.setBadgeText("");
		}
	},

	/**
	* Event handler for itemTap on RequestItem.
	* Opens spot details and selects the correct checkin.
	*/
	requestItemTapped : function(dataview, index, item, record) {
		var spotStore = Ext.StoreManager.lookup('spotStore'),
			spotToShow;

		spotToShow = spotStore.getById(record.get('spotId'));

		if(spotToShow) {
			this.showSpotDetails(spotToShow, record.get('checkInId'));
		} else {
			//handle error
		}

	},
	/**
	* Event handler for itemTap on HistoryItem.
	* Shows checkIn and all orders belonging to this HistoryItem.
	*/
	historyItemTapped: function(dataview, index, item, history) {
		console.log('historyItemTapped');
		var	me = this,
			detail = this.getHistoryDetail(),
			infoPanel = detail.down('#infoPanel'),
			// checkInList = detail.down('#checkInList'),
			//see SpotItem for details why button.oRec is called
			// data = button.getParent().getRecord(),			
			checkInStore = Ext.StoreManager.lookup('checkInStore'),
			titlebar = detail.down('titlebar'),
			orderStore = detail.down('dataview').getStore();
				

		//load account data
		this.loadAccountByCheckIn(history.get('checkInId'), loadAccountSuccess);

		function loadAccountSuccess(success, account) {
			if(success) {
				infoPanel.getTpl().overwrite(infoPanel.element, Ext.merge({}, history.getData(), {'email': account.email}));
			} else {
				infoPanel.getTpl().overwrite(infoPanel.element, Ext.merge({}, history.getData(), {'email': i10n.translate('spotdetail.account.anonymous')}));
			}
		}

		orderStore.load({
			params: {
				checkInId: history.get('checkInId')
			},
			 callback: function(records, operation, success) {
			 	if(success) {
			 		// Ext.Array.each()
			 		Ext.Array.each(records, function(order, index) {
			 			order.calculate();
			 		});
			 	} else {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true}, 
						'hideMessage':false
					});
			 	}
			 }
		});

		//show detail view
		Ext.Viewport.add(detail);
		detail.show();
	},
	/**
	* Close history detail.
	*/
	closeHistoryDetail: function(button) {
		this.getHistoryDetail().hide();
	},
	// end actions

	// start misc actions
	/**
	*	Close spot detail.
	*
	*/
	closeSpotDetail: function(button) {
		this.getSpotDetail().hide();
	},

	/**
	*	Called when spotdetail panel gets hidden.
	*	This is a place to cleanup the panel.
	*/
	hideSpotDetail: function(spotdetail) {
		var		messageCtr = this.getApplication().getController('Message'),
				requestCtr = this.getApplication().getController('Request'),
				requestStore = Ext.StoreManager.lookup('requestStore');

		this.getSpotDetailCustomerList().deselectAll();	
		this.getSpotDetailOrderList().getStore().removeAll();
		requestStore.removeAll(true);
		this.updateCustomerStatusPanel();
		this.updateCustomerTotal();
		this.updateCustomerAccountPanel();
		this.setActiveSpot(null);
		this.setActiveCustomer(null);
		this.setActiveBill(null);
		//disable all buttons
		this.setSpotdetailButtonsActive(false);

		spotdetail.showRequestsPanel();
		this.setDisplayCheckInLocation(false);

		messageCtr.un('eatSense.checkin', this.updateSpotDetailCheckInIncremental, this);
		messageCtr.un('eatSense.order', this.updateSpotDetailOrderIncremental, this);
		messageCtr.un('eatSense.request', requestCtr.updateSpotDetailOrderIncremental, requestCtr);
		messageCtr.un('eatSense.refresh-all', this.refreshActiveCustomerOrders, this);
		messageCtr.un('eatSense.refresh-all', this.refreshActiveCustomerPayment, this);
		messageCtr.un('eatSense.refresh-all', this.refreshActiveSpotCheckIns, this);
	},

	/**
	* @private
	* Show event handler. Adds event listeners from message controller.
	*/
	showSpotDetail: function(spotdetail) {
		var	messageCtr = this.getApplication().getController('Message'),
			requestCtr = this.getApplication().getController('Request');

		//add listeners for channel messages
		messageCtr.on('eatSense.checkin', this.updateSpotDetailCheckInIncremental, this);
		messageCtr.on('eatSense.order', this.updateSpotDetailOrderIncremental, this);
		messageCtr.on('eatSense.bill', this.updateSpotDetailBillIncremental, this);
		messageCtr.on('eatSense.request', requestCtr.processCustomerRequest, requestCtr);
		//refresh all is only active when push communication is out of order
		messageCtr.on('eatSense.refresh-all', this.refreshActiveSpotCheckIns, this);
	},

	/**
	* Activated for deleted businesses so that only the current state can be viewed.
	* But no actions are allowed.
	*/
	lockActions: function() {
		var lockedButtons = this.getSpotDetail().query('lockbutton');

		Ext.Array.each(lockedButtons, function(button) {
			button.lock();
		});

		Ext.Msg.alert(i10n.translate('hint') ,i10n.translate('spot.locked'));
	},
	/**
	* Activated for deleted businesses so that only the current state can be viewed.
	* But no actions are allowed.
	*/
	unlockActions: function() {
		var lockedButtons = this.getSpotDetail().query('lockbutton');

		Ext.Array.each(lockedButtons, function(button) {
			button.unlock();
		});
	},
	/**
	* Called for every spotdetailitem on event updatedata.
	*/
	showSpotDetailItem: function(item) {
		var lockedButtons = item.query('lockbutton'),
			business = this.getApplication().getController('Login').getBusiness();

		if(business.get('trash')) {
			Ext.Array.each(lockedButtons, function(button) {
				item.remove(button);
			});			
		}
	},
	/**
	* Filter spots based on checked radio button value.
	*/
	filterSpotsRadio: function(radio) {
		var store = Ext.StoreManager.lookup('spotStore'),
			panel = this.getFilterPanel();

		if(radio.getSubmitValue() == 'none') {
			console.log('apply filter none');
			//only remove the active filter. clearFilter() would also remove the areaId filter
			store.getData().removeFilters([this.spotActiveFilterFn]);
			//actually removeFilters calls filter() on the store but this had no effect
			store.filter();
			this.showSpotView();
		} else if(radio.getSubmitValue() == 'active') {
			console.log('apply filter active');
			store.filterBy(this.spotActiveFilterFn);
			this.showSpotView();
		};

		panel.hide();
	},

	sortRequestRadio: function(radio) {
		var store = Ext.StoreManager.lookup('defRequestStore'),
			panel = this.getRequestSortPanel();

		if(radio.getSubmitValue() == 'requests-asc') {
			store.sort('receivedTime' , 'ASC');
		} else if(radio.getSubmitValue() == 'requests-desc') {
			store.sort('receivedTime' , 'DESC');
		} else {
			console.log('wrong sort value received.')
		};

		panel.hide();
	},
	/**
	* Show spot view.
	*
	*/
	showSpotView: function() {
		var container = this.getMainview().getActiveItem(),
			spotFilterButton = container.down('button[action=show-filter]'),
			requestSortButton = container.down('button[action=show-request-sort]');;
		
		spotFilterButton.show();
		requestSortButton.hide();
		// container.getLayout().setAnimation({
		// 	type : 'slide',
		// 	direction : 'right'
		// });
		//switch to request view
		container.setActiveItem(0);
	},

	/**
	* Show request view.
	*/
	showRequestView: function() {
		var me = this,
			container = this.getMainview().getActiveItem(),
			requestDataview = this.getRequestDataview(),
			spotFilterButton = container.down('button[action=show-filter]'),
			requestSortButton = container.down('button[action=show-request-sort]');

		spotFilterButton.hide();
		requestSortButton.show();
		// container.getLayout().setAnimation({
		// 	type : 'slide',
		// 	direction : 'left'
		// });
		//switch to request view
		container.setActiveItem(1);
	},
	/**
	* Action for show history view button.
	*
	*/
	showHistoryView: function() {
		var me = this,
			container = this.getMainview().getActiveItem(),
			spotFilterButton = container.down('button[action=show-filter]'),
			requestSortButton = container.down('button[action=show-request-sort]');

		spotFilterButton.hide();
		requestSortButton.hide();
		container.setActiveItem(2);
	},
	/**
	* Filter method.
	* Returns true for spots with status ORDER_PLACED, PAYMENT_REQUEST or CALL_WAITER.
	* False otherwise.
	* @param spot
	*	spot to filter
	*/
	spotActiveFilterFn: function(spot) {
		if(spot.get('status') == appConstants.ORDER_PLACED ||
			spot.get('status') == appConstants.PAYMENT_REQUEST ||
			spot.get('status') == appConstants.Request.CALL_WAITER) {
			return true;
		}
	},
	/**
	* Shows the filter panel next to filter button.
	*/
	showFilterPanel: function(button) {
		var panel = this.getFilterPanel();

		panel.showBy(button);
	},
	/**
	* Shows the request sort panel next to the button.
	*/
	showRequestSortPanel: function(button) {
		var panel = this.getRequestSortPanel();

		panel.showBy(button);
	},

	/**
	* Enables/disables all spotdetail action buttons.
	* @param active
	*	true = enabled | false = disabled
	*/
	setSpotdetailButtonsActive: function(active) {
		var detail = this.getSpotDetail();

		try {
			var nestedButtons = null;
			detail.down('button[action=switch-spot]').setDisabled(!active);
			detail.down('button[action=paid]').setDisabled(!active);			
			detail.down('button[action=cancel-all]').setDisabled(!active);
			detail.down('button[action=confirm-all]').setDisabled(!active);
			detail.down('button[action=complete-checkin]').setDisabled(!active);
		} catch(e) {
			console.log(e);
		}
	},
	/**
	* Start a task running all appConfig.requestTimeCalcRefreshInterval ms
	* which refreshes elapsed time for request items in request view.
	*
	*/
	startRequestRefreshTask: function() {
		var me = this,
			task;
		//update elapsed time in request view
 		task = function(delay) {

			delayedTask = Ext.create('Ext.util.DelayedTask', function() {
				if(me.getMainview().getActiveItem() && me.getMainview().getActiveItem().down('#requestDataview')) {
					// console.log('Spot.loadAreas > run task');
					me.getMainview().getActiveItem().down('#requestDataview').refresh();
				} else {
					console.log('Spot.loadAreas > could not refresh request view times. Try again in ' + e);
				}
    			task(delay);
			});

			me.setRefreshRequestTask(delayedTask);

			delayedTask.delay(delay);
		}

		task(appConfig.requestTimeCalcRefreshInterval);
	},
	/**
	* Stops the request refresh task.
	* @see Spot.startRequestRefreshTask
	*/
	stopRequestRefreshTask: function() {
		try {
			this.getRefreshRequestTask().cancel();
		} catch(e) {
			console.log('Spot.stopRequestRefreshTask > failed to stop');
		}
		
	},
	/**
	* Tap event handler for info button.
	* Shows a notification window.
	*/
	infoButtonTapped: function(button) {

		appHelper.showNotificationBox(i10n.translate('info'), i10n.translate('app.information', appConfig.version), "5%", "3%", true, true);

	},
	// end misc actions

	//start complete checkin logic
	/**
	* Tap event handler for complete checkin buttons.
	* Shows a dialog with available payments to manually complete this checkin.
	*/
	showCompleteCheckInDialog: function(button) {
		var me = this,
			dialog = this.getCompleteCheckInDialog(),
			paymentList = dialog.down('list'),
			business = this.getApplication().getController('Login').getBusiness(),
			orderStore = Ext.StoreManager.lookup('orderStore'),
			bill = this.getActiveBill(),
			logPrefix = 'Spot.showCompleteCheckInDialog > ';


		if(!business) {
			console.log(logPrefix + 'no business set in Login Controller');
		};

		if(!this.getActiveCustomer()) {
			console.log(logPrefix + 'no active customer');
			return;
		};

		if(orderStore.getCount() == 0) {
			appHelper.showNotificationBox('spotdetail.checkin.complete', 'complete.noorders.message', '20px', '20px');
			console.log(logPrefix + 'cannot complete checkin for customer without orders');
			return;	
		};

		if(bill) {
			appHelper.showNotificationBox('spotdetail.checkin.complete', 'complete.bill.message', '20px', '20px');
			console.log('Spot.showCompleteCheckInDialog > Can\'t complete checkin since a bill already exists.');
			return;
		}	

		paymentList.setStore(business.payments());
		paymentList.refresh();

		dialog.showBy(button, 'tl-bc?');
		
	},
	/**
	* Show confirm dialog and confirm checkin on 'yes'.
	*/
	completeCheckIn: function(list, record, options) {
		var me = this,
			dialog = this.getCompleteCheckInDialog(),
			newBill,
			billRawData,
			completeButton = this.getCompleteCheckInButton(),
			loginCtr = this.getApplication().getController('Login'),
			errMsg,
			orderStore = Ext.StoreManager.lookup('orderStore'),
			logPrefix = 'Spot.showCompleteCheckInDialog > ',
			notificationCtr = this.getApplication().getController('Notification');


		list.deselectAll();
		dialog.hide();

		//remove duplicate check. Already done in showCompleteCheckInDialog?
		if(!this.getActiveCustomer()) {
			console.log(logPrefix + 'no active customer');
			return;
		};

		if(orderStore.getCount() == 0) {			
			console.log(logPrefix + 'cannot complete checkin for customer without orders');
			return;	
		};

		Ext.Msg.show({
			title: i10n.translate('hint'),
			message: i10n.translate('completecheckin.confirm.msg', record.get('name')),
			buttons: [{
				text: i10n.translate('yes'),
				itemId: 'yes',
				ui: 'action'
			}, {
				text: i10n.translate('no'),
				itemId: 'no',
				ui: 'action'
			}],
			scope: this,
			fn: function(btnId, value, opt) {
				if(btnId == 'yes') {
					newBill = Ext.create('EatSense.model.Bill', {
						'checkInId' : me.getActiveCustomer().get('id')						
					});
					newBill.set('id', '');
					// newBill.setPaymentMethod(record);
					billRawData = newBill.getData();

					billRawData.paymentMethod = {
						name: record.get('name')
					};
					//WHAT A FUCKING SENCHA MESS
					//cleanup object for backend
					// delete billRawData.bill_id;
					// delete billRawData.paymentMethod.id;
					// delete billRawData.paymentMethod.business_id;
					// delete billRawData.paymentMethod.bill_id;
					// delete billRawData.paymentMethod.xindex;

					if(notificationCtr) {
						notificationCtr.addCompletedCheckIn(me.getActiveCustomer().get('id'));
					}

					//do it the manual way
					Ext.Ajax.request({
						url: appConfig.serviceUrl+'/b/businesses/'+loginCtr.getAccount().get('businessId')+'/bills/',
			    	    method: 'POST',
			    	    jsonData: billRawData,
			    	    scope: this,
			    	    success: function(response) {
			    	    				    	    	
			    	    },
			    	    failure: function(response) {			    	    	
			    	    	//422 Unprocessable Entity (WebDAV; RFC 4918)
							//The request was well-formed but was unable to be followed due to semantic errors
			    	    	if(response.status == 422) {
			    	    		
			    	    		errMsg = i10n.translate('completecheckin.error.noorders');
			    	    	};

		    	    		me.getApplication().handleServerError({
								'error': response, 
								'forceLogout': {403: true},
								'message': errMsg || null
							});

							notificationCtr.removeCompletedCheckIn(me.getActiveCustomer().get('id'));
				   	    }
					});
					
				}
			}
		});

	},
	/**
	* Returns a spot status data object based on the local status.
	* Attention!! Only checkInCount is set. To set satus for each checkIn we would have to load its orders.
	* Added on 12.12.2012 as solution to Ticket 318
	*
	* @return
	*	spotData as raw json object
	*/
	getLocalSpotStatusData: function(id, checkInStore, requestStore) {
		var spotStatus = {},
			statusCompare = {},
			// 	appConstants.CALL_WAITER : 100,
			// 	appConstants.PAYMENT_REQUEST : 50,
			// 	appConstants.ORDER_PLACED : 10
			// },
			newStatus,
			currentStatus = 0;

		statusCompare[appConstants.CALL_WAITER] = 100;
		statusCompare[appConstants.PAYMENT_REQUEST] = 50;
		statusCompare[appConstants.ORDER_PLACED] = 10;
		statusCompare[appConstants.CHECKEDIN] = 1;

		if(!checkInStore) {
			console.log('Spot.getLocalSpotStatusData: no checkInStore provided');
		}

		if(!id) {
			console.log('Spot.getLocalSpotStatusData: no id provided');
		}

		spotStatus.id = id;
		spotStatus.checkInCount = checkInStore.getCount();

		if(checkInStore.getCount() > 0) {
			spotStatus.status = appConstants.CHECKEDIN;
		}

		if(requestStore.getCount() > 0) {
			spotStatus.status = appConstants.Request.CALL_WAITER;
		} else {
			checkInStore.each(function(checkIn, index) {
				if(checkIn.get('status') && statusCompare[checkIn.get('status')]) {
					newStatus = statusCompare[checkIn.get('status')] || 0;
					if(newStatus > currentStatus) {
						currentStatus = newStatus;
						spotStatus.status = checkIn.get('status');
					}
				}
			});
		}
	
		return spotStatus;		
	},
	/**
	* If action is inactive, ask user if he wants to process
	* inactive checkins.
	* @param {String} action
	* @param {Object} data
	*/
	processInactiveCheckins: function(action, data) {
		var me = this;
		//TODO deal with read only mode?
		if(action == 'inactive') {
			Ext.Msg.show({
				title: i10n.translate('checkins.inactive.message.title'),
				message: i10n.translate('checkins.inactive.message.text'),
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
						//load inactive checkins
						me.loadAndShowInactiveCheckIns();
					}
				}
			});			
		}	
	},
	/**
	* Loads inactive checkins and displays them in SpotDetail view.
	*
	*/
	loadAndShowInactiveCheckIns: function() {
		var	me = this,
			loginCtr = this.getApplication().getController('Login'),
			detail = me.getSpotDetail(),
			checkInStore = Ext.StoreManager.lookup('checkInStore'),
			restaurantId = loginCtr.getAccount().get('businessId'),
			titlebar = detail.down('titlebar');
		
		//don't show request panel for inactice checkin view
		detail.hideRequestsPanel();

		
		//TODO enclosing divs area for chrome cutting of the titles, fixed in 2.1
		titlebar.setTitle('<div>' + i10n.translate('checkins.inactive.title') + '</div>');

		this.setDisplayCheckInLocation(true);

		//load checkins and orders and set lists
		checkInStore.load({
			params: {
				pathId: restaurantId,
				inactive: true
			},
			 callback: function(records, operation, success) {
			 	if(success) {
			 		if(records.length > 0) {
						//selects the first customer. select event of list gets fired and calls showCustomerDetail	 	
			 			me.getSpotDetailCustomerList().select(0);	
			 		}
			 	} else {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': {403: true},
						'hideMessage':false
					});
			 	}			
			 },
			 scope: this
		});

		//show detail view
		Ext.Viewport.add(detail);
		detail.show();
	},
	/**
	* Try to load checkIn from store.
	* @param {String} checkInId
	*	Id of checkIn
	* @return checkIn if one is found. null otherwise
	*/
	getCheckinInStore: function(checkInId) {
		var checkInStore = Ext.StoreManager.lookup('checkInStore'),
			foundCheckIn = null;

		if(!checkInId) {
			console.log('Spot.getCheckinInStore: no id given');
			return null;
		}

		foundCheckIn = checkInStore.getById(checkInId);

		return foundCheckIn;
	}



	//end complete checkin logic

})