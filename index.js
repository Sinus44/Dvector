var can,
	ctx,
	center = {},
	bh,
	mh,
	vectors = [],
	blocks = [],
	menus = [],
	frames = 0,
	selectedBlock = -1,
	temp,
	prevFrames = 0,
	mouse = {x:0,y:0};

var theme = themeBlack // themeBlack / themeWhite

var localization = ru // ru / en

var settings = {
	blocksBack: {
		x:0,
		y:80,
		width: 100,
		height: 20
	},

	draw: {
		fps:250,
	},

	size: {
		width: 0,
		height: 0,
		percent: {
			width: 0,
			height: 0
		}
	},

	gridSize: 50,

	scale: {
		width: 10,
		height: 10
	},

	arrow: {
		ang: Math.PI*0.9, // 180*x
		distance: 0.1
	},

	buttonUpd: 10,

	speed: 3
}

window.onload = (e) => {
	setup()
	setInterval(draw,1000/settings.draw.fps)
	window.addEventListener('resize', resize);
}

function resize () {
	//console.log("resize")
	settings.size = {
		width: document.documentElement.clientWidth,
		height: document.documentElement.clientHeight,
		percent: {
			width: document.documentElement.clientWidth/100,
			height: document.documentElement.clientHeight/100
		}
	}

}

function setup() {
	resize()

	can = document.getElementById("can");
	//can.addEventListener("touchmove",(e)=>{console.log("Aga")},false)

	ctx = can.getContext("2d");
	
	can.width = width = settings.size.width;
	can.height = height = settings.size.height;
	
	center = {
		x:Math.floor(width/2),
		y:Math.floor(height/2)
	}

	bh = new ButtonHandler(can)
	
	bh.addEventKeyPress("W",()=>{center.y+=settings.speed})
	bh.addEventKeyPress("S",()=>{center.y-=settings.speed})
	bh.addEventKeyPress("A",()=>{center.x+=settings.speed})
	bh.addEventKeyPress("D",()=>{center.x-=settings.speed})
	
	bh.addEventKeyDown("E",()=>{
		temp = prompt(localization.fileName)
		if (temp == null ) {return} else if(temp == "") {name = "default name.jpg"}  else {name = temp+".jpg"}

		var dataURL = can.toDataURL("image/jpeg");
		var link = document.createElement("a");
		link.href = dataURL;
		link.download = name
		link.click();
		link.remove();
		alert(localization.screenshot)
	})
	//bh.addEventKeyDown2("W",()=>{console.log("Hahaha")})

	bh.hideContextMenu()
	document.body.style.overflow='hidden';

	mh = new MouseHandler(can)

	//mh.addEventMousePress(0,(e)=>{
	//	setColor("#00F")
	//	drawRect({x:e.x-10,y:e.y-10},{width:20,height:20})
	//})
	
	mh.addEventMouseMove((event)=>{
		mouse.x = event.offsetX
		mouse.y = event.offsetY
	})

	mh.addEventMouseDown(0,(event)=>{
		for(var i = 0; i < blocks.length; i++) {
			if(intersection(event,blocks[i],blocks[i])) {
				blocks[i].click()
				return
			}
		}
	})

	var menu = new Menu(PTP({x:2,y:2}),PTP({width:13,height:23}),"logic",mh)
	
	menu.addPunkt("vector", ()=>{blocks.push(new Block(blocks.length,"vector", mh, new Vector2()))})
	menu.addPunkt("norm", ()=>{blocks.push(new Block(blocks.length,"norm", mh ))})
	menu.addPunkt("add", ()=>{blocks.push(new Block(blocks.length,"add", mh ))})
	menu.addPunkt("mul", ()=>{blocks.push(new Block(blocks.length,"mul", mh ))})
	menu.addPunkt("draw", ()=>{blocks.push(new Block(blocks.length,"draw", mh ))})
	menu.addPunkt("sub", ()=>{blocks.push(new Block(blocks.length,"sub", mh ))})
	menu.addPunkt("num", ()=>{blocks.push(new Block(blocks.length,"num", mh ))})
	menu.addPunkt("rot", ()=>{blocks.push(new Block(blocks.length,"rot", mh ))})
	menu.addPunkt("pos", ()=>{blocks.push(new Block(blocks.length,"pos", mh ))})
	
	menu.resize()
	menus.push(menu)

	var menu2 = new Menu(PTP({x:2,y:27}),PTP({width:13,height:23}),"settings",mh)
	
	menu2.addPunkt("changeTheme", ()=>{switch(prompt(localization.themeSelection)) { case "black": theme = themeBlack; break; case "white": default: theme = themeWhite; break; }})
	menu2.addPunkt("changeGridScale", ()=>{settings.scale.width = Number(prompt(localization.changeGridScaleQuestion)) || 1; settings.scale.height = settings.scale.width})
	menu2.addPunkt("changeGridSize", ()=>{settings.gridSize = Number(prompt(localization.changeGridSizeQuestion)) || 50})
	menu2.addPunkt("changeLanguage",  ()=>{switch(prompt(localization.changeLanguageQuestion).toLowerCase()) { case "en": localization = en; break; case "ru": default: localization = ru; break; }})
	menu2.addPunkt("help",()=>{ window.location.href = "help.html"})
	menu2.addPunkt("clear",()=>{ location.reload() })
	
	menu2.resize()
	menus.push(menu2)

	mh.start(settings.buttonUpd)
	bh.start(settings.buttonUpd)
}

function draw() {
	clear()
	drawAxis()
	drawGrid()
	start()
	//drawVectors()
	// GUI---------
	drawBlocks()
	drawMenu()
	drawMousePos()
	//drawPoints()
	frames++
}

//function drawPoints() {
//
//} 

function start() {
	for(i=0;i<blocks.length;i++) {
		blocks[i].start()
	}
}

function clear() {
	setColor(theme.background)
	drawRect({x:0,y:0},settings.size)
}

function drawAxis() {
	setColor(theme.axis)
	setWidth(4)
	drawLine({x:center.x,y:0},{x:center.x,y:height})
	drawLine({x:0,y:center.y},{x:width,y:center.y})
}

function drawGrid() {
	setWidth(1)
	setColor(theme.grid)
	
	// OX+
	for( i = 1;i<(width-center.x)/settings.gridSize;i++) {
		x = center.x+(i*settings.gridSize)
		drawLine({x:x,y:0},{x:x,y:height})
	}
	
	// OX-
	for( i = -1;i>(-center.x)/settings.gridSize;i--) {
		x = center.x+(i*settings.gridSize)
		drawLine({x:x,y:0},{x:x,y:height})
	}
	
	// OY+
	for( i = 1;i<(height-center.y)/settings.gridSize;i++) {
		y = center.y+(i*settings.gridSize)
		drawLine({x:0,y:y},{x:width,y:y})
	}
	
	// OY-
	for( i = -1;i>(-center.y)/settings.gridSize;i--) {
		y = center.y+(i*settings.gridSize)
		drawLine({x:0,y:y},{x:width,y:y})
	}
}

function drawVectors() {
	for( i = 0; i < vectors.length; i++ ) {
		if(vectors[i].draw!=true) continue
		drawVector(i) 
	}
}

function drawVector(i) {
	setWidth(theme.width)
	setColor(theme.vector)
	//setFont(theme.font)
	
	if (typeof i == "Number") {
		i = vectors[i]
	}
	
	obj = new Vector2({x:i.x,y:-i.y}) // Сам вектор
	
	var offset = {x:i.sx,y:-i.sy} // начальная точка
	var endP = {x:obj.x+i.sx,y:obj.y-i.sy} // конечная точка вектора на сетке
	
	var arrow1 = COG(obj.norm().setAngN( settings.arrow.ang+obj.getAng()).mul(obj.length()*settings.arrow.distance).add(obj).add(offset))
	var arrow2 = COG(obj.norm().setAngN(-settings.arrow.ang+obj.getAng()).mul(obj.length()*settings.arrow.distance).add(obj).add(offset))
	
	drawLine(COG(endP),arrow1)
	drawLine(COG(endP),arrow2)
	drawLine(COG(endP),COG(offset))
}

function drawBlocks() {
	setColor(theme.background)
	setWidth(theme.linksWidth)
	drawRect(PTP(settings.blocksBack),PTP(settings.blocksBack))
	//setFont(theme.font)
	setColor(theme.blocks)

	for(i = 0; i<blocks.length; i++) {
		setColor(blocks[i].selected?theme.blocksSelected:theme.blocks)
		drawRect(blocks[i],blocks[i])
		setColor(theme.text)
		drawText2(`${i+1} ${localization[blocks[i].type]} ${blocks[i].addstr}`,blocks[i],blocks[i],true,theme.font)
		for(j = 0; j<blocks[i].connections.length; j++) {
			setColor("#F00")
			con = blocks[i].connections[j]
			drawLine(
				{x:blocks[i].x+blocks[i].width,y:blocks[i].y+blocks[i].height*0.5},
				{x:con.x,y:con.y+con.height*0.5}
			)
		}
	}
}

function drawMenu() {
	for(var i=0;i<menus.length;i++) {
		//setFont(theme.font)
		setColor(theme.menu)
		drawRect(menus[i],menus[i])

		setColor(theme.text)
		drawText2(localization[menus[i].name],menus[i],menus[i],true,theme.font)
		for(var j = 0; j<menus[i].punkts.length; j++) {
			var punkt = menus[i].punkts[j]
			setColor(theme.text)
			drawText2(localization[punkt.text],punkt,punkt,true,theme.font)
		}
	}
}

function drawMousePos() {
	//setFont(theme.font)

	x = mouse.x - center.x // пикселей от центра
	y = -mouse.y + center.y
	
	x1 = ( x / settings.gridSize ) // Клеток от центра
	y1 = ( y / settings.gridSize )
	
	x3 = mouse.x // пикселей
	y3 = -mouse.y
	
	x4 = x1 * settings.scale.width   // Единиц
	y4 = y1 * settings.scale.height

	drawText2(`X: ${Math.floor(x4*10)/10} Y: ${Math.floor(y4*10)/10}`,PTP({x:2,y:98}),PTP({width:96,height:5}),false,theme.font)
}

/*
function cookieSave() {
	document.cookie = `t`
}

function cookieLoad() {

}
*/

///////////////////////////////////////////////////////////

class Block{
	constructor(index, type, mh, parent) {
		this.index = index
		this.mouseHandler = mh
		this.type = type
		this.parent = parent
		
		this.width = (PTP(settings.blocksBack).width/100)*15
		this.height = (PTP(settings.blocksBack).height/100)*20

		this.maxBlocks = Math.floor(settings.size.width/this.width)
		this.x = PTP(settings.blocksBack).x+(index-Math.floor(index/this.maxBlocks)*this.maxBlocks)*this.width
		this.y = PTP(settings.blocksBack).y

		this.selected = false
		this.useParent = true

		this.connections = [] // подключение от этого к другому (спереди)
		this.connectionsB = [] // подключения к этому от другого (сзади)

		this.last = null
		this.addstr = ""

		this.mouseHandler.addEventMouseDown(2,(event)=>{
			if(selectedBlock==-1) {
				//console.log("Блок не выделен. Отмена действий")
				return	
			}
			blocks[selectedBlock].x = event.x-this.width/2
			blocks[selectedBlock].y = event.y-this.height/2		
		})

		this.mouseHandler.addEventMousePress(3,(event)=>{
			if(selectedBlock==-1) return;	
			blocks[selectedBlock].x = event.x-this.width/2
			blocks[selectedBlock].y = event.y-this.height/2
			
		})

		this.create()
	}

		click() {
			 // Мышкой нажали по блоку
				if (selectedBlock == -1) {  // Если ничего не выделено
					this.selected = true // выделяем этот блок
					selectedBlock = this.index // записываем в переменную что мы выделили этот блок
				} else if(selectedBlock == this.index) { // нажали по этому же блоку
					this.selected = false // Снимаем выделение
					selectedBlock = -1 // Снимаем выделение
				} else if (selectedBlock != this.index) { // Кликнули по этому блоку хотя какой то уже выделен
					if(!this.useParent) { // Если этот блок нельзя подключать
						alert(localization.cannotBeConnectedTo)
						return
					}
					if(blocks[selectedBlock].connections.includes(this)) { // Если уже есть такое соединение
						alert(localization.thereIsAlready) // Выводим ошибку 
						return // Отменяем
					} else if (this.connections.includes(blocks[selectedBlock])) { // Если этот блок подключен к родителю, а родитель к этому нет
						alert(localization.ringConnection) // Выводим ошибку
						return // Отменяем
					}

					if(!blocks[selectedBlock].connectFrontFirstEvent(this)) { // Дополнительные условия Event'a "connectBackFirstEvent" / Для каждого типа блоков
						return // Отменяем
					}

					if(!this.connectBackFirstEvent(blocks[selectedBlock])) { // Дополнительные условия Event'a "connectBackFirstEvent" / Для каждого типа блоков
						return // Отменяем
					}

					this.last = blocks[selectedBlock]
					this.last.connections.push(this)
					//console.log(this.parent)
					if(this.last.useParent) this.parent = this.last.parent
					//console.log(this.parent)	
					this.connectionsB.push(this.last)

					if(!this.connectBackEvent(this.type)) { 
						return
					}

					this.last.connectFrontEvent()
					this.selected = false
					this.last.selected = false 
					selectedBlock = -1
				}
			
		}

	create() {
		// Событие создания
		switch (this.type) {
			case "num":
				this.useParent = false
				this.num = Number(((temp = prompt(localization.numberQuestion))!=null)?temp:this.num)
				
				this.addstr = `( ${Math.floor(this.num*10)/10} )`
				break;
			case "vector":
				x = Number(((temp = prompt(localization.vectorXQuestion))!=null)?temp:x)
				y = Number(((temp = prompt(localization.vectorYQuestion))!=null)?temp:y)
				this.parent = new Vector2({x:x,y:y})
				this.addstr = `X:${x} Y:${y}`
				break;
		}
	}

	connectFrontFirstEvent(parent) {
		// события для блоков происходящие при подключении этого блока (спереди) до указания родителя
		switch (this.type) {
			case "draw":
				alert(localization.cannotBeConnected)
				return false
				break;
		}
		return true
	}


	connectFrontEvent() {
		// события для блоков происходящие при подключении этого блока (спереди)
		switch (this.type) {
			case "draw":
				break;
			case "norm":
				break;
			case "mul":
				break;
			case "num":
				break;
		}
	}

	connectBackFirstEvent(parent) { // Событие блока при подключении к этому блоку сзади, до указателя родителя
		switch (this.type) {
			case "draw":
			//case "norm":
				if (!parent.parent) {
					alert(localization.parentNotConnected)
					return false
				}

				if (parent.parent.constructor.name!="Vector2" ) {
					alert(localization.parentNotVector)
					return false
				}
				break;
			case "norm":
				if (!parent.parent) {
					alert(localization.parentNotConnected)
					return false
				}

				if (parent.parent.constructor.name!="Vector2" ) {
					alert(localization.parentNotVector)
					return false
				}
				break;
		}
		return true
	}

	connectBackEvent() {
		// события для блоков происходящие при подключении к этому блоку (сзади)
		switch (this.type) {
			case "draw":
				this.addstr = `X:${Math.floor(this.parent.x*10)/10} Y:${Math.floor(this.parent.y*10)/10}`
				break;

			case "norm":
				this.parent = this.parent.norm();
				break;

			case "mul":
				if(this.parent) {
					this.parent = this.parent.mulS(this.connectionsB[0].parent)
				}
				break;
			
			case "pos":
				if(this.connectionsB.length>1) {
					this.parent = this.parent.setStartPos(this.connectionsB[0].parent)
					//this.useParent = falseг
				}
				break;	

			case "rot":
				if (this.last.type == "num") {
					this.num = this.last.num
				}

				if (this.parent && this.num) {
					this.parent = this.parent.setAngN(this.num)
				}
				break;

			case "num":
				break;

			case "add":
				if(this.parent) {
					this.parent = this.parent.add(this.connectionsB[0].parent)
				}
				break;
			
			case "sub":
				if(this.parent) {
					this.parent = this.connectionsB[0].parent.sub(this.parent)
				}
				break;
		}
		return true;
	}

	connectedStart() {
		// Вызов действий блока с каждой отрисовкой
		// Если этот блок имеет вход
		switch (this.type) {
			case "draw":
				drawVector(this.parent)
				break;
			case "norm":
				break;
			case "mul":
				break;
			case "num":
				break;
		}
	}

	startEvent() {
		// Вызов действий блока с каждой отрисовкой
		// Если этот блок не имеет вход
		switch (this.type) {
			case "draw":
				break;
			case "norm":
				break;
			case "mul":
				break;
			case "num":
				break;
		}
	}

	start() {
		// Вызов действий блока с каждой отрисовкой
		if (!this.last) {
			for(var j=0;j<this.connections.length;j++) {
				this.connections[j].start()
			}
			this.startEvent()
		} else this.connectedStart()
	}
}