/* -----

	Object Entities
		
	------			*/

	/************************************************************************************/
	/*																					*/
	/*			a player entity															*/
	/*																					*/
	/************************************************************************************/
	var MainEntity = me.ObjectEntity.extend(
	{	

		init:function (x, y, settings)
		{
			// define this here, since not defined in tiled
			settings.image = "sprites";
			settings.spritewidth = 80;
			settings.spriteheight = 102;
			
			// call the constructor
			this.parent(x, y, settings);
			
			// set h/v velocity
			this.setVelocity(4, 4);
			this.setMaxVelocity(4, 4);
			
			// disable gravity
			this.gravity = 0.0;
			
			// add friction
			this.setFriction(0.5, 0.5);
			
			if (jsApp.entityPos != null) {
				this.pos.x = jsApp.entityPos.x;
				this.pos.y = jsApp.entityPos.y;
			}
			
			// set the display to follow our position on horizontal axis
			me.game.viewport.follow(this.pos, me.game.viewport.AXIS.HORIZONTAL);
			me.game.viewport.setDeadzone(0, 0);
			
			// walking animation
			this.addAnimation ("walk",  [0,1,2,3,4,5,6,7]);
			
			// set default one
			this.setCurrentAnimation("walk");
			
			// adjust animation timing
			this.animationspeed = me.sys.fps / 14;
			
			
			// adjust the collision box
			this.updateColRect(-1, -1 ,86,16);
			
			// some debugging stuff
			//me.debug.renderHitBox = true;
			
		},
	
		
		/* -----

			update the player pos
			
		------			*/
		update : function ()
		{
			if (me.input.isKeyPressed('left'))
			{
				this.vel.x -= this.accel.x * me.timer.tick;
				this.flipX(true);
			}
			else if (me.input.isKeyPressed('right'))
			{
				this.vel.x += this.accel.x * me.timer.tick;
				this.flipX(false);
			}
			
			else if (me.input.isKeyPressed('up'))
			{	
				this.vel.y -= this.accel.y * me.timer.tick;		
			}
			
			else if (me.input.isKeyPressed('down'))
			{	
				this.vel.y += this.accel.y * me.timer.tick;
			}
			
			
			
			// check & update player movement
			this.updateMovement();
			
			// check for collision with sthg
			me.game.collide(this);
			// actually we can also check here when we collide with 
			// doors, by checking the object return by the function.
			
			// check if entity is moving
			if (this.vel.x!=0 || this.vel.y!=0)
			{
				this.parent(this);
				return true;
			}
			return false;
		}

	});

	/*****************************************
	 *										 *
	 *			a door entity				 *
	 *										 *
	 *****************************************/
	var DoorEntity = me.InvisibleEntity.extend(
	{	
		init:function (x, y, settings)
		{
			// call the constructor
			this.parent(x, y, settings);
			
			// settings.demo_name was defined in Tiled
			this.demo_name = settings.demo_name.toUpperCase();
		},	

		// collision notification, something (obj) touched the door !
		onCollision : function (res, obj)
		{
			if (me.input.isKeyPressed('enter'))
			{
				// save the player last pos
				jsApp.entityPos = obj.pos.clone()
				jsApp.entityPos.y = 180;
				
				// if screen exists, go for it !
				
				var test = "jsApp.ScreenID." + this.demo_name;
				
				if(!eval("jsApp.ScreenID." + this.demo_name + "==undefined"))
				{
					me.state.change(eval("jsApp.ScreenID." + this.demo_name));
				}
				else
				{
					me.state.change(jsApp.ScreenID.TODO);
				}
			}
		},
		
	});

