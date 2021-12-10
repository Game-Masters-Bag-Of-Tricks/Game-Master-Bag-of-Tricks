var canvas = document.getElementById('game');//create canvas
var canvasContext = canvas.getContext('2d'); //make it 2d
var w = 20; //width of tiles
var rows = 50; //how many rows o
var cols= 50; //how many cols
var grid = []; //map
var rooms = []; //rooms
var collide = false; //whether or not the rooms are colliding
var amount = 0; //amount of rooms
var size = 5;	//the actuall size will be a number bettween 5 and 10 | e.g: size+sizeMin
var sizeMin = 5;
var corridorW = 1; //corridor width
var started = false;

///////// room names //////////////
var aspCount = 0;
var aspects = ["pond", "cottage", "garden", "town hall", "tavern", "shop", "cottage", "cottage", "garden", "cottage"];
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
			canvasContext.fillStyle = "#348C31"
			canvasContext.fillRect(this.x, this.y, w, w)
		}
		else
		{
			canvasContext.fillStyle = "#964B00"
			canvasContext.fillRect(this.x, this.y, w, w)
		}
		if (started){
			//color the pond
			canvasContext.fillStyle = "#0000FF"
			canvasContext.fillRect(rooms[0].x, rooms[0].y, rooms[0].w, rooms[0].h)
			//color the garden
			canvasContext.fillStyle = "#0c4b07"
			canvasContext.fillRect(rooms[2].x, rooms[2].y, rooms[2].w, rooms[2].h)
			if (amount >= 4) {
				//color the tavern
				canvasContext.fillStyle = "#8a7547"
				canvasContext.fillRect(rooms[3].x, rooms[3].y, rooms[3].w, rooms[3].h)
			}
			if (amount >= 5) {
				//color the tavern
				canvasContext.fillStyle = "#d0b16e"
				canvasContext.fillRect(rooms[4].x, rooms[4].y, rooms[4].w, rooms[4].h)
			}
			if (amount >= 6) {
				//color the tavern
				canvasContext.fillStyle = "#62594d"
				canvasContext.fillRect(rooms[5].x, rooms[5].y, rooms[5].w, rooms[5].h)
			}
			if (amount >= 9) {
				//color the tavern
				canvasContext.fillStyle = "#0c4b07"
				canvasContext.fillRect(rooms[8].x, rooms[8].y, rooms[8].w, rooms[8].h)
			}
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


function createRooms()//create the rooms
{
	for (var i = 0; i < amount; i++) //for the amount of rooms you want
	{
		console.log(size + " : " + sizeMin)
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
		canvasContext.fillStyle = "white"
		canvasContext.fillText(aspects[aspCount], this.x+this.w/2, this.y+this.h/2-20)
		if (aspCount < aspects.length-1)
			aspCount++
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
			size = 5
			sizeMin = 5
			break;
		case 2:
			ret = Math.floor((Math.random() * 3) + 6)
			size = 5
			sizeMin = 5
			break;
		case 3:
			ret = Math.floor((Math.random() * 10) + 10)
			size = 4
			sizeMin = 3
			break;
		case 4:
			ret = Math.floor((Math.random() * 50) + 30)
			size = 4
			sizeMin = 2
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

function gen(sizes)
{
	grid = []
	rooms = []
	aspCount = 0
	started = true

	amount = rand(parseInt(sizes));

	makeGrid()//make map
	createRooms()//make rooms
	draw()//update
}

