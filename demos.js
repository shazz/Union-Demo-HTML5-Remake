/* -----

	Screen Objects
		
	------	*/

var DemoIntro = me.ScreenObject.extend({
	/*---
	
		constructor
		
		---*/
	init : function() 
	{
		// call the parent constructor
		this.parent(true);
		
		// init canvas and offscreen canvas
		this.maincanvas=new canvas(me.video.getScreenCanvas()); // reuse melonJS main canvas
		
	},
	
	/* ---
		onReset (called by the engine) function
	   ----*/
	
	onResetEvent : function()
	{
		
		// use requestAnimFrame
		me.sys.useNativeAnimFrame = false;
		
		this.maincanvas.fill('#000000');
		me.audio.playTrack("cuddly");
	},
	

	// make sure the screen is refreshed at every change 
	update : function() 
	{
		// if press ESC
		if (me.input.isKeyPressed('exit'))
		{
			// go back to menu
			me.state.change(me.state.PLAY);
		}
		return true;
	},

	/*---
	
		draw function
	  ---*/

	draw : function(context) {
		
		this.maincanvas.fill('#000000');
			
	},
	
	/*---
	
		called by the engine when switching state
	  ---*/
	
	onDestroyEvent : function()
	{
		// stop the current track
		me.audio.stopTrack();
	}


});
