function setColor(color) {
	ctx.strokeStyle = color
	ctx.fillStyle = color
}

function COG(pos) {
	return {
		x: center.x + (pos.x / settings.scale.width) * settings.gridSize,
		y: center.y + (pos.y / settings.scale.height) * settings.gridSize
	}
}

function setWidth(w) {
	ctx.lineWidth = w
} 

function PTP(a) {
	return {x: a.x * settings.size.percent.width, y: a.y * settings.size.percent.height, width:a.width * settings.size.percent.width, height: a.height * settings.size.percent.height}
} 

function intersection(pos1, pos2, size) {
	return ((pos2.x + size.width >= pos1.x) & (pos1.x >= pos2.x) & (pos2.y + size.height >= pos1.y) & (pos1.y >= pos2.y))
} 

function drawLine(pos1, pos2) {
	ctx.beginPath()
	ctx.moveTo(pos1.x, pos1.y);
	ctx.lineTo(pos2.x, pos2.y);
	ctx.stroke()
}

function drawRect(pos, size) {
	ctx.fillRect(pos.x,pos.y,size.width,size.height)
}

function getFont() {
	font = ctx.font.match(/^([0-9]+)px ([^]+)/i)
	return {size: Number(font[1]), name: font[2]}
}

function drawText2(text, pos, size, orientation, f) {
	ctx.font = Math.min(f.size, Math.floor(size.height)) + "px " + f.name
	ctx.fillText(text, pos.x, pos.y + (orientation ? getFont().size : 0), size.width)
}