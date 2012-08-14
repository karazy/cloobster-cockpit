Ext.define('EatSense.view.Login', {
	extend: 'Ext.Panel',
	xtype: 'login',
	requires: ['Ext.field.Toggle', 'Ext.field.Password', 'Ext.Img'],
	config: {
		fullscreen: true,
		centered: true,
		width: 400,
		height: 320,
		// top: '20%',
		// left: '20%',
		// right: '20%',
		// bottom: '20%',
		layout: {
			type: 'card',
			animation: 'fade'
		},
		activeItem: 0,
		floatingCls: 'loginbox',
		items: [
		{
			xtype: 'panel',
			padding: '5',
			layout: {
				type: 'vbox',
				align: 'middle',
				pack: 'center'
			},
			items: [
				{
					xtype : 'image',
					src : 'res/images/logo_cloobster.png',
					style : 'background-repeat:no-repeat; background-position:center center;',
					height : 60,
					width : 185,
					cls: 'loginbox-field'
				},	
				{
					xtype: 'textfield',
					label: i10n.translate('login.field.user'),
					labelWidth: '40%',
					width: '100%',
					name: 'login',
					cls: 'loginbox-field'
				}, {
					xtype: 'passwordfield',
					label: i10n.translate('login.field.password'),
					labelWidth: '40%',
					width: '100%',
					name: 'password',
					cls: 'loginbox-field'
				}, 
				{
					xtype : 'togglefield',
					name : 'savePasswordToggle',
					value : 0,
					labelWidth: '40%',
					width: '100%',
					margin: '0 0 0.5em 0',
					label : i10n.translate('savePasswordToggle'),
				},
				{
					xtype: 'button',
					text: 'Login',
					action: 'login',
					ui: 'action',
					width: '100%'
				}
			]
		},
		{
			xtype: 'choosebusiness'
		}
		]
	}
});
