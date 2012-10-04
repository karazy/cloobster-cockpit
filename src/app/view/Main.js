Ext.define('EatSense.view.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'main',
	requires: ['EatSense.view.Spot', 'Ext.tab.Panel', 'Ext.form.FieldSet', 'Ext.field.Radio'],
	config: {
		fullscreen: true,	
		layout: {
           type: 'card',
           //override default tabpanel animation setting
           animation: null
        },
		items: [
		{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [
			{
			xtype: 'label',
			itemId: 'info'
			},
			{
				xtype: 'spacer'
			},
			{
				xtype: 'button',
				action: 'activate-sound',
				iconMask: true,
				iconCls: 'volume_mute',
				cls: 'volume-status-off'
			},
			{
				xtype: 'button',
				// baseCls: 'no-cls',
				itemId: 'connectionStatus',
				labelCls: '.status-indicator-ONLINE',
				text: i10n.translate('toolbar.bottom.status') + '<span class="status"></span>',
				// tpl: '<span>'+'</span><span class="{0}"></span>'
			},
			{
				xtype: 'button',
				iconCls: 'delete',
    			iconMask: true,
    			action: 'logout'
			}]
		},
		{
			xtype: 'panel',
			cls: 'spot-filter-panel',
			itemId: 'filterPanel',
			modal: true,
			hideOnMaskTap: true,
			padding: 5,
			width: 300,
			hidden: true,
			items: [
			{
				xtype: 'label',
				html: i10n.translate('spot.filter.title'),
				cls: 'spot-filter-label'
			},
			{
				 xtype: 'fieldset',
				 defaults: {
				 	labelWidth: '50%',
				 	xtype: 'radiofield',
				 	labelWrap: true
				 },
				 items: [
					{
			            name : 'filter',
			            label: i10n.translate('spot.filter.none'),
			            value: 'none',
			            checked: true,
			            listeners:{
			            	// Adding listener for tap on label element,
					        // this should toggle the checkbox.
					        "tap": {
					            element: "label",
					            fn: function () {
					            	try {
					            		var me = this;
					            		if(!me.isChecked()) {
					            			me.check();
					            		}            	
					            	} catch(e) {
					            		//fail silently
					            		console.log("EatSense.view.Main > spot filter listener error");
					            	}
					            }
					        }
						}
			        },
			        {
			            name : 'filter',
			            label: i10n.translate('spot.filter.active'),
			            value: 'active',
			            listeners:{
			            	// Adding listener for tap on label element,
					        // this should toggle the checkbox.
					        "tap": {
					            element: "label",
					            fn: function () {
					            	try {
					            		var me = this;
					            		if(!me.isChecked()) {
					            			me.check();
					            		}            	
					            	} catch(e) {
					            		//fail silently
					            		console.log("EatSense.view.Main > spot filter listener error");
					            	}
					            }
					        }
						}
			        }
				 ]
			}

			]
		},
		{
			xtype: 'panel',
			cls: 'spot-filter-panel',
			itemId: 'requestSortPanel',
			modal: true,
			hideOnMaskTap: true,
			padding: 5,
			width: 300,
			hidden: true,
			items: [
			{
				xtype: 'label',
				html: i10n.translate('request.sort.title'),
				cls: 'spot-filter-label'
			},
			{
				 xtype: 'fieldset',
				 defaults: {
				 	labelWidth: '50%',
				 	xtype: 'radiofield',
				 	labelWrap: true
				 },
				 items: [
			        {
			        	name: 'sort-request',
			        	//swap labels, because we show elapsed time
			        	label: i10n.translate('spot.filter.requests.desc'),
			        	value: 'requests-asc',
			        	checked: true,
			        	listeners:{
			            	// Adding listener for tap on label element,
					        // this should toggle the checkbox.
					        "tap": {
					            element: "label",
					            fn: function () {
					            	try {
					            		var me = this;
					            		if(!me.isChecked()) {
					            			me.check();
					            		}            	
					            	} catch(e) {
					            		//fail silently
					            		console.log("EatSense.view.Main > spot filter listener error");
					            	}
					            }
					        }
						}
			        },
			        {
			        	name: 'sort-request',
			        	//swap labels, because we show elapsed time
			        	label: i10n.translate('spot.filter.requests.asc'),
			        	value: 'requests-desc',
			        	listeners:{
			            	// Adding listener for tap on label element,
					        // this should toggle the checkbox.
					        "tap": {
					            element: "label",
					            fn: function () {
					            	try {
					            		var me = this;
					            		if(!me.isChecked()) {
					            			me.check();
					            		}            	
					            	} catch(e) {
					            		//fail silently
					            		console.log("EatSense.view.Main > spot filter listener error");
					            	}
					            }
					        }
						}		        	
			        }
				 ]
			}

			]
		},
		{
			xtype: 'panel',
			layout: 'fit',					
			docked: 'bottom',
			hidden: !appConfig.debug,	
			height: 150,		
			items: [
			{
				xtype: 'titlebar',
				title: 'Debug console',
				docked: 'top',
				style: 'font-size: 0.6em; font-weight: bold;'
			},
			{
				xtype: 'panel',
				id: 'debugConsole',
				scrollable: true		
			}
			]
		}
		]
	}
});