Ext.define('EatSense.util.Localization', {
	//used as a shorthand
	alternateClassName: ['i10n'],
	requires: ['Ext.String','EatSense.util.Constants', 'EatSense.util.Translations', 'EatSense.util.Configuration'],
	singleton: true,
	config: {
		lang: null
	},
	/**
	 * Contains translations.
	 */
	// translations : null,
	/**
	 * default language.
	 */
	defaultLang : "DE",
	/**
	 * Chosen language.
	 */
	// lang : null,

	appConfig: null,


	constructor: function() {
		this.appConfig = EatSense.util.Configuration;
		//get browser/system locale 
		this.setLang(this.getLanguage());		
		// try {
		// 	this.setTranslations(EatSense.util.Translation.data);
		// } catch(e) {
		// 	console.log('translation data not loaded');
		// 	this.setTranslations({});
		// }
	},

	getTranslations: function() {
		return EatSense.util.Translations.data || {};
	},


	/**
	* @private
	 * returns the browser language 
	 * e.g. de, en
	 */
	getLanguage: function() {
		// Gets called from constructor so getters/setters don't exist at this point
		//if a language is configured use it otherwise use browser language
		var userLang = (this.appConfig && this.appConfig.language) ? this.appConfig.language : (navigator.language) ? navigator.language : navigator.userLanguage; 
		console.log('browser language: '+userLang);
		if(userLang === 'undefined'|| userLang.length == 0) {
			//use default language
			userLang = defaultLang;
		}
		return userLang.substring(0,2).toUpperCase();
	},

	/**
	 * Translates the given key into the corresponding value in selected language.
	 * @param key
	 * 		The key used to find a specific translation.
	 * 			if the translated string contains placeholders in form of {0}, {1} ... 
	 * 			1. additional parameters with replacing values 
	 * 			OR
	 * 			2. an array containing placeholders
	 * 			can be submited
	 * @returns
	 * 		Translation or key if none was found
	 */
	 translate: function(key) {
		 //alternativ with custom object and no sencha store
		var value = "",
			translations = this.getTranslations();
		 if (translations[this.getLang()] && translations[this.getLang()][key] && translations[this.getLang()][key] !== '') {
			 value = translations[this.getLang()][key];
			 if(arguments.length > 1) {
				 //this is a string with placeholders
				 //replace key with retrieved value and the call Ext.String.format
				 //we need apply because we don't know the number of arguments
				 var _array;
				 
				 if(Object.prototype.toString.call(arguments[1]) === '[object Array]') {
					 _array = new Array();
					 _array[0] = value;
					 for(var i = 0; i < arguments[1].length; i++) {
						 _array[i+1] = arguments[1][i];
					 }
				 }	else {
					 arguments[0] = value;
					 _array = arguments;
				 }						 						 						 
				 
				 value = Ext.String.format.apply(this, _array);
			 }
		 }
		 return (value == "") ? key : value;
	 },



});