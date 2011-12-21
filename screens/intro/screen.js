/* -----

	Screen Objects
		
	------	*/

var introScreen = me.ScreenObject.extend({
	/*---
	
		constructor
		
		---*/
	init : function() 
	{
		// call the parent constructor
		this.parent(true);
		
		// init canvas and offscreen canvas
		this.maincanvas=new canvas(me.video.getScreenCanvas()); // reuse melonJS main canvas	
		this.backgroundCanvas = new canvas(320*2,288*2);
		
		this.logoSmallUnion = new image(me.loader.getImage('IntroLogoSmallUnion'));
		this.backgroundImg = new image(me.loader.getImage('IntroBackground'));
		this.message = new image(me.loader.getImage('IntroMessage'));
		
		this.logoSmallUnion.setmidhandle();
		this.message.initTile(16,8,0);

		for(var i=0; i<12; i++)
		{
			this.backgroundImg.draw(this.backgroundCanvas,0,i*96);
		}		
		
		this.bgposy=-96;
		this.logosin1=0;
		this.sinlettersx=0;
		this.sinlettersy=0;
		this.oldsinx=0;
		this.oldsiny=0;
	},
	
	/* ---
		onReset (called by the engine) function
	   ----*/
	
	onResetEvent : function()
	{
		
		// use requestAnimFrame
		me.sys.useNativeAnimFrame = false;
		
		this.maincanvas.fill('#000000');
		
		// play menu song
		//me.audio.playTrack("ThinkTwice");
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

	draw : function(context) 
	{
		
		this.maincanvas.fill('#000000');
		this.backgroundCanvas.draw(this.maincanvas,0,this.bgposy);
		this.logoSmallUnion.draw(this.maincanvas,320+Math.sin(this.logosin1)*95,25*2);

		this.oldsinx=this.sinlettersx;
		this.oldsiny=this.sinlettersy;
		
		var countl=0;
		for(var y=0;y<112*2;y+=8)
		{
			for(var x=0;x<256*2;x+=16)
			{
				this.message.drawTile(this.maincanvas,countl++,2*35+x+Math.sin(this.sinlettersx)*16,2*68+y+Math.sin(this.sinlettersy)*8);
				this.sinlettersy+=0.3;
			}
			this.sinlettersy=this.oldsiny;
			this.sinlettersx+=0.3;
		}
		this.sinlettersx=this.oldsinx+0.08;
		this.sinlettersy=this.oldsiny+0.08;

		if((this.bgposy+=2) >=0) this.bgposy=-96;
		this.logosin1+=0.05;
		
		
			
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

