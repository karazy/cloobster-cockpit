Ext.define('EatSense.util.Translations',{
	statics: {
		data: {
		"DE" : {

		// General translations
		"ok" : "Ok",
		"cancel" : "Abbrechen",
		"back" : "zurück",
		"barcode" : "Barcode",		
		"close" : "Schliessen",
		"loadingMsg" : "Laden ...",
		"hint" : "Hinweis",
		"success" : "Erfolg",
		"yes" : "Ja",
		"no" : "Nein",
		"comment" : "Kommentar",
		"update.ready" : "Update",
		"update.ready.message" : "Ein Update ist verfgübar.<br/>Anwendung neu laden?",
		//tabbar
		"spotsTitle" : "Tische",
		//toolbar
		"toolbar.bottom.status" : "Verbindung",
		//login
		"needCredentials" : "Bitte Benutzernamen und Passwort eingeben.",
		"wrongCredentials" : "Benutzername und/oder Passwort falsch.",
		"savePasswordToggle" : "Automatisch<br/>einloggen?",
		"logoutQuestion" : "Wirklich ausloggen?",
		"noBusinessAssigned" : "Dein Benutzer ist keinem Betrieb zugewiesen.",
		"restoreCredentialsErr" : "Login mit gespeicherten Daten fehlgeschlagen.",
		"chooseStore" : "Filiale auswählen",
		"login.field.user" : "Benutzername",
		"login.field.password" : "Passwort",
		"business.status.deleted" : "inaktiv",
		//area
		"area.request.new.badge" : "Neu",
		//spot
		"errorSpotLoading" : "Laden der Daten fehlgeschlagen!",
		"spot.bar.bottom.status" : "<span>{0}</strong> eingeloggt bei <strong>{1}</strong>",
		"spot.bar.bottom.status.locked" : "(Gelöscht)",
		"spot.locked" : "Dieses Restaurant wurde gelöscht.<br/>Es können keine Aktionen mehr durchgeführt werden.",
		"spot.filter.none" : "Alle Spots",
		"spot.filter.active" : "Aktive Spots",
		"spot.filter.title" : "Filter",
		"spot.filter.requests.asc" : "Liste aufsteigend",
		"spot.filter.requests.desc": "Liste absteigend",
		"spot.filterbar.requestview" : "Listenansicht",
		"spot.filterbar.historyview" : "Alte CheckIns",
		//spot details
		"spotDetailCustomerLabel" : "Gäste",
		"errorSpotDetailCheckInLoading" : "Laden der eingecheckten Personen fehlgeschlagen!",
		"errorSpotDetailOrderLoading" : "Laden der Bestellungen fehlgeschlagen!",
		"errorSpotDetailOrderSave" : "Speichern der Bestellung fehlgeschlagen!",
		"status" : "Status",
		"statistic" : "Infos",
		"processOrdersFirst" : "Bitte zuerst alle Bestellungen abarbeiten.",
		"cancelAllOrders" : "Alle Bestellungen stornieren und diesen Gast entfernen?",
		"errorSpotDetailOrderCancel" : "Bestellung {0} konnte nicht storniert werden.",
		"switchSpotButton" : "Tisch wechseln",
		"switchSpotMessage": "{0} an {1} verschoben",
		"cancelOrderQuestion" : "{0} stornieren?",
		"cancelAllOrdersButton" : "Gast entfernen",
		"confirmAllOrdersButton" : "Alle annehmen",
		"paidButton" : "Bezahlt",
		"spotSelectionTitle" : "Tisch auswählen",
		"switchSpotError" : "Server Fehler aufgetreten. Tischwechsel fehlgeschlagen!",
		"paymentMethodLabel" : "Bezahlart",
		"choiceValErrMandatory" : "Bitte Wahl für {0} treffen.",
		"choiceValErrMin" : "Bitte mindestens {0} {1} auswählen.",
		"choiceValErrMax" : "Bitte maximal  {0} {1} auswählen.",
		//requests
		"requestMsgboxTitle" : "Gästewünsche",
		"requestDismiss" : "Gästewünsche löschen",
		"spot.filterbar.spotview" : "Spotansicht",
		"request.sort.title" : "Sortierung",
		"request.item.elapsedtime.mm" : "{0}min",
		"request.item.elapsedtime.hhmm" : "{0}:{1}h",
		"request.item.elapsedtime.dd" : ">24h",
		"request.item.paymentrequest" : "\"{0}\" möchte bezahlen mittels <b>{1}</b>",
		"request.item.orderplaced" : "\"{0}\" möchte <b>{1}</b> bestellen",
		"request.item.custom" : "\"{0}\" hat einen <b>besonderen Wunsch</b>",
		"request.list.description" : "<h1>Die Listenansicht</h1>Hier werden die Kundenwünsche chronologisch aufgelistet.<br/>"+
			"Zur Zeit sind Ihre Kunden wunschlos glücklich und haben keine Wünsche.",
		//history
		"history.detail.list.paging" : "Weitere Einträge",
		"history.detail.title" : "CheckIn Details",
		"history.detail.info.spot" : "Spot",
		"history.detail.info.nickname" : "Spitzname",
		"history.detail.info.billtime" : "Datum",
		"history.detail.info.billtotal" : "Total",
		"history.detail.list.title" : "Bestellungen",
		//constants
		"ORDER_PLACED" : "Neue Bestellung!",
		"PLACED" : "Neu!",
		"CHECKEDIN" : "Checked-In",
		"PAYMENT_REQUEST" : "Bezahlen",
		"CALL_WAITER" : "{0} ruft eine Bedienung",
		//general errors
		"error" : "Fehler",
		"error.critical" : "Entschuldigung, es trat ein Fehler auf, der nicht automatisch behoben werden konnte.<br>Die App wird neu geladen.",
		"errorTitle" : "Fehler",		
		"errorMsg" : "Entschuldigung! Ein Fehler ist aufgetreten.<br/>Wir kümmern uns darum!",
		"errorResource" : "Daten konnten nicht vom Server geladen werden.",
		"errorPermission" : "Sitzung ist ungültig.",
		"errorCommunication" : "Leider besteht zur Zeit ein Problem mit der Verbindung.<br>Bitte überprüfen Sie die Netzwerkverbindung.",
		"errorGeneralCommunication" : "Beim Laden von Aktualisierungsdaten trat ein Fehler auf.<br/>Zur Sicherheit bitte neu anmelden.",
		"resourceNotAvailable" : "Angeforderte Ressource ist nicht erreichbar.",
		"channelTokenError" : "Updates im Hintergrund nicht funktionsfähig."
		}
	}
	}
});