/*
~~~~~  ////   //   // //////// ////////  //////  //    //  ~
~~~~  // //  //   //    //       //    //    // ////  //  ~~
~~~  ////   //   //    //       //    //    // // // //  ~~~
~~  // //  //   //    //       //    //    // //  ////  ~~~~
~  ///      ///      //       //     //////  //    //  ~~~~~

~~~~~  //  //    //    //    // ////   //   //// //////  ~~~
~~~~  //  //  //  //  ////  // //  // //   //   //  //  ~~~~
~~~  //////  //  //  // // // //  // //   //// /////   ~~~~~
~~  //  //  //////  //  //// //  // //   //   //  //  ~~~~~~
~  //  //  //  //  //    // ////   //// //// //  //  ~~~~~~~

*/

class ButtonHandler {
	constructor (obj){
		obj.tabIndex<0?obj.tabIndex=0:""
		this.obj = obj
		this.obj.buttonHandler = {}
		this.obj.buttonHandler.pressed = {}
		this.obj.buttonHandler.axis = []
		this.checkButton = false
		if(this.checkButton) {
			this.obj.addEventListener("keyup",(event)=>{
				console.log(event.key)
			})
		}
		this.obj.buttonHandler.events = []
	}

	start(period) {
		setInterval(this.tick, period,this)
	}

	tick(handler) {
		var h = handler.obj.buttonHandler
		for(let i = 0; i<h.events.length;i++ ) {
			let find = h.pressed[h.events[i].key]
			if(find) {
				handler.obj.buttonHandler.events[i].func()
			}
		}
	}

	hideContextMenu() {
		this.obj.addEventListener('contextmenu', event => event.preventDefault());
	}
	
	addEventKeyDown(keyId,func){
		this.obj.addEventListener("keydown",(event)=>{
			if (event.code=="Key"+keyId) {
				func()
				this.obj.buttonHandler.pressed[keyId] = true
			}
		})
		this.addEventKeyUp(keyId,()=>{
			this.obj.buttonHandler.pressed[keyId] = false
		})
	}

	addEventKeyUp(keyId,func){
		this.obj.addEventListener("keyup",(event)=>{
			if (event.code=="Key"+keyId) {
				func()
				this.obj.buttonHandler.pressed[keyId] = null
			}
		})
	}

	addEventKeyUp2(keyId,func){
		this.obj.addEventListener("keyup",(event)=>{
			if (event.key==keyId) {
				func()
				this.obj.buttonHandler.pressed[keyId] = false
			}
		})
	}

	addEventKeyPress(keyId,func){
		this.obj.addEventListener("keydown", (event)=>{
			this.obj.buttonHandler.pressed[event.code] = true
		})

		this.obj.addEventListener("keyup", (event)=>{
			this.obj.buttonHandler.pressed[event.code] = false
		})

		this.obj.buttonHandler.events.push({key: "Key"+keyId, func:func})
	}
}