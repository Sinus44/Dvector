class Vector2 {
	constructor( point = {x:100, y:0},sp = {x:0,y:0}) {
		this.x = point.x || 0;
		this.y = point.y || 0;

		this.sx = sp.x
		this.sy = sp.y

		this.len = this.length()
		this.rotate = this.getAng()
	}
	
	setStartPos(a) {
		return new Vector2(this,{x:a.x,y:a.y})
	}

	setAng(a) {
		this.rotate = a
		this.x = this.len*Math.cos(a)
		this.y = this.len*Math.sin(a)
	}

	getAng(b={x:1,y:0}) {
		return Math.atan2(this.y-b.y, this.x-b.x)
	}

	addAng(a) {
		this.setAng(this.rotate + a)
	}

	setAngN(a) {
		return new Vector2({x:this.len*Math.cos(a),y:this.len*Math.sin(a)})
	}

	add (b) { // Cумма векторов
		return new Vector2({x: this.x + b.x,  y: this.y + b.y});
	};

	sub (b) { // вычитание вектора
		return new Vector2({x: this.x - b.x,  y: this.y - b.y})
	};

 	mulS (b) { // Умножение на вектор
 		return new Vector2({x: this.x * b.x,  y: this.y * b.y})
 	};

 	mul (b) { // Умножение на число
 		return new Vector2({x: this.x * b,  y: this.y * b})
 	}

 	dot (b) { // Скалярка
 		return this.x * b.x + this.y * b.y
 	};

 	length(b=this)  {
 		return Math.sqrt(b.x * b.x + b.y * b.y)
 	};

 	norm()  {
 		return new Vector2({x:this.x / this.len, y:this.y / this.len})
 	};
}