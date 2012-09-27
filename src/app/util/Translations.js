Ext.define('EatSense.util.Translations',{
	statics: {
		data: {

		// General translations
		"ok" : {
			"DE" :  "Ok",
			"EN" : ""
		},
		"cancel" : {
			"DE" :  "Abbrechen",
			"EN" : ""
		},
		"back" : {
			"DE" :  "zurück",
			"EN" : ""
		},
		"barcode" : {
			"DE" :  "Barcode",
			"EN" : ""
		},		
		"close" : {
			"DE" :  "Schliessen",
			"EN" : ""
		},
		"loadingMsg" : {
			"DE" :  "Laden ...",
			"EN" : ""
		},
		"hint" : {
			"DE" :  "Hinweis",
			"EN" : ""
		},
		"success" : {
			"DE" :  "Erfolg",
			"EN" : ""
		},
		"yes" : {
			"DE" :  "Ja",
			"EN" : ""
		},
		"no" : {
			"DE" :  "Nein",
			"EN" : ""
		},
		"comment" : {
			"DE" :  "Kommentar",
			"EN" : ""
		},
		"update.ready" : {
			"DE" :  "Update",
			"EN" : ""
		},
		"update.ready.message" : {
			"DE" :  "Ein Update ist verfgübar.<br/>Anwendung neu laden?",
			"EN" : ""
		},
		//tabbar
		"spotsTitle" : {
			"DE" :  "Spots",
			"EN" : ""
		},
		//toolbar
		"toolbar.bottom.status" : {
			"DE" :  "Verbindung",
			"EN" : ""
		},
		//login
		"needCredentials" : {
			"DE" :  "Bitte Benutzernamen und Passwort eingeben.",
			"EN" : ""
		},
		"wrongCredentials" : {
			"DE" :  "Benutzername und/oder Passwort falsch.",
			"EN" : ""
		},
		"savePasswordToggle" : {
			"DE" :  "Automatisch<br/>einloggen?",
			"EN" : ""
		},
		"logoutQuestion" : {
			"DE" :  "Wirklich ausloggen?",
			"EN" : ""
		},
		"noBusinessAssigned" : {
			"DE" :  "Dein Benutzer ist keinem Betrieb zugewiesen.",
			"EN" : ""
		},
		"restoreCredentialsErr" : {
			"DE" :  "Login mit gespeicherten Daten fehlgeschlagen.",
			"EN" : ""
		},
		"chooseStore" : {
			"DE" :  "Filiale auswählen",
			"EN" : ""
		},
		"login.field.user" : {
			"DE" :  "Benutzername",
			"EN" : ""
		},
		"login.field.password" : {
			"DE" :  "Passwort",
			"EN" : ""
		},
		"business.status.deleted" : {
			"DE" :  "inaktiv",
			"EN" : ""
		},
		//area
		"area.request.new.badge" : {
			"DE" :  "Neu",
			"EN" : ""
		},
		//spot
		"errorSpotLoading" : {
			"DE" :  "Laden der Daten fehlgeschlagen!",
			"EN" : ""
		},
		"spot.bar.bottom.status" : {
			"DE" :  "<span>{0}</strong> eingeloggt bei <strong>{1}</strong>",
			"EN" : ""
		},
		"spot.bar.bottom.status.locked" : {
			"DE" :  "(Gelöscht)",
			"EN" : ""
		},
		"spot.locked" : {
			"DE" :  "Dieses Restaurant wurde gelöscht.<br/>Es können keine Aktionen mehr durchgeführt werden.",
			"EN" : ""
		},
		"spot.filter.none" : {
			"DE" :  "Alle Spots",
			"EN" : ""
		},
		"spot.filter.active" : {
			"DE" :  "Aktive Spots",
			"EN" : ""
		},
		"spot.filter.title" : {
			"DE" :  "Filter",
			"EN" : ""
		},
		"spot.filter.requests.asc" : {
			"DE" :  "Liste aufsteigend",
			"EN" : ""
		},
		"spot.filter.requests.desc" : {
			"DE" :  "Liste absteigend",
			"EN" : ""
		},
		"spot.filterbar.requestview" : {
			"DE" :  "Listenansicht",
			"EN" : ""
		},
		"spot.filterbar.historyview" : {
			"DE" :  "Alte CheckIns",
			"EN" : ""
		},
		//spot details
		"spotDetailCustomerLabel" : {
			"DE" :  "Gäste",
			"EN" : ""
		},
		"errorSpotDetailCheckInLoading" : {
			"DE" :  "Laden der eingecheckten Personen fehlgeschlagen!",
			"EN" : ""
		},
		"errorSpotDetailOrderLoading" : {
			"DE" :  "Laden der Bestellungen fehlgeschlagen!",
			"EN" : ""
		},
		"errorSpotDetailOrderSave" : {
			"DE" :  "Speichern der Bestellung fehlgeschlagen!",
			"EN" : ""
		},
		"status" : {
			"DE" :  "Status",
			"EN" : ""
		},
		"statistic" : {
			"DE" :  "Infos",
			"EN" : ""
		},
		"processOrdersFirst" : {
			"DE" :  "Bitte zuerst alle Bestellungen abarbeiten.",
			"EN" : ""
		},
		"cancelAllOrders" : {
			"DE" :  "Alle Bestellungen stornieren und diesen Gast entfernen?",
			"EN" : ""
		},
		"errorSpotDetailOrderCancel" : {
			"DE" :  "Bestellung {0} konnte nicht storniert werden.",
			"EN" : ""
		},
		"switchSpotButton" : {
			"DE" :  "Spot wechseln",
			"EN" : ""
		},
		"switchSpotMessage" : {
			"DE" :  "{0} an {1} verschoben",
			"EN" : ""
		},
		"cancelOrderQuestion" : {
			"DE" :  "{0} stornieren?",
			"EN" : ""
		},
		"cancelAllOrdersButton" : {
			"DE" :  "Gast entfernen",
			"EN" : ""
		},
		"confirmAllOrdersButton" : {
			"DE" :  "Alle annehmen",
			"EN" : ""
		},
		"paidButton" : {
			"DE" :  "Bezahlt",
			"EN" : ""
		},
		"spotSelectionTitle" : {
			"DE" :  "Spot auswählen",
			"EN" : ""
		},
		"switchSpotError" : {
			"DE" :  "Server Fehler aufgetreten. Spotwechsel fehlgeschlagen!",
			"EN" : ""
		},
		"paymentMethodLabel" : {
			"DE" :  "Bezahlart",
			"EN" : ""
		},
		"choiceValErrMandatory" : {
			"DE" :  "Bitte Wahl für {0} treffen.",
			"EN" : ""
		},
		"choiceValErrMin" : {
			"DE" :  "Bitte mindestens {0} {1} auswählen.",
			"EN" : ""
		},
		"choiceValErrMax" : {
			"DE" :  "Bitte maximal  {0} {1} auswählen.",
			"EN" : ""
		},
		//requests
		"requestMsgboxTitle" : {
			"DE" :  "VIP Calls",
			"EN" : ""
		},
		"requestDismiss" : {
			"DE" :  "VIP Calls löschen",
			"EN" : ""
		},
		"spot.filterbar.spotview" : {
			"DE" :  "Spotansicht",
			"EN" : ""
		},
		"request.sort.title" : {
			"DE" :  "Sortierung",
			"EN" : ""
		},
		"request.item.elapsedtime.mm" : {
			"DE" :  "{0}min",
			"EN" : ""
		},
		"request.item.elapsedtime.hhmm" : {
			"DE" :  "{0}:{1}h",
			"EN" : ""
		},
		"request.item.elapsedtime.dd" : {
			"DE" :  ">24h",
			"EN" : ""
		},
		"request.item.paymentrequest" : {
			"DE" :  "\"{0}\" möchte bezahlen mittels <b>{1}</b>",
			"EN" : ""
		},
		"request.item.orderplaced" : {
			"DE" :  "\"{0}\" möchte <b>{1}</b> bestellen",
			"EN" : ""
		},
		"request.item.custom" : {
			"DE" :  "\"{0}\" hat einen <b>besonderen Wunsch</b>",
			"EN" : ""
		},
		"request.list.description" : {
			"DE" :  "<h1>Die Listenansicht</h1>Hier werden die Kundenwünsche chronologisch aufgelistet.<br/>"+
					"Zur Zeit sind Ihre Kunden wunschlos glücklich und haben keine Wünsche.",
			"EN" : ""
		},
		//history
		"history.detail.list.paging" : {
			"DE" :  "Weitere Einträge",
			"EN" : ""
		},
		"history.detail.title" : {
			"DE" :  "CheckIn Details",
			"EN" : ""
		},
		"history.detail.info.spot" : {
			"DE" :  "Spot",
			"EN" : ""
		},
		"history.detail.info.nickname" : {
			"DE" :  "Spitzname",
			"EN" : ""
		},
		"history.detail.info.billtime" : {
			"DE" :  "Datum",
			"EN" : ""
		},
		"history.detail.info.billtotal" : {
			"DE" :  "Total",
			"EN" : ""
		},
		"history.detail.list.title" : {
			"DE" :  "Bestellungen",
			"EN" : ""
		},
		//notifications
		"notification.sound.deactivate" : {
			"DE" :  "Audio Benachrichtigung: AUS",
			"EN" : ""
		},
		"notification.sound.activate" : {
			"DE" :  "Audio Benachrichtigung: AN",
			"EN" : ""
		},
		"notification.sound.manual.title" : {
			"DE" :  "Audio Benachrichtigungen",
			"EN" : ""
		},
		"notification.sound.manual.msg" : {
			"DE" :  "Möchten Sie Audio Benachrichtigungen für eintreffende Ereignisse aktivieren?",
			"EN" : ""
		},
		//constants
		"ORDER_PLACED" : {
			"DE" :  "Neue Bestellung!",
			"EN" : ""
		},
		"PLACED" : {
			"DE" :  "Neu!",
			"EN" : ""
		},
		"CHECKEDIN" : {
			"DE" :  "Checked-In",
			"EN" : ""
		},
		"PAYMENT_REQUEST" : {
			"DE" :  "Bezahlen",
			"EN" : ""
		},
		"CALL_WAITER" : {
			"DE" :  "<b>{0}</b>",
			"EN" : ""
		},
		//general errors
		"error" : {
			"DE" :  "Fehler",
			"EN" : ""
		},
		"error.critical" : {
			"DE" :  "Entschuldigung, es trat ein Fehler auf, der nicht automatisch behoben werden konnte.<br>Die App wird neu geladen.",
			"EN" : ""
		},
		"errorTitle" : {
			"DE" :  "Fehler",
			"EN" : ""
		},		
		"errorMsg" : {
			"DE" :  "Entschuldigung! Ein Fehler ist aufgetreten.<br/>Wir kümmern uns darum!",
			"EN" : ""
		},
		"errorResource" : {
			"DE" :  "Daten konnten nicht vom Server geladen werden.",
			"EN" : ""
		},
		"errorPermission" : {
			"DE" :  "Sitzung ist ungültig.",
			"EN" : ""
		},
		"errorCommunication" : {
			"DE" :  "Es scheint zur Zeit ein Problem mit der Verbindung zu geben.<br>Bitte überprüfen Sie die Netzwerkverbindung.",
			"EN" : ""
		},
		"errorGeneralCommunication" : {
			"DE" :  "Beim Laden von Aktualisierungsdaten trat ein Fehler auf.<br/>Zur Sicherheit bitte neu anmelden.",
			"EN" : ""
		},
		"resourceNotAvailable" : {
			"DE" :  "Angeforderte Ressource ist nicht erreichbar.",
			"EN" : ""
		},
		"channelTokenError" : {
			"DE" :  "Updates im Hintergrund nicht funktionsfähig.",
			"EN" : ""
		},
	}
	}
});