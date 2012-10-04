Ext.define('EatSense.util.Localization', {
	//used as a shorthand
	alternateClassName: ['i10n'],
	requires: ['Ext.String','EatSense.util.Constants', 'EatSense.util.Translations', 'EatSense.util.Configuration'],
	singleton: true,
	config: {
		lang: null
	},
	/**
	 * default language.
	 */
	defaultLang : "EN",

	appConfig: null,


	constructor: function() {
		this.appConfig = EatSense.util.Configuration;
		//get browser/system locale 
		this.setLang(this.getLanguage());		
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
		var lang = (this.appConfig && this.appConfig.language) ? this.appConfig.language : null; 
		//http://stackoverflow.com/questions/10642737/detecting-and-applying-current-system-language-on-html-5-app-on-android
	    if (!lang && navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
	        lang = lang[1];
	    }

	    if (!lang && navigator) {
	        if (navigator.language) {
	            lang = navigator.language;
	        } else if (navigator.browserLanguage) {
	            lang = navigator.browserLanguage;
	        } else if (navigator.systemLanguage) {
	            lang = navigator.systemLanguage;
	        } else if (navigator.userLanguage) {
	            lang = navigator.userLanguage;
	        }
	        lang = lang.substr(0, 2);
	    }

		console.log('browser language: '+lang);
		if(lang === 'undefined'|| lang.length == 0) {
			//use default language
			lang = defaultLang;
		}
		//set language to make it available in the rest of the app
		this.appConfig.language = lang.toUpperCase();

		return lang.toUpperCase();
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
		 if (key && translations[key] && translations[key][this.getLang()] && translations[key][this.getLang()] !== '') {
			 value = translations[key][this.getLang()];
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