Ext.define('EatSense.util.Translations',{
	statics: {
		data: {

		// General translations
		"ok" : {
			"DE" :  "OK",
			"EN" : "OK"
		},
		"cancel" : {
			"DE" :  "Abbrechen",
			"EN" :  "Cancel"
		},
		"back" : {
			"DE" :  "Zurück",
			"EN" :  "Back"
		},
		"barcode" : {
			"DE" :  "Barcode",
			"EN" :  "Bar code"
		},		
		"close" : {
			"DE" :  "Schliessen",
			"EN" :  "Close"
		},
		"loadingMsg" : {
			"DE" :  "Laden ...",
			"EN" :  "Loading ..."
		},
		"hint" : {
			"DE" :  "Hinweis",
			"EN" :  "Message"
		},
		"success" : {
			"DE" :  "Erfolg",
			"EN" :  "Success"
		},
		"yes" : {
			"DE" :  "Ja",
			"EN" :  "Yes"
		},
		"no" : {
			"DE" :  "Nein",
			"EN" :  "No"
		},
		"info" : {
			"DE" :  "Information",
			"EN" : "Information"
		},
		"comment" : {
			"DE" :  "Kommentar",
			"EN" :  "Comment"
		},
		"update.available" : {
			"DE" :  "Für cloobster Cockpit ist ein Update verfügbar.<br/>Laden Sie die Anwendung neu und bestätigen Sie anschliessend die Update Nachricht.",
			"EN" : "An update is available for cloobster Cockpit.<br/> Reload the app and confirm the update message afterwards."
		},
		"update.ready" : {
			"DE" :  "Update",
			"EN" :  "Update"
		},
		"update.ready.message" : {
			"DE" :  "Ein Update ist verfgübar.<br/>Anwendung neu laden?",
			"EN" :  "Update available.<br/>Reload application?"
		},
		"app.information" : {
			"DE" :  "cloobster Cockpit Version: {0}",
			"EN" :  "cloobster Cockpit Version: {0}"
		},
		"general.help.scrolling" : {
			"DE" :  "Kein Touch Gerät: Zum scrollen Maustaste gedrückt halten und ziehen!",
			"EN" :  "No touch device: To scroll, hold mouse down and drag!"
		},
		//tabbar
		"spotsTitle" : {
			"DE" :  "Spots",
			"EN" :  "Spots"
		},
		//toolbar
		"toolbar.bottom.status" : {
			"DE" :  "Verbindung",
			"EN" :  "Connection"
		},
		//login
		"needCredentials" : {
			"DE" :  "Bitte Benutzernamen und Passwort eingeben.",
			"EN" :  "Please enter user name and password."
		},
		"wrongCredentials" : {
			"DE" :  "Benutzername und/oder Passwort falsch.",
			"EN" :  "User name and/or password incorrect."
		},
		"savePasswordToggle" : {
			"DE" :  "Automatisch<br/>einloggen?",
			"EN" :  "Remember<br/>log-in?"
		},
		"logoutQuestion" : {
			"DE" :  "Wirklich ausloggen?",
			"EN" :  "Log out?"
		},
		"noBusinessAssigned" : {
			"DE" :  "Dein Benutzer ist keiner Location zugewiesen.",
			"EN" :  "User is not assigned to any location."
		},
		"restoreCredentialsErr" : {
			"DE" :  "Login mit gespeicherten Daten fehlgeschlagen.",
			"EN" :  "Login has failed."
		},
		"login.choosebusiness.title" : {
			"DE" :  "<h1>Locations auswählen</h1><p>In welcher Location wollen Sie einloggen?</p>",
			"EN" :  "<h1>Select location.</h1><p>Which location do you want to login?</p>"
		},
		"login.field.user" : {
			"DE" :  "Benutzername",
			"EN" :  "User name"
		},
		"login.field.password" : {
			"DE" :  "Passwort",
			"EN" :  "Password"
		},
		"business.status.deleted" : {
			"DE" :  "gelöscht",
			"EN" :  "deleted"
		},
		//area
		"area.request.new.badge" : {
			"DE" :  "Neu",
			"EN" :  "New"
		},
		//spot
		"errorSpotLoading" : {
			"DE" :  "Laden der Daten fehlgeschlagen!",
			"EN" :  "Data could not be loaded!"
		},
		"spot.bar.bottom.status" : {
			"DE" :  "<span>{0}</strong> eingeloggt bei <strong>{1}</strong>",
			"EN" :  "<span>{0}</strong> logged into <strong>{1}</strong>"
		},
		"spot.bar.bottom.status.locked" : {
			"DE" :  "(Gelöscht)",
			"EN" :  "(Deleted)"
		},
		"spot.locked" : {
			"DE" :  "Diese Location wurde gelöscht.<br/>Es können keine Aktionen mehr durchgeführt werden.",
			"EN" :  "This location has been deleted.<br/>You cannot edit this location."
		},
		"spot.filter.none" : {
			"DE" :  "Alle Spots",
			"EN" :  "All spots"
		},
		"spot.filter.active" : {
			"DE" :  "Aktive Spots",
			"EN" :  "Active spots"
		},
		"spot.filter.title" : {
			"DE" :  "Filter",
			"EN" :  "Filter"
		},
		"spot.filter.requests.asc" : {
			"DE" :  "Liste aufsteigend",
			"EN" : "Ascending order"
		},
		"spot.filter.requests.desc" : {
			"DE" :  "Liste absteigend",
			"EN" :  "Descending order"
		},
		"spot.filterbar.requestview" : {
			"DE" :  "Listenansicht",
			"EN" :  "Show list"
		},
		"spot.filterbar.historyview" : {
			"DE" :  "Alte CheckIns",
			"EN" :  "Past check-ins"
		},
		//spot details
		"spotdetail.checkin.complete" : {
			"DE" :  "2. Rechnung",
			"EN" :  "2. Bill"
		},
		"completecheckin.title" : {
			"DE" :  "Vorgang abschliessen",
			"EN" :  "Complete check-in"
		},
		"completecheckin.description" : {
			"DE" :  "Wenn ein Gast den Bezahlvorgang nicht selbst ausgelöst hat, können Sie diesen hier manuell anstoßen.",
			"EN" :  "If your client has not asked for the bill yet, you can manually trigger the request here."
		},
		"completecheckin.confirm.msg" : {
			"DE" :  "Möchten Sie den Vorgang mittels {0} abschliessen? Dies kann nicht rückgängig gemacht werden.",
			"EN" :  "Do you want to complete this action by means of {0}? This action cannot be reversed."
		},
		"completecheckin.error.noorders" : {
			"DE" :  "Vorgang kann nicht abgeschlossen werden, da keine Bestellungen vorliegen.",
			"EN" :  "Action cannot be completed as there is no order."
		},
		"spotselection.description" : {
			"DE" :  "Verschieben Sie einen Gast an einen anderen Spot (Tisch, Zimmer ...).",
			"EN" :  "Move client to different spot (e.g. room, table)."
		},
		"spotdetail.buttongroup.checkin" : {
			"DE" :  "Check-In",
			"EN" :  "Check-in"
		},
		"spotdetail.buttongroup.customer" : {
			"DE" :  "Gast",
			"EN" :  "Customer"
		},

		"spotDetailCustomerLabel" : {
			"DE" :  "Gäste",
			"EN" :  "Customers"
		},
		"errorSpotDetailCheckInLoading" : {
			"DE" :  "Laden der eingecheckten Personen fehlgeschlagen!",
			"EN" :  "Customer session data could not be loaded."
		},
		"errorSpotDetailOrderLoading" : {
			"DE" :  "Laden der Bestellungen fehlgeschlagen!",
			"EN" :  "Order data could not be loaded!"
		},
		"errorSpotDetailOrderSave" : {
			"DE" :  "Speichern der Bestellung fehlgeschlagen!",
			"EN" :  "Order could not be saved!"
		},
		"status" : {
			"DE" :  "Status",
			"EN" :  "Status"
		},
		"statistic" : {
			"DE" :  "Infos",
			"EN" :  "Info"
		},
		"processOrdersFirst" : {
			"DE" :  "Bitte zuerst alle Bestellungen abarbeiten.",
			"EN" :  "Please process all orders first."
		},
		"cancelAllOrders" : {
			"DE" :  "Alle Bestellungen stornieren und diesen Gast entfernen?",
			"EN" :  "Cancel all orders or close client session?"
		},
		"errorSpotDetailOrderCancel" : {
			"DE" :  "Bestellung {0} konnte nicht storniert werden.",
			"EN" :  "Order {0} could not be canceled."
		},
		"switchSpotButton" : {
			"DE" :  "Wechseln",
			"EN" :  "Change spot"
		},
		"switchSpotMessage" : {
			"DE" :  "{0} an {1} verschoben",
			"EN" :  "{0} moved to {1}"
		},
		"cancelOrderQuestion" : {
			"DE" :  "{0} stornieren?",
			"EN" :  "Cancel {0}?"
		},
		"cancelAllOrdersButton" : {
			"DE" :  "Entfernen",
			"EN" :  "Delete client"
		},
		"confirmAllOrdersButton" : {
			"DE" :  "1. Annehmen",
			"EN" :  "1. Confirm"
		},
		"paidButton" : {
			"DE" :  "3. Bezahlt",
			"EN" :  "3. Bill settled"
		},
		"spotSelectionTitle" : {
			"DE" :  "Spot auswählen",
			"EN" :  "Select spot"
		},
		"switchSpotError" : {
			"DE" :  "Server Fehler aufgetreten. Spotwechsel fehlgeschlagen!",
			"EN" :  "Server connection error. Spot could not be changed."
		},
		"paymentMethodLabel" : {
			"DE" :  "Bezahlart",
			"EN" :  "Payment method"
		},
		"choiceValErrMandatory" : {
			"DE" :  "Bitte Wahl für {0} treffen.",
			"EN" :  "Please make a choice for {0}."
		},
		"choiceValErrMin" : {
			"DE" :  "Bitte mindestens {0} {1} auswählen.",
			"EN" :  "Please select at least {0} {1}."
		},
		"choiceValErrMax" : {
			"DE" :  "Bitte maximal {0} {1} auswählen.",
			"EN" :  "Please do not exceed {0} {1}."
		},
		//requests
		"requestMsgboxTitle" : {
			"DE" :  "VIP Calls",
			"EN" :  "VIP calls"
		},
		"requestDismiss" : {
			"DE" :  "Alle löschen",
			"EN" :  "Cancel VIP calls"
		},
		"spot.filterbar.spotview" : {
			"DE" :  "Spotansicht",
			"EN" :  "Spot view"
		},
		"request.sort.title" : {
			"DE" :  "Sortierung",
			"EN" :  "Order"
		},
		"request.item.elapsedtime.mm" : {
			"DE" :  "{0}min",
			"EN" :  "{0}min"
		},
		"request.item.elapsedtime.hhmm" : {
			"DE" :  "{0}:{1}h",
			"EN" :  "{0}:{1}h"
		},
		"request.item.elapsedtime.dd" : {
			"DE" :  ">24h",
			"EN" :  ">24h"
		},
		"request.item.paymentrequest" : {
			"DE" :  "\"{0}\" möchte bezahlen mittels <b>{1}</b>",
			"EN" :  "\"{0}\" will pay by means of <b>{1}</b>"
		},
		"request.item.orderplaced" : {
			"DE" :  "\"{0}\" möchte <b>{1}</b> bestellen",
			"EN" :  "\"{0}\" has ordered <b>{1}</b>"
		},
		"request.item.custom" : {
			"DE" :  "\"{0}\" hat einen <b>besonderen Wunsch</b>",
			"EN" :  "\"{0}\" has added a <b>special request</b>"
		},
		"request.list.description" : {
			"DE" :  "<h1>Die Listenansicht</h1>Hier werden die Kundenwünsche chronologisch aufgelistet.<br/>"+
					"Zur Zeit sind Ihre Kunden wunschlos glücklich und haben keine Wünsche.",
			"EN" :  "<h1>Show list of items</h1>Customer orders in ascending order.<br/>"+
					"No orders available at this point in time."
		},
		//history
		"history.detail.list.paging" : {
			"DE" :  "Weitere Einträge",
			"EN" :  "Further options"
		},
		"history.detail.title" : {
			"DE" :  "CheckIn Details",
			"EN" :  "Check-in details"
		},
		"history.detail.info.spot" : {
			"DE" :  "Spot",
			"EN" :  "Spot"
		},
		"history.detail.info.nickname" : {
			"DE" :  "Spitzname",
			"EN" :  "Alias"
		},
		"history.detail.info.billtime" : {
			"DE" :  "Datum",
			"EN" :  "Date"
		},
		"history.detail.info.billtotal" : {
			"DE" :  "Total",
			"EN" :  "Total"
		},
		"history.detail.list.title" : {
			"DE" :  "Bestellungen",
			"EN" :  "Orders"
		},
		//notifications

		//payment action
		"payment.nobill.message" : {
			"DE" :  "Sie können erst als \"Bezahlt\" abschliessen, wenn der Gast die Rechnung angefordert hat oder Sie auf \"Rechnung\" gedrückt haben.",
			"EN" :  "You can complete the transaction only if customer has requested the bill or after you have pressed \"Paid\"."
		},
		//complete checkin action
		//message box text when someone tries to complete a checkin which has no orders
		"complete.noorders.message" : {
			"DE" :  "Diese Funktion steht erst zur Verfügung, wenn der Gast etwas bestellt hat.",
			"EN" :  "This function is available only when there is an order."
		},
		//message box text when someone tries to complete a checkin more than once
		"complete.bill.message" : {
			"DE" :  "Die Rechnung wurde bereits erstellt.",
			"EN" :  "Bill has been issued."
		},

		"notification.sound.deactivate" : {
			"DE" :  "Audio Benachrichtigung: AUS",
			"EN" :  "Audio notification: OFF"
		},
		"notification.sound.activate" : {
			"DE" :  "Audio Benachrichtigung: AN",
			"EN" :  "Audio notification: ON"
		},
		"notification.sound.manual.title" : {
			"DE" :  "Audio Benachrichtigungen",
			"EN" :  "Audio notification"
		},
		"notification.sound.manual.msg" : {
			"DE" :  "Möchten Sie Audio Benachrichtigungen für eintreffende Ereignisse aktivieren?",
			"EN" :  "Do you want to enable alerts for incoming orders?"
		},
		//inactive checkins
		"checkins.inactive.message.title" : {
			"DE" :  "Inaktive Check-Ins abarbeiten?",
			"EN" : "Process inactive Check-ins?"
		},
		"checkins.inactive.message.text" : {
			"DE" :  "Es liegen inaktive (> 24h) Check-Ins vor. Möchten Sie diese nun bearbeiten?",
			"EN" : "Inactive  (> 24h) Check-Ins exist to you want to process them now?"
		},
		"checkins.inactive.title" : {
			"DE" :  "Inaktive Check-Ins",
			"EN" : "Inactive Check-Ins"
		},
		//constants
		"ORDER_PLACED" : {
			"DE" :  "Neue Bestellung!",
			"EN" :  "New order!"
		},
		"PLACED" : {
			"DE" :  "Neu!",
			"EN" :  "New!"
		},
		"CHECKEDIN" : {
			"DE" :  "Checked-In",
			"EN" :  "Checked in"
		},
		"PAYMENT_REQUEST" : {
			"DE" :  "Bezahlen",
			"EN" :  "Bill"
		},
		"CALL_WAITER" : {
			"DE" :  "<b>{0}</b>",
			"EN" :  "<b>{0}</b>"
		},
		//general errors
		"error" : {
			"DE" :  "Fehler",
			"EN" :  "Error"
		},
		"error.critical" : {
			"DE" :  "Entschuldigung, es trat ein Fehler auf, der nicht automatisch behoben werden konnte.<br/>Die App wird neu geladen.",
			"EN" :  "We apologize! An error has occurred.<br/>Application is reloading."
		},
		"errorTitle" : {
			"DE" :  "Fehler",
			"EN" :  "Error"
		},		
		"errorMsg" : {
			"DE" :  "Ein Fehler ist aufgetreten.<br/>Es wird empfohlen das Cockpit neu zuladen.",
			"EN" :  "An error has occurred.<br/>We recommend reloading the cockpit."
		},
		"errorResource" : {
			"DE" :  "Daten konnten nicht vom Server geladen werden.",
			"EN" :  "Data error... Connection to server has failed."
		},
		"errorPermission" : {
			"DE" :  "Sitzung ist ungültig. Bitte neu einloggen.",
			"EN" :  "Session is invalid. Please login again."
		},
		"errorCommunication" : {
			"DE" :  "Es scheint zur Zeit ein Problem mit der Verbindung zu geben.<br/>Bitte überprüfen Sie die Netzwerkverbindung.",
			"EN" :  "Could not connect to server.<br/>Please check your network connection."
		},
		"errorGeneralCommunication" : {
			"DE" :  "Beim Laden von Aktualisierungsdaten trat ein Fehler auf.<br/>Zur Sicherheit bitte neu anmelden.",
			"EN" :  "Could not connect to server.<br/>Please log in again."
		},
		"resourceNotAvailable" : {
			"DE" :  "Angeforderte Ressource ist nicht erreichbar.",
			"EN" :  "Resource not available."
		},
		"channelTokenError" : {
			"DE" :  "Updates im Hintergrund nicht funktionsfähig.",
			"EN" :  "Updates have been successful."
		},
		"error.apiversion" : {
			"DE" :  "Die Version Ihres Cockpits ist veraltet. Bitte laden das Cockpit neu.",
			"EN" : "Your cockpit version is old. Please reload the cockpit."
		},
		"error.version" : {
			"DE" :  "Die Version Ihres Cockpits ist veraltet. Bitte laden das Cockpit neu.",
			"EN" : "Your cockpit version is old. Please reload the cockpit."
		}
	}
	}
});