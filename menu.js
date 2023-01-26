///////////////////////////////////////////////////////////

class Menu {
	constructor(pos, size, name, mouseHandler) {
		this.name = name
		this.x = pos.x
		this.y = pos.y
		this.width = size.width
		this.height = size.height
		this.punkts = []
		this.fontSize = theme.font.size
		this.titleHeight = theme.font.size
		this.mouseHandler = mouseHandler

		this.punktSize = {
			width: this.width,
			height: this.height - this.fontSize
		}
	}

	addPunkt(text,callback) {
		this.punkts.push(new MenuPunkt(text,callback,this,this.punkts.length))
	}

	resize() {
		this.punktSize = {
			width: this.width,
			//////// MENU HEIGHT - HEADER HEIGHT   /               punkts count
			height: (this.height - this.titleHeight ) / (this.punkts.length!=0?this.punkts.length:1)
		}

		this.fontSize = Math.min(this.fontSize, Math.floor(this.punktSize.height))

		for(var i = 0;i<this.punkts.length;i++ ) {
			this.punkts[i].resize(this.punktSize)
		}
	}
}

class MenuPunkt {
	constructor (text,callback,menu,index) {
		this.text = text
		this.callback = callback
		this.x = menu.x
		this.y = menu.y
		this.index = index
		this.mouseHandler = menu.mouseHandler
		this.parent = menu

		this.mouseHandler.addEventMouseDown(0,(event)=>{
			if(intersection(event,this,this)) {
				this.callback()
			}
		})
	}

	resize(size) {
		this.height = size.height
		this.width = size.width
		this.y = this.parent.y + this.parent.titleHeight + (this.index * this.height)
		this.x = this.parent.x 
	}
}