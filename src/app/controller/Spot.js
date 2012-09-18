/**
*	Controlls actions for the spot view.
* 	- showing and updating status for spots (tables, rooms, ...)
*	- processing incoming orders, payment requests ...
*/
Ext.define('EatSense.controller.Spot', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Main', 'EatSense.view.SpotSelectionDialog', 
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
			forwardRequestViewButton: 'spotcard button[action=show-forward-requestview]',
			backHistoryViewButton: 'spotcard button[action=show-back-historyview]',
			historyDataview: 'spotcard #historyDataview',
			historyDetail: {
				selector: 'historydetailitem',
				xtype: 'historydetailitem',
				autoCreate: true
			},
			closeHistoryDetailButton: 'historydetailitem button[action=close]',
			activateSoundButton: 'main button[action=activate-sound]'
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
		 	activateSoundButton: {
		 		tap: 'activateNotificationSound'
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
		notificationSound : null,

		refreshRequestTask: null,
		soundInterval: null
	},

	init: function() {
		console.log('initializing Spot Controller');
		//add listeners for message events
		var messageCtr = this.getApplication().getController('Message'),
			loginCtr = this.getApplication().getController('Login');
		
		messageCtr.on('eatSense.spot', this.updateSpotIncremental, this);
		//refresh all is only active when push communication is out of order
		messageCtr.on('eatSense.refresh-all', this.loadSpots, this);

		messageCtr.on('eatSense.business', this.updateBusinessIncremental, this);

		loginCtr.on('eatSense.read-only', this.lockActions, this);
		loginCtr.on('eatSense.unlock', this.unlockActions, this);

		//update requests in request view
		messageCtr.on('eatSense.order', this.updateRequests, this);
		messageCtr.on('eatSense.request', this.updateRequests, this);
		messageCtr.on('eatSense.bill', this.updateRequests, this);
		messageCtr.on('eatSense.checkin', this.updateRequests, this);

		messageCtr.on('eatSense.checkin', this.updateHistory, this);
	},

	// start load and show data
	/**
	* Load all available areas and create tabs dynamically.
	*/
	loadAreas: function() {
		var me = this,
			areaStore = Ext.StoreManager.lookup('areaStore'),
			spotStore = Ext.StoreManager.lookup('spotStore'),
			defRequestStore = Ext.StoreManager.lookup('defRequestStore'),
			tabPanel = this.getMainview(),
			tab,
			carousel,
			areaFilter;

		areaStore.load({
			callback: function(records, operation, success) {
			 	if(!success) {
			 		me.getApplication().handleServerError({
						'error': operation.error, 
						'forceLogout': true, 
						'hideMessage':false
					});
			 	} else {
			 		//Create a custom tab for each service area
			 		areaStore.each(function(area, index) {
			 			areaFilter	= new Ext.util.Filter({
					    	root : 'data',
					    	property: 'areaId',
					    	value: area.get('id'),
					    	exactMatch: true
						});

			 			tab = Ext.create('EatSense.view.Spot', {
			 				title: area.get('name'),
			 				'area': area,
			 				'areaFilter' : areaFilter
			 			});

			 			//atach change listener to carousel
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

			 		//update elapsed time in request view
			 		var task = function(delay) {
						Ext.create('Ext.util.DelayedTask', function() {
			    			me.getMainview().getActiveItem().down('#requestDataview').refresh();
			    			task(delay);
						}).delay(delay);
					}
		
					task(appConfig.requestTimeCalcRefreshInterval);
			 	}			
			 }
		});

	},
	/**
	* Loads all requests displayed in request list view
	*/
	loadRequests: function() {
		var me = this,
			store = Ext.StoreManager.lookup('defRequestStore'),
			mainview = this.getMainview();
			// dataview = this.getRequestDataview();

		store.load({
			params: {
				'areaId' : this.getActiveArea().getId(),
				//simply load everything
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
					
					// dataview.refresh();
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
						'forceLogout': true, 
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

		me.initNotificationSound();
	},

	initNotificationSound: function() {
		var contentEl = this.getMainview().getContentEl(),
			audioEle = new Audio();
			audioEle.src = 'res/sounds/simple.mp3';
			this.getMainview().setHtml(audioEle);
			this.setNotificationSound(audioEle),
			me = this;	
			// 	audioEle = null;
			// 	me.initNotificationSound();
			// });
			//audioEle.play();
	},

	activateNotificationSound: function(button) {
		var sound = this.getNotificationSound();
		// var contentEl = this.getMainview().getContentEl();
		
		function playSound() {
			sound.load();
			sound.play();
		};

		if(!this.getSoundInterval()) {
			playSound();
			this.setSoundInterval(window.setInterval(playSound, 2000));	
			console.log("Trying to play sound every 2s.");
		}
		else {
			window.clearInterval(this.getSoundInterval());
			console.log("Stopping sound interval.");
		}


		//soundManager.play('notifySound');
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
			messageCtr = this.getApplication().getController('Message'),
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
		messageCtr.on('eatSense.checkin', this.updateSpotDetailCheckInIncremental, this);
		messageCtr.on('eatSense.order', this.updateSpotDetailOrderIncremental, this);
		messageCtr.on('eatSense.bill', this.updateSpotDetailBillIncremental, this);
		messageCtr.on('eatSense.request', requestCtr.processCustomerRequest, requestCtr);
		//refresh all is only active when psuh communication is out of order
		messageCtr.on('eatSense.refresh-all', this.refreshActiveSpotCheckIns, this);
		
		
		me.setActiveSpot(data);		
		titlebar.setTitle(data.get('name'));

		//load checkins and orders and set lists
		checkInStore.load({
			params: {
				pathId: restaurantId,
				spotId: data.get('id')
			},
			 callback: function(records, operation, success) {
			 	if(success) { 		
			 		requestCtr.loadRequests();
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
			loginCtr = this.getApplication().getController('Login'),
			orderStore = Ext.StoreManager.lookup('orderStore'),
			billStore = Ext.StoreManager.lookup('billStore'),				
			detail = me.getSpotDetail(),
			restaurantId = loginCtr.getAccount().get('businessId'),
			bill,
			paidButton = this.getPaidSpotDetailButton();
		
		if(!record) {
			return;
		}

		me.setActiveCustomer(record);
		me.getSpotDetail().fireEvent('eatSense.customer-update', false);

		this.refreshActiveCustomerOrders();
		this.refreshActiveCustomerPayment();
	},
	/**
	* @private
	* Loads all checkins for selected spot.
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
			orderStore = Ext.StoreManager.lookup('orderStore');

		if(!me.getActiveCustomer()) {
			console.log('no active customer');
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
			paidButton = this.getPaidSpotDetailButton();

		if(!me.getActiveCustomer()) {
			console.log('no active customer');
			return;
		}

		if(me.getActiveCustomer().get('status') == appConstants.PAYMENT_REQUEST) {
			paidButton.setDisabled(false);
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
			//make sure to hide payment method label
			me.updateCustomerPaymentMethod();
			paidButton.disable();
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

		//soundManager.play('notifySound');
		this.getNotificationSound().load();
		this.getNotificationSound().play();

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

		console.log('updateTabBadgeIncremental spot '+ updatedSpot.get('id') + ' name ' + updatedSpot.get('name') + ' status: ' + status);

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
	*	Updates spotdetail view when a checkIn change at this spot occurs.
	*
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
				updatedCheckIn = Ext.create('EatSense.model.CheckIn', updatedCheckIn),
				requestCtr = this.getApplication().getController('Request'),
				customerIndex;
				
		//check if spot detail is visible and if it is the same spot the checkin belongs to
		if(!detail.isHidden() && me.getActiveSpot()) {
			if(updatedCheckIn.get('spotId') == me.getActiveSpot().get('id')) {
				if(action == 'new') {
					store.add(updatedCheckIn);
					if(store.getCount() == 1) {
						//only one checkIn exists so set this checkIn as selected
						customerList.select(0);
					}
					//make sure to load new request so they exist
					requestCtr.loadRequests();
				} else if (action == 'update' || action == 'confirm-orders') {
					console.log('update checkin id %s with status %s', updatedCheckIn.id, updatedCheckIn.status);
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
						Ext.Msg.alert(i10n.translate('error'), i10n.translate('errorGeneralCommunication'), Ext.emptyFn);
					}
				} else if (action == "delete") {
					dirtyCheckIn = store.getById(updatedCheckIn.get('id'));

					if(dirtyCheckIn) {
						console.log('delete checkin with id ' + updatedCheckIn.get('id'));
						customerIndex = store.indexOf(dirtyCheckIn);
						store.remove(dirtyCheckIn);
						//make sure to load new request so they exist
						requestCtr.loadRequests();	

						//clear status panel if deleted checkin is activeCustomer or select another checkin
						if(me.getActiveCustomer() && updatedCheckIn.get('id') == me.getActiveCustomer().get('id')) {
							if(store.getCount() > 0) {
								if(store.getAt(customerIndex)) {
									customerList.select(customerIndex);	
								} else {
									customerList.select(customerIndex-1);
								}
								
							} else {
								me.getSpotDetail().fireEvent('eatSense.customer-update', true);
								orders.removeAll();
								me.setActiveCustomer(null);
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
			}
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

		//TODO only load requests if it belongs to the active area!
		//currently not possible
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
				bill;

				//check if spot detail is visible and if it is the same spot the checkin belongs to
		if(!detail.isHidden() && me.getActiveSpot()) {
			if(me.getActiveCustomer() && billData.checkInId == me.getActiveCustomer().get('id')) {
				bill = Ext.create('EatSense.model.Bill');
				bill.setData(billData);
				bill.setId(billData.id);
				//this is an already persistent object!
				bill.phantom = false;

				if(action == 'new') {
					this.setActiveBill(bill);
					paidButton.setDisabled(false);
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

		//check if spot detail is visible and if it is the same spot the checkin belongs to
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
		//set readonly in Request

		// this.getSpotDetail().fireEvent('eatSense.customer-update', this.getReadOnly());

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
				sum = 0;

		if(checkIn) {
			//render order status					
			statusLabel.getTpl().overwrite(statusLabel.element, checkIn.getData());
			checkInTimeLabel.getTpl().overwrite(checkInTimeLabel.element, {'checkInTime': checkIn.get('checkInTime')});
		} else {
			//pass dummy objects with no data
			statusLabel.getTpl().overwrite(statusLabel.element, {status: ''});
			checkInTimeLabel.getTpl().overwrite(checkInTimeLabel.element, {'checkInTime' : ''});
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
						'error': {
							'status': response.status,
							'statusText': response.statusText
						}, 
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
							me.getSpotDetail().fireEvent('eatSense.customer-update', true);
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
								'error': {
									'status': response.status,
									'statusText': response.statusText
								}, 
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
										me.updateCustomerStatusPanel();
										me.updateCustomerTotal();
										me.updateCustomerPaymentMethod();
										me.getSpotDetail().fireEvent('eatSense.customer-update', true);
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
							'error': {
								'status': response.status,
								'statusText': response.statusText
							}, 
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
		spotSelectionDlg.showBy(button, 'br-tc?');
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
					requestCtr.loadRequests();
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

		list.getParent().hide();
		//prevent list selection
		return false;
	},
	/**
	* Handler for a tab change when switching areas. Filters the store so that
	* only spots and requests of this area are shown.
	*/
	areaChanged: function(container, newTab, oldTab) {
		var spotStore = Ext.StoreManager.lookup('spotStore'),
			defRequestStore = Ext.StoreManager.lookup('defRequestStore');

		console.log('tab changed');
		if(!oldTab || newTab.getId() != oldTab.getId()) {
			if(spotStore.getFilters().length > 0 && oldTab && oldTab.getAreaFilter()) {
				spotStore.getData().removeFilters([oldTab.getAreaFilter()]);
			};
			// if(defRequestStore.getFilters().length > 0 && oldTab && oldTab.getAreaFilter()) {
			// 	defRequestStore.getData().removeFilters([oldTab.getAreaFilter()]);
			// };

			spotStore.filter(newTab.getAreaFilter());
			// defRequestStore.filter(newTab.getAreaFilter());
			//Bug? Call filter again, because sometimes it isn't filtered directly.
			spotStore.filter();
			// defRequestStore.filter();
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
		
		// titlebar.setTitle(data.get('name'));

		infoPanel.getTpl().overwrite(infoPanel.element, history.getData());

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
		this.setActiveSpot(null);
		this.setActiveCustomer(null);
		this.setActiveBill(null);
		this.getSpotDetail().fireEvent('eatSense.customer-update', false);		

		messageCtr.un('eatSense.checkin', this.updateSpotDetailCheckInIncremental, this);
		messageCtr.un('eatSense.order', this.updateSpotDetailOrderIncremental, this);
		messageCtr.un('eatSense.request', requestCtr.updateSpotDetailOrderIncremental, requestCtr);
		messageCtr.un('eatSense.refresh-all', this.refreshActiveCustomerOrders, this);
		messageCtr.un('eatSense.refresh-all', this.refreshActiveCustomerPayment, this);
		messageCtr.un('eatSense.refresh-all', this.refreshActiveSpotCheckIns, this);
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
		var container = this.getMainview().getActiveItem();
		
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
			requestDataview = this.getRequestDataview();

		// container.getLayout().setAnimation({
		// 	type : 'slide',
		// 	direction : 'left'
		// });
		//switch to request view
		container.setActiveItem(1);
	},
	/**
	* Action for request view forward button.
	*
	*/
	forwardRequestView: function() {
		var me = this,
			container = this.getMainview().getActiveItem();

		// container.getLayout().setAnimation({
		// 	type : 'slide',
		// 	direction : 'left'
		// });
		//switch to request view
		container.setActiveItem(2);
	},
	/**
	* Action for history view back button.
	*/
	backHistoryView: function() {
		var me = this,
			container = this.getMainview().getActiveItem(),
			requestDataview = this.getRequestDataview();

		// container.getLayout().setAnimation({
		// 	type : 'slide',
		// 	direction : 'right'
		// });
		//switch to request view
		container.setActiveItem(1);
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
	}

	// end misc actions

})