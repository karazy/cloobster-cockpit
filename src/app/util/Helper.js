Ext.define('EatSense.util.Helper', {
	requires: ['EatSense.util.Constants', 'EatSense.util.Configuration'],
	alternateClassName: ['appHelper'],
	requires: [],
	singleton: true,

	config: {
		alertActive: false
	},

	/**
	 * Shortens the given string (like substring). 
	 * 
	 * @param text
	 * 		Text to shorten
	 * @param length
	 * 		Length of returned string.
	 * @param appendDots
	 * 		Append 3 dots at the end. E. g. "Beef Burg..."
	 * @returns
	 * 		shortened string
	 */
	shorten : function(text, length, appendDots) {
		var _textLength = text.trim().length;
		if(_textLength > length) {
			return text.substring(0, length) + ((appendDots === true) ? "..." : "");
		} else {
			return text;
		}			
	},
	/**
	*	Checks if the given argument is of type function.
	*
	*/
	isFunction: function(functionToCheck) {
	 	var getType = {};
	 	return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
	},
	/**
	*	Rounds a price to number of given decimals.
	*	@param price
	*		Price to round
	*	@param decimal
	*		number of decimals, defaults to 2	
	*/
	roundPrice: function(price, decimal) {
		var 	_decimal = (decimal) ? decimal : 2,
				_factor = Math.pow(10, _decimal),
				_result;

		_result = Math.round(price*_factor)/_factor;

		return _result;
	},
	/**
	*	Takes a price and formats it in the configured currency
	*	@param price
	*		price to format
	*/
	formatPrice: function(price) {
		var 	priceRegExp = /([0123456789]+)\.([0123456789]*)/,
				fixedPrice,
				matcher = appConstants.Currency[appConfig.currencyFormat],
				formattedPrice = "";

		if(!price && price == null) {
			return;
		}		

		try {
			fixedPrice = price.toFixed(2);
			formattedPrice = fixedPrice.replace(priceRegExp, matcher);
		} catch(e) {
			console.log('price formatting failed reason:' + e);
		}


		return (formattedPrice != "") ? formattedPrice : price;
	},

	/**
	* True to indicate that an alert message is active.
	* Can be used to prevent automatic message box hiding.
	*/
	toggleAlertActive: function(active) {
		this.setAlertActive(active);
	},

	/**
	* Displays a non modal messagebox which hides on viewport tap.
	*
	*
	*
	*/
	showNotificationBox: function(title, message, topPos, leftPos) {
		var me =this,
			msgBox = Ext.create('Ext.MessageBox');

		msgBox = Ext.create('Ext.MessageBox', {
			modal: false,
			'title': i10n.translate(title),
			'message' : i10n.translate(message),
			buttons: [],
			top: topPos,
			left: leftPos
		});

		// msgBox.showBy(this.getActivateSoundButton(), "tl-tr?");
		msgBox.show();

		//defer registering tap handler. otherwise tap is registered before box is shown
		Ext.defer(function() {
			//make popup to disappear on viewport tap
			Ext.Viewport.element.on('tap', hideActivationHint, this, {
				single: true,
				delay: appConfig.msgboxShortHideTimeout
			});
		}, 50, this);


		function hideActivationHint() {
			msgBox.hide(true);
		};
	}
});