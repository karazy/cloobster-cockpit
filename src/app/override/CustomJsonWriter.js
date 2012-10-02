/**
* This class overrides the getRecordData method to enable saving
* of nested objects. 
* Solution source: http://www.sencha.com/forum/showthread.php?124362-Nested-loading-nested-saving-in-new-data-package
*/
Ext.define('EatSense.override.CustomJsonWriter', {
	extend: 'Ext.data.writer.Json',

	getRecordData: function(record) { 
		Ext.apply(record.data,record.getAssociatedData());
		return record.data; 
	}
});