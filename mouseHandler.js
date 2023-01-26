/*
©Danila Crazy

     ~~~~~ //// ////   //////  //  //  /////   //// ~
     ~~~~ //  // //  //    // //  //  //      //   ~~
     ~~~ //     //  //    // //  //  /////   //// ~~~
     ~~ //     //  //    // //  //     //   //   ~~~~
     ~ //     //   //////   ////   /////   //// ~~~~~
----------------------------------------------------------
~~~~~  //  //    //    //    // ////   //   //// //////  ~
~~~~  //  //  //  //  ////  // //  // //   //   //  //  ~~
~~~  //////  //  //  // // // //  // //   //// /////   ~~~
~~  //  //  //////  //  //// //  // //   //   //  //  ~~~~
~  //  //  //  //  //    // ////   //// //// //  //  ~~~~~

*/

/*

KEY IDs:
0 - left
1 - middle?
2 - right

*/

class MouseHandler {
	constructor (obj) {
		obj.tabIndex<0?obj.tabIndex=0:""
		this.obj = obj
		this.obj.mouseHandler = {}
		this.obj.mouseHandler.events = []
		this.obj.mouseHandler.pressed = []
		this.obj.mouseHandler.clicks = 0
	}

	start(period) {
		setInterval(this.tick, period,this)
	}

	tick(handler) {
		var h = handler.obj.mouseHandler
		for(let i = 0; i<h.events.length;i++ ) {
			let find = h.pressed[h.events[i].key]
			if(find) {
				h.events[i].func({x:h.x,y:h.y})
			}
		}
	}

	addEventMouseMove(callback) {
		this.obj.addEventListener("mousemove",callback)
	}

	addEventMouseDown(key,callback) {
		this.obj.addEventListener("mousedown",(event)=>{
			setTimeout(()=>{if((event.button == key) || (key == -1)) callback(event)},1)

		})
	}

	addEventMouseUp(key,callback) {
		this.obj.addEventListener("mouseup",(event)=>{
			if((event.button == key) || (key == -1)) callback(event)
		})
	}

	addEventDoubleClick(key,callback) {
		this.addEventMouseDown(key,(event)=>{

			this.obj.mouseHandler.clicks+=1
			if(this.obj.mouseHandler.clicks>1) callback(event)

			this.obj.mouseHandler.timer = setTimeout(()=>{this.obj.mouseHandler.clicks=0;this.obj.mouseHandler.timer = null},500)
		})
	}

	addEventMousePress(key,callback) {
		this.addEventMouseMove((event)=>{
			this.obj.mouseHandler.x = event.offsetX
			this.obj.mouseHandler.y = event.offsetY
		})

		this.obj.addEventListener("mousedown",(event)=>{
			this.obj.mouseHandler.pressed[event.button] = true
		})
		
		this.obj.addEventListener("mouseup",(event)=>{
			this.obj.mouseHandler.pressed[event.button] = false
		})

		this.obj.mouseHandler.events.push({key: key, func:callback})
	}
}