/**
* Extends {@link Ext.Button} by adding additional functionality.
* Calling lock locks the button so that the user can't interact with it
* via tap.
*/
Ext.define('EatSense.data.LockButton', {
	extend: 'Ext.Button',
	xtype:'lockbutton',
	config: {
		locked: false,
		lockedCls: 'locked-button',
		// badgeText: 'lock',
		// html: '<span class="locked-button-icon">icon</span>'
	},

	/**
	* Lock this button too prevent interaction.
	*/
	lock: function() {
		this.setLocked(true);
		this.addCls('locked-button');
	},

	/**
	* Unlock to allow taps again.
	*/
	unlock: function() {
		this.setLocked(false);
		// this.setBadgeText('');
		// this.setBadgeCls('');
		this.removeCls(this.getLockedCls());
	},

	/**
	* @override
	* Overrides default onTp. First checks if button is locked.
	* Only calls original onTap if locked = false
	*/
	onTap: function(me, e) {
		if(this.getLocked()) {
			return false;
		}
		this.callParent([me, e]);
	}
});