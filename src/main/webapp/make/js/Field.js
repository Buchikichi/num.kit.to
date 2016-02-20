/**
 * Field.
 */
function Field() {
	this.picX = 20;
	this.picY = 138;
	this.picW = 160;
	this.picH = 200;
	this.resetParams();
	this.init();
}

Field.prototype.resetParams = function() {
	this.x = 0;
	this.y = 0;
	this.magnification = 1;
	this.fixed = false;
};

Field.prototype.init = function() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.width = $(this.canvas).attr('width');
	this.height = $(this.canvas).attr('height');
	this.ox = this.picX + this.picW / 2;
	this.oy = this.picY + this.picH / 2;
	this.initImage();
	this.initBackground();
	this.initInfo();
};

Field.prototype.initImage = function() {
	var field = this;
	var img = new Image();

	this.img = img;
	this.img.onload = function() {
		field.x = -img.width / 2;
		field.y = -img.height / 2;
//		console.log('width:' + img.width);
//		console.log('height:' + img.height);
		field.draw();
	};
};

Field.prototype.initBackground = function() {
	this.bg = new Image();
	this.bg.src = '../img/bg.png';
};

Field.prototype.initInfo = function() {
	this.name = '';
	this.addr = '';
	this.dob = '';
	this.number = '';
	this.gender = '';
	this.appeal = '';
};

Field.prototype.setupImage = function(src) {
	this.img.src = src;
};

Field.prototype.moveH = function(delta) {
	if (!this.fixed) {
		this.x += delta;
	}
};

Field.prototype.moveV = function(delta) {
	if (!this.fixed) {
		this.y += delta;
	}
};

Field.prototype.drawFrame = function() {
	this.ctx.strokeStyle = 'rgba(16, 16, 16, 1.0)';
	this.ctx.strokeRect(this.picX, this.picY, this.picW, this.picH);
};

Field.prototype.splitText = function(text, width) {
	var ctx = this.ctx;
	var array = [];
	var textRows = text.split(/[\r\n]/);

	textRows.forEach(function(row) {
		var line = '';

		[].forEach.call(row, function(c) {
			var metrics = ctx.measureText(line + c);

			if (width < metrics.width) {
				if (array.length < 6) {
					array.push(line);
				}
				line = '';
			}
			line += c;
		});
		if (0 < line.length && array.length < 6) {
			array.push(line);
		}
	});
	return array;
};

Field.prototype.drawCard = function() {
	var ctx = this.ctx;
	var fontFamily = "'cursive'"; // 'ＭＳ 明朝'

	ctx.drawImage(this.bg, 0, 0);
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.font = "bold 26px " + fontFamily;
	ctx.fillText(this.name, 90, 43, 440);
	ctx.font = "bold 20px " + fontFamily;
	ctx.fillText(this.addr, 90, 90, 440);
	ctx.font = "bold 20px " + fontFamily;
	ctx.fillText(this.gender, 592, 112);
	ctx.font = "bold 16px " + fontFamily;
	ctx.fillText(this.dob, 300, 145, 300);
	ctx.font = "bold 38px " + fontFamily;
	ctx.fillText(this.number, 300, 210);
	// アピール
	ctx.font = "bold 20px " + fontFamily;
	var appeal = this.splitText(this.appeal, 380);
	var y = 262;

	appeal.forEach(function(line) {
		//ctx.strokeRect(238, y - 20, 380, 20);
		ctx.fillText(line, 238, y);
		y += 22;
	});
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	if (this.fixed) {
		ctx.beginPath();
		ctx.rect(this.picX, this.picY, this.picW, this.picH);
		ctx.clip();
	}
	if (this.img.src) {
		var sc = this.magnification;

		ctx.translate(this.ox, this.oy);
		ctx.scale(sc, sc);
		ctx.drawImage(this.img, this.x, this.y);
	}
	ctx.restore();
	if (this.fixed) {
		this.drawCard();
	} else {
		this.drawFrame();
	}
};

Field.prototype.getCanvasImage = function() {
	return this.canvas.toDataURL();
};
