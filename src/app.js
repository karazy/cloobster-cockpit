Ext.Loader.setConfig({
	enabled : true,
    //WORKAORUND related to Android 3x Bug and Webview URL handling
    disableCaching: true //EatSense.util.Configuration.disableCaching
});

Ext.Loader.setPath('EatSense', 'app');

Ext.application({
	name : 'EatSense',
	controllers : ['Login','Spot', 'Message', 'Request', 'Notification'],
	models : ['AppState', 'Account', 'Area', 'Spot', 'Business', 'CheckIn', 'Order', 
        'Product', 'Choice', 'Option', 'Bill', 'PaymentMethod', 'Request', 'History'],
	views : ['Login', 'ChooseBusiness', 'Main'], 
	stores : ['Account', 'AppState', 'Area',  'Spot', 'Business', 
        'CheckIn', 'Order', 'Bill', 'Request', 'DefaultRequest', 'History' ],
	requires: [
		//require most common types
		'Ext.Container',
		'Ext.Panel',
		'Ext.dataview.List',
		'Ext.Label',
		'Ext.TitleBar',
        'Ext.MessageBox',
        'Ext.DateExtras',
        //util
        'EatSense.util.Constants',
        'EatSense.util.Configuration',
        'EatSense.util.Helper',
        'EatSense.util.Translations',
        'EatSense.util.Localization',
        'EatSense.util.Channel',
		//require custom types
        'EatSense.override.CustomJsonWriter',
		'EatSense.data.proxy.CustomRestProxy',
		'EatSense.data.proxy.OperationImprovement',
        'EatSense.data.LockButton'],
	icon: {
		//used on iOS devices for homescreen
		'57': 'res/images/icon-57.png',
   		'72': 'res/images/icon-72.png',
   		'114': 'res/images/icon-114.png',
        '144': 'res/images/icon-144.png'
	},
	glossOnIcon: false,

	init : function() {
		
	},
	launch : function() {
        var oldOnError = window.onerror,
            undefinedErrorCount = 0,
            messageCtr = this.getApplication().getController('Message');

        //register for software update messages
        messageCtr.on('eatSense.application', function(action, data) {
            if(action == 'update') {
                this.showApplicationUpdateMessage();
            }
        }, this);

        // Destroy the #appLoadingIndicator and #cloobsterLoadingText elements
        Ext.fly('appLoadingWrapper').destroy();

        //On some devices. Sometimes MsgBoxes disappear behind other floating panels.
        //Give the message box a high zIndex to prevent hidden alerts!
        Ext.Msg.defaultAllowedConfig.zIndex = 100;

    	console.log('launch cockpit ...');
        //if not a touch device show message
        if(Ext.os.deviceType.toLowerCase() == 'desktop') {
            Ext.create('Ext.MessageBox', {
                modal: false,
                // 'title': i10n.translate('hint'),
                'message' : i10n.translate('general.help.scrolling'),
                buttons: [],
                top: '10px',
                right: '110px',
                style: 'font-size:0.6em;'
            }).show();
        }

        if(appConfig.debug) {        
            (function() {
                var exLog = console.log,
                    debugConsole,
                    date;
                console.log = function(msg) {
                    exLog.apply(this, arguments);
                    debugConsole = Ext.getCmp('debugConsole');
                    if(debugConsole) {
                        date = new Date();
                        debugConsole.setHtml(debugConsole.getHtml() + '<br/>' + Ext.Date.format(date, 'Y-m-d H:i:s') + ' -> ' + msg);
                        debugConsole.getScrollable().getScroller().scrollToEnd();
                    }                
                };
            })();
            console.log('Debug mode active!');
        }


        // Override previous handler.
        window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
            if (oldOnError)
                // Call previous handler.
                return oldOnError(errorMsg, url, lineNumber);

            if (typeof url === "undefined" && lineNumber === 0) {
                console.log("app.onError: undefined error received count="+undefinedErrorCount);
                if(++undefinedErrorCount > 10) {
                    // Diplay error message and reload after user confirmed.
                    Ext.Msg.show({
                        title: i10n.translate('error'),
                        message: i10n.translate('error.critical'),
                        buttons: [{
                            text: i10n.translate('ok'),
                            itemId: 'ok',
                            ui: 'action'
                        }],
                        scope: this,
                        fn: function(btnId) { 
                            window.location.reload();
                        }
                    });

                }
            }
            else {
                console.log("onError: " + errorMsg + ", url: "+ url + ", lineNumber: " + lineNumber);  
            }

            // Just let default handler run.
            return false;
        }


	   	var loginCtr = this.getController('Login');

	   	//try to restore credentials
	   	//if it fails will display the login mask
	   	loginCtr.restoreCredentials();
	},
    /**
    * Sencha update event when cache manifest indicates an update.
    */
    onUpdated: function() {
        console.log('update found');
        Ext.Msg.show({
            title: i10n.translate('update.ready'),
            message: i10n.translate('update.ready.message'),
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
            fn: function(btnId) { 
                if(btnId == 'yes') {
                    window.location.reload();    
                }
            }
        });
    },
    /**
    * Shows a message window explaning the update procedure to the customer.
    *
    */
    showApplicationUpdateMessage: function() {
        Ext.Msg.alert(i10n.translate('hint'), i10n.translate('update.available'));
    },
    //Global utility methods
    /**
    *   Gloabl handler that can be used to handle errors occuring from server requests.
    *   @param options
    *       Configuration object
    *      
    *       error: error object containing status and statusText.
    *       forceLogout: a critical permission error occured and the checkIn will be terminated
    *       true to logout on all errors 
    *       OR
    *       {errorCode : true|false} e.g. {403: true, 404: false}
    *       hideMessage: true if you don't want do display an error message or map with errorcodes {403: true, 404: false}
    *       message: message to show. If no message is set a default message will be displayed.
    *       can be either a common message for all status codes or a specialized message
    *       {403: 'message 1', 404: 'message 2'}
    */
    handleServerError: function(options) {
        var    errMsg,
               nestedError,
               error = options.error,
               forceLogout = options.forceLogout,
               hideMessage = options.hideMessage,
               message = options.message,
               code = error.status,
               defaultErrorKey = null;

        if(error && typeof error.status == 'number') {
            console.log('handle error: '+ error.status + ' ' + error.statusText);
            if(!hideMessage) {
                appHelper.toggleAlertActive(true);
            }
            switch(code) {
                case 403:
                  defaultErrorKey = 'errorPermission';
                  break;
                case 404:
                  defaultErrorKey = 'errorResource';
                  break;
                case 400: 
                  defaultErrorKey = 'errorResource';
                  break;
                case 0:
                  defaultErrorKey = 'errorCommunication';
                    break;
                default:
                  code = 500
                  defaultErrorKey = 'errorMsg';
                  break;
            };


            if(message && typeof message == "object" && message[code]) {
              errMsg = message[code];
            } else {
              try {
                nestedError = Ext.JSON.decode(error.responseText);
                errMsg = i10n.translate(nestedError.errorKey, nestedError.substitutions) || i10n.translate(defaultErrorKey);
              } catch (e) {
                  errMsg = (typeof message == "string") ? message : i10n.translate(defaultErrorKey);
              }
            }
            //handle checkIn logout                    
            if(forceLogout && (forceLogout[code] === true || forceLogout === true)) {
                this.fireEvent('statusChanged', appConstants.FORCE_LOGOUT);                        
            }
        };

        if(!hideMessage || (hideMessage && hideMessage[code] && hideMessage[code] !== true)) {
            Ext.Msg.alert(i10n.translate('errorTitle'), errMsg, function() {
                appHelper.toggleAlertActive(false);
            }); 
        }
    }
});

