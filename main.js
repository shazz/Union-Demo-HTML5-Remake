/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Union Demo HTML5 Remake
 *
 **/


var jsApp	= 
{	
	// Screen ID when changing state
	ScreenID : {
		TODO : 100, // start at 100 on purpose
		TCB1 : 101,
	},
	
	// last entity position
	entityPos : null,
	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 640, 400, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
			return;
		}
				
		// initialize the "audio"
		me.audio.init("ogg");
			
		// get a ref to the canvas
		var ctx = me.video.getScreenFrameBuffer();
		// clear surface
		me.video.clearSurface(ctx, "black");
		// display a centered "please wait"
		var font = new me.Font('courier', 11, 'white');
		var dim  = font.measureText(ctx, 'PLEASE WAIT');
		font.draw(ctx, 'PLEASE WAIT', ((ctx.canvas.width - dim.width) / 2),  (ctx.canvas.height) / 2);
						
		// manually load the background, since we need it to be loaded for the loader...
		me.loader.load({name: "loader", type:"image", src: "screens/loader/loader.png"}, function() 
		{
			// set all resources to be loaded
			me.loader.onload = jsApp.loaded.bind(jsApp);

			// set all resources to be loaded
			me.loader.preload(g_resources);

			// set our custom loader
			me.state.set(me.state.LOADING, new TEXLoader());

			// load everything & display the loading screen
			me.state.change(me.state.LOADING);
		}, null);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		me.video.clearSurface(me.video.getScreenFrameBuffer(), "black");		
	
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		// register the various screen;
		me.state.set(jsApp.ScreenID.TODO, new todoScreen());
		me.state.set(jsApp.ScreenID.TCB1, new introScreen());
		
		// start the game 
		me.state.change(me.state.PLAY);
		
		// add our player entity in the entity pool
		me.entityPool.add("MainEntity", MainEntity);
		
		// add our door entity in the entity pool
		me.entityPool.add("DoorEntity", DoorEntity);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,    "up");
		me.input.bindKey(me.input.KEY.DOWN,   "down");
		
		// bind the space key, and avoid key repetition
		me.input.bindKey(me.input.KEY.SPACE, "enter", true);
		// bind the ESC key, to exit demo
		me.input.bindKey(me.input.KEY.ESC, "exit");
		
		// debug stuff
		//me.debug.renderHitBox = true;
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
	
	init: function()
	{	
		this.parent(false)
		// init the YM Player
		this.YMPlayer = new music("YM");	
	},
	
	onResetEvent: function()
	{	
		me.video.clearSurface(me.video.getScreenFrameBuffer(), "black");
		
		// use setInterval
		me.sys.useNativeAnimFrame = false;
		
		// load a level
		me.levelDirector.loadLevel("menu");
		
 		me.game.addHUD(0, 0, 640, 58);
        	me.game.HUD.addItem("logo", new LogoObject(0, 0));
        	
        	 me.game.sort();
		
		// start the main menu music 
		// there is no just a Load function ?
		this.YMPlayer.LoadAndRun('data/music/Alloy_Run.ym');
		// reconnect if we disconnect previously
		CODEF_AUDIO_NODE.connect(CODEF_AUDIO_CONTEXT.destination);
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
		me.game.disableHUD();
		
		if (this.YMPlayer.player != null) 
		{
			// stop the menu music
			// is this the right way ?
			CODEF_MUSICPLAYER.stop();
			CODEF_AUDIO_NODE.disconnect();
		}
	}

});


var LogoObject = me.HUD_Item.extend({
    
    init: function(x, y) 
    {
        // call the parent constructor
        this.parent(x, y);
        
        this.logo = me.loader.getImage("logo");
    },

    draw: function(context, x, y) 
    {
        context.drawImage(this.logo, 194 ,0);
    }

});

//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
