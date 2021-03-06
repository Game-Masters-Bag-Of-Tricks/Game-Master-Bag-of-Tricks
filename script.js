var canvas = document.getElementById('game');//create canvas
var canvasContext = canvas.getContext('2d'); //make it 2d
var w = 20; //width of tiles
var rows = 50; //how many rows o
var cols= 50; //how many cols
var grid = []; //map
var rooms = []; //rooms
var collide = false; //whether or not the rooms are colliding
var amount = 0; //10amount of rooms
var size = 5;	//the actuall size will be a number bettween 5 and 10 | e.g: size+sizeMin
var sizeMin = 5;
var disX; //distance x between rooms
var disY; //distance y between rooms
var corridorW = 1; //corridor width
var enemy = "n";
////////////////////////////////////////////////////////////////

function Cell(c, r, x, y)//cell object
	{
		this.c = c //column it is in
		this.r = r //row it is in
		this.x = x //x coord
		this.y = y //y coord
		this.empty = false //empty or full?
		
		this.show = function() //draw the map
			{
		  	if(this.empty == false)
		  		{
		  			canvasContext.fillStyle = "#4b442e"
		  			canvasContext.fillRect(this.x, this.y, w, w)
		  		}
		  	else 
		  		{
		  			canvasContext.fillStyle = "#BCAA74"
		  			canvasContext.fillRect(this.x, this.y, w, w)
		  		}
			}

		this.carve = function(dis, x, y)//carve out the rooms
			{
				for (var i = 0; i < rooms.length; i++) 
					{
						if(this.c >= rooms[i].y/w && this.c < rooms[i].y/w+rooms[i].h/w && this.r >= rooms[i].x/w && this.r < rooms[i].x/w+rooms[i].w/w)
							{
								this.empty = true
							}
					}
			}
			
		this.carveH = function(dis,x,y)//carve out the horizontal corridor
			{
				if(this.r >= x && this.r < x+dis && this.c < y+corridorW && this.c > y-corridorW)
					{
						this.empty = true
					}
			}
		this.carveV = function(dis,x,y)//carve out the vertical corridor
			{
				if(this.c >= y && this.c < y+dis && this.r < x+corridorW && this.r > x-corridorW)
					{
						this.empty = true
					}
			}
	}
  
function makeGrid()//create the array of tiles
 	{ 
  	for (var r = 0; r < rows; r++) 
  		{
    		for (var c = 0; c < cols; c++) 
    			{
    				var y = c*w
    				var x = r*w
     				var cell = new Cell(c, r, x, y);
      			grid.push(cell);
    			}
  		}
 	}

////////////////////////////////////////////////////////////////

function hCorridor(x1,x2,y1,y2)//horizontal corridor creator
	{
		if(x1 > x2)//if the first room is further towards the right then the second one
			{
				disX = x1-x2 //find the distance between rooms
				disX += 1
				
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x2, y2)//carve out the corridor
					}				
			}
		else//if the second room is further towards the right then the first one
			{
				disX = x2 - x1 //find the distance between rooms
				disX += 1
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x1, y1)//carve out corridor
					}
			}
			
	}
	
function vCorridor(x1,x2,y1,y2)//vertical corridor creator
	{
		var x;
		
		if(y1 > y2)//if the first room is further towards the bottom then the second one
			{
				disY = y1-y2 //find the distance between rooms
				disY += 1
				
				if(x2+(disX-1) > x1+(disX-1))//find the correct x coord
					{
						x = x2
					}
				else 
					{
					x = x2+(disX-1)
					}
				
				for(var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y2)//carve out corridor
					}
			}
		else//if the second room is further towards the bottom then the first one
			{
				disY = y2 - y1 //find the distance between rooms
				disY += 1
				
				if(x1+(disX-1) > x2+(disX-1))//find the correct x coord
					{
						x = x1
					}	
				else 
					{
						x = x1+(disX-1)
					}
					
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y1)//carve out corridor
					}
				
			}
			
	}

////////////////////////////////////////////////////////////////

function createRooms()//create the rooms
{
	for (var i = 0; i < amount; i++) //for the amount of rooms you want
	{
		var room = new Room(Math.floor(Math.random()*rows)+1, Math.floor(Math.random()*cols)+1, Math.floor(Math.random()*size)+sizeMin, Math.floor(Math.random()*size)+sizeMin, i)
		//create a room object ^

		if(i > 0)//if not the first room
		{
			if(rooms[0].x+rooms[0].w >= canvas.width || rooms[0].x <= 0 || rooms[0].y+rooms[0].h >= canvas.height || rooms[0].y <= 0)//if first room is outside the canvas
			{
				rooms = [] //restart
				createRooms();
				break;
			}

			for (var e = 0; e < rooms.length; e++) //for all the previous rooms
			{
				collide = false//they are not colliding

				if(room.x <= rooms[e].x+rooms[e].w && room.x+room.w >= rooms[e].x && room.y <= rooms[e].y+rooms[e].h && room.y+room.h >= rooms[e].y)//if colliding with previous room
				{
					collide = true;//kill room
					i--
					break;
				}
				else if (room.x+room.w >= canvas.width || room.x <= 0 || room.y+room.h >= canvas.height || room.y <= 0) //if outside of canvas
				{
					collide = true;//kill room
					i--;
					break;
				}
			}
		}

		if(collide == false)//if they have not collided
		{
			rooms.push(room) //add room to the array
			if(i>0)//make corridors
			{
				hCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
				vCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
			}
		}
	}
}
function Room(x, y, width, height, i)//room object
{
	this.x = (x-1)*w; //column
	this.y = (y-1)*w; //row
	this.w = width*w; //width
	this.h = height*w; //height

	this.center = [Math.floor(this.x/w+width/2), Math.floor(this.y/w+height/2)]//center

	this.draw = function()//draw the number of the room
	{
		if (enemy == "y") {
			if (tF())
				canvasContext.fillStyle = "red"
			else
				canvasContext.fillStyle = "white"
		} else
			canvasContext.fillStyle = "white"
		canvasContext.fillText(i, this.x+this.w/2, this.y+this.h/2-20)
	}
}
////////////////////////////////////////////////////////////////

 
function draw() 
	{
   	for (var i = 0; i < grid.length; i++) 
   		{
     		grid[i].carve();//carve out the rooms
     		grid[i].show();//draw the map
  		}
		
  	for (var i = 0; i < rooms.length; i++) 
  		{
  			rooms[i].draw();//draw the rooms number
  		}
  }

makeGrid()//make map
createRooms()//make rooms
draw()//update

function rand(num)
	{
		ret = 0;
		switch(num) {
			case 0:
				ret = Math.floor(Math.random()*4+1)
				ret = rand(ret)
				break;
			case 1:
				ret = Math.floor((Math.random() * 3) + 3)
				break;
			case 2:
				ret = Math.floor((Math.random() * 3) + 6)
				break;
			case 3:
				ret = Math.floor((Math.random() * 3) + 11)
				break;
			case 4:
				ret = Math.floor((Math.random() * 3) + 15)
				break;
			default:
				ret = 1;
				break;
		}
		return ret;
	}

function tF() {
	flip = Math.floor((Math.random() * 2) + 1);
	if (flip == 1)
		return true;
	else if (flip ==2)
		return false;
}

function gen(sizes, threats)
	{
		grid = []
		rooms = []

		//receive post function variables
		//size
		amount = rand(parseInt(sizes));

		//threats
		if (threats == "r")
			if (tF())
				threats = "y"
			else
				threats = "n"
		enemy = threats;

		
		makeGrid()//make map
		createRooms()//make rooms
		draw()//updates
	}

