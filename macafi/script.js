class Background {
	constructor(node) {
		this.node = node
		this.background = 'img/bg-game.png';
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.bgWidth = (10237 * this.height) / 1277
		this.offset = (this.bgWidth - this.width) / 12000;
		
		this.init();

		this.setCanvasZoom();
		this.setBackground();
	}

	init() {
		this.currentOffset = 0;
	}

	start() {
		this.stop()
		this.timer = setInterval(() => {
			this.currentOffset += this.offset
			if (this.currentOffset > this.bgWidth) {
				this.stop();
			}
			this.node.style.backgroundPositionX = -this.currentOffset + 'px'
		}, 10)
	}
	stop() {
		clearInterval(this.timer)
	}

	setCanvasZoom() {
		let zoomX = this.width / 1920;
		let zoomY = zoomX
		if (this.width <= 1368) {
			// zoomY = zoomY*1.3;
		}
		// const zoomY = zoomX;
		document.getElementById('canvas').style.transform = `scale(${zoomX}, ${zoomY})`;
		document.getElementById('speedup').style.transform = `scale(${zoomX}, ${zoomY})`;
	}

	setBackground() {
		this.node.style.backgroundImage = `url(${this.background})`;
	}
}

class Bitcoin {
	constructor(node) {
		this.node = node;
		this.numb = this.node.querySelector('span');
		this.moveTop = true;
		this.offsetX = 0;

		this.start();
	}

	start() {
		this.generateTimer();
	}

	stop() {
		clearInterval(this.timer);
	}

	generateTimer() {
		clearInterval(this.timer);
		this.timer = setTimeout(() => {
			const inner = Number(this.numb.innerText)
			if (inner >= 30000)
				this.moveTop = false;

			if (inner <= 10000)
				this.moveTop = true;

			let rand = 0;
			if (this.moveTop) {
				rand = this.getRandomInt(1000, 6000)
			}
			else {
				rand = this.getRandomInt(-1000, -6000)
			}

			this.numb.innerText = inner + rand;
			this.getTopOffset(inner + rand)

			this.generateTimer();
		}, this.getRandomInt(200, 2000));
	}

	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	getTopOffset(x) {
		this.offsetX = x * window.innerHeight / 40000;
		this.node.style.top = window.innerHeight - this.offsetX + 'px';
	}

	getValue() {
		return this.numb.innerText
	}
}

class AudioList {
	constructor() {

		this.open = new Audio(document.getElementById('audio-open').getAttribute('src'));
		this.open.loop = true;
		this.open.play();

		this.lose = new Audio(document.getElementById('audio-lose').getAttribute('src'));
		this.levelUp = new Audio(document.getElementById('audio-levelup').getAttribute('src'));
		this.choke = new Audio(document.getElementById('audio-choke').getAttribute('src'));
		
		this.omnom = new Audio(document.getElementById('audio-omnom').getAttribute('src'));

		this.win = new Audio(document.getElementById('audio-win').getAttribute('src'));
		this.win.loop = true;

		this.game = new Audio(document.getElementById('audio-game').getAttribute('src'));
		this.game.volume = 0.1;
		this.game.loop = true;		
	}

	stopAll() {
		this.open.pause();
		this.open.currentTime = 0;

		this.lose.pause();
		this.lose.currentTime = 0;

		this.levelUp.pause();
		this.levelUp.currentTime = 0;

		this.omnom.pause();
		this.omnom.currentTime = 0;

		this.win.pause();
		this.win.currentTime = 0;

		this.choke.pause();
		this.choke.currentTime = 0;

		this.game.pause();
		this.game.currentTime = 0;
	}
	stopInGame() {
		this.open.pause();
		this.open.currentTime = 0;

		this.lose.pause();
		this.lose.currentTime = 0;

		this.levelUp.pause();
		this.levelUp.currentTime = 0;

		this.omnom.pause();
		this.omnom.currentTime = 0;

		this.win.pause();
		this.win.currentTime = 0;

		this.choke.pause();
		this.choke.currentTime = 0;
	}
}

class Canvas {
	constructor(canvas, imgZoom) {

		this.ctx = canvas.getContext('2d');
		this.ctxWidth = canvas.width;
		this.ctxHeight = canvas.height;
		this.firstImg = document.getElementById('first');
		this.secondImg = document.getElementById('second');
		this.smash = document.getElementById('smash');
		this.speedUpImg = document.getElementById('speedup');

		this.headClose = document.getElementById('head-close');
		this.headOpen = document.getElementById('head-open');
		
		this.boostTimer = null;

		this.events = {};

		this.init();
		
		this.drawFirstDick();
		this.drawDick();
		this.drawHead();
	}

	init() {
		
		this.offsetDick = 2;
		this.currentOffsetDick = 1650; // начальное значение
		this.offsetDickY = 11;
		this.currentOffsetDickY = 0;

		this.speedForward = 3;
		this.speedBackward = 2;
		this.speedHead = this.speedBackward;
		this.currentOffsetHead = 400;
		this.faceOpen = false;
		this.moveHead = false;

		this.viewBaff = 0;
		this.baffRandom = true;
		this.choke = false;
		this.keypressEvent = e => {
			this.rKeyEvent(e)
		}
		this.pause = false;
		this.baffActive = false;
		this.smash.style.display = 'block';
		this.smash.style.opacity = 0; 
		this.timerCount = 0;
		this.finish = false;

		this.clickEvent = () => {
			this.clickHandler();
		}
		document.body.addEventListener('click', this.clickEvent)	
	}

	emit(eventName) {
		const event = this.events[eventName];
		if( event ) {
			event.forEach(fn => {
				fn.call(null);
			});
		}
	}
	subscribe(eventName, fn) {
		if(!this.events[eventName]) {
			this.events[eventName] = [];
		}

		this.events[eventName].push(fn);

		return () => {
			this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
		}
	}

	start() {
		this.timer = setInterval(() => {
			//счётчик итераций
			this.timerCount += 10;
			if (this.pause) return;

			if (this.timerCount > 120000) {
				this.emit('emit-modal-finish');
				this.stop();
				this.finish = true;
				this.smash.style.display = 'none'
				return;
			}

			//проверка на окончание игры
			if (this.currentOffsetHead + 70 < 0) {
				this.emit('emit-gameover');
				this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
				this.stop();
				this.stopFinishTimer();
				this.smash.style.display = 'none'
				return;
			}

			//smash opacity
			const smashWidth = this.currentOffsetHead + 70;
			if (smashWidth < 200) {
				this.smash.style.opacity = (200 - smashWidth) / 200; 
			}

			//полная очистка экрана
			this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);

			//вычисление сдвига img dick
			this.currentOffsetDick -= this.offsetDick;

			if (this.currentOffsetDick > 0) {
				this.drawFirstDick();
			}

			this.drawDick();

			//ограниение движения головы дальше середины экрана
			if (this.currentOffsetHead + this.headOpen.width / 2 > 1200)
				this.currentOffsetHead -= this.speedBackward;			//вычисление сдвига img head (только назад)
			else
				this.currentOffsetHead -= this.speedHead;				//вычисление сдвига img head (в обе стороны)

			//изменение скорости движения (скорость растёт от 2 до 9 на 50сек)
			if (this.timerCount < 50000) {
				this.offsetDick = 0.0004 * this.timerCount + 3;
				this.speedBackward = this.offsetDick;
			}
			if (this.timerCount > 110000) {
				this.offsetDickY = 20;
				this.offsetDick = 0.0004 * this.timerCount / 2 + 3;
				this.speedBackward = this.offsetDick;
			}


			//очистка экрана под головой и сзади головы
			this.ctx.clearRect(0, 0, this.currentOffsetHead + 270, this.ctxHeight);
			this.ctx.clearRect(0, 500, this.currentOffsetHead + 300, this.ctxHeight);

			//определение цвета пикселей в области рта
			const colorTop = this.ctx.getImageData(this.currentOffsetHead + 375, 325, 1, 1).data
			const colorBottom = this.ctx.getImageData(this.currentOffsetHead + 375, 525, 1, 1).data
			
			//вычисление вертикального сдвига img dick
			if (colorTop[0] >= 0 && colorTop[1] >= 0 && colorTop[2] >= 0 && colorBottom[0] < 10 && colorBottom[1] < 10 && colorBottom[2] < 10) {
				this.currentOffsetDickY +=this.offsetDickY
			}

			if (colorTop[0] < 10 && colorTop[1] < 10 && colorTop[2] < 10 && colorBottom[0] >= 0 && colorBottom[1] >= 0 && colorBottom[2] >= 0) {
				this.currentOffsetDickY -=this.offsetDickY
			}

			this.drawHead();			
		}, 10)
	}

	restart() {
		this.start();
		this.headClose = document.getElementById('head-close');
		this.headOpen = document.getElementById('head-open');

		this.emit('emit-startgame')

		//таймер бафа/дебафа
		this.changeBaff();

		//таймер рандомного бафа/дебафа
		this.timerRandomBaff();
	}

	drawDick() {
		this.ctx.drawImage(this.secondImg, this.currentOffsetDick, this.currentOffsetDickY)
		
		if (this.currentOffsetDick + this.secondImg.width < this.ctxWidth) {
			this.ctx.drawImage(this.secondImg, this.currentOffsetDick+this.secondImg.width, this.currentOffsetDickY)
		}
		if (this.currentOffsetDick + this.secondImg.width * 2 < this.ctxWidth) {
			this.currentOffsetDick = this.ctxWidth - this.secondImg.width
		}
	}

	drawFirstDick() {
		this.ctx.drawImage(this.firstImg, this.currentOffsetDick - this.firstImg.width, this.currentOffsetDickY)
	}

	drawHead() {
		if (this.baffActive) {
			if (this.faceOpen)
				this.speedUpImg.src = 'img/speed-open.png';
			else
				this.speedUpImg.src = 'img/speed-close.png';

			this.speedUpImg.style.left = `${this.currentOffsetHead - 420}px`;
		} else {
			if (this.faceOpen)
				this.ctx.drawImage(this.headOpen, this.currentOffsetHead, 0);
			else
				this.ctx.drawImage(this.headClose, this.currentOffsetHead, 0);
		}
	}

	stop() {
		this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
		clearInterval(this.timer);
		clearInterval(this.gameTimer);
		clearInterval(this.boostTimer);
		clearInterval(this.baffTimer);
		clearInterval(this.chokeTimer);
		document.body.removeEventListener('click', this.clickEvent)	
	}

	stopFinishTimer() {
		clearInterval(this.finishTimer);
	}

	clickHandler() {
		this.eatProcess();
		if (this.baffActive) {
			setTimeout(() => {
				this.eatProcess();
				setTimeout(() => {
					this.eatProcess();
				}, 400)
			}, 400)
		}
	}
	eatProcess() {
		if (!this.moveHead && !this.choke) {
			this.emit('emit-eat')
			this.speedHead = -this.speedForward;
			this.moveHead = true;
			
			setTimeout(() => {
				this.faceOpen = false;
			}, 125)

			setTimeout(() => {
				this.faceOpen = true;
			}, 275)

			setTimeout(()=>{
				this.speedHead = this.speedBackward;
				this.moveHead = false;
			}, 400)
		}
	}
	changeBaff() {
		this.baffTimer = setTimeout(() => {			
			if (this.baffRandom) {
				this.viewBaff = this.getRandomBool();
			} else {
				if (this.viewBaff) {
					this.viewBaff = 0;
				}
				else {
					this.viewBaff = 1;
				}
			}

			if (this.viewBaff)
				this.emit('emit-active-baff');
			else
				this.emit('emit-active-debaff');
			
			document.body.removeEventListener('keypress', this.keypressEvent)
			document.body.addEventListener('keypress', this.keypressEvent)

			this.changeBaff();
		}, this.getRandomInt(500, 2500))
	}
	timerRandomBaff() {
		this.baffRandomTimer = setTimeout(() => {
			this.baffRandom = true;
		}, 20000)
	}

	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	getRandomBool() {
		return Math.floor(Math.random() * 10) >= 4  ? 1 : 0;
	}
	
	rKeyEvent(e) {
		if (e.code == 'KeyR') {
			if (this.viewBaff) {
				this.emit('emit-speedup');
				this.baffActive = true;
				clearInterval(this.baffTimer);
				this.speedUpImg.style.display = 'block';
				setTimeout(() => {
					if (!this.finish)
						this.changeBaff();
					this.speedUpImg.style.display = 'none';
					this.baffActive = false;
					this.emit('emit-speedup-disabled');
				}, 7000)
			} else {
				this.choke = true;
				this.emit('emit-choke');
				clearInterval(this.baffTimer);
				this.headClose = document.getElementById('head-close-speed');
				this.headOpen = document.getElementById('head-open-speed');
				this.chokeTimer = setTimeout(() => {
					this.choke = false;
					if (!this.finish)
						this.changeBaff();
					this.headClose = document.getElementById('head-close');
					this.headOpen = document.getElementById('head-open');
				}, 2000)
			}
			
			document.body.removeEventListener('keypress', this.keypressEvent)
		}
	}
}



window.addEventListener('load', () => {
	let modalGameOver = document.querySelector('.modal-gameover');
	let modalFinish = document.querySelector('.modal-finish');
	let baff = document.getElementById('baff');
	let wrap = document.getElementById('wrap');
	let bitcoin = document.getElementById('bitcoin');

	let canvas = document.getElementById('canvas');
	canvas.width = 1920;
	canvas.height = 900;

	let audio = new AudioList();

	let startGameBtn = document.getElementById('start-game');

	startGameBtn.addEventListener('click', e => {
		e.stopPropagation();
		wrap.classList.remove('no-visible');
		wrap = new Background(wrap);
		canvas = new Canvas(canvas);

		document.body.addEventListener('click', () => {
			bitcoin = new Bitcoin(bitcoin);
			canvas.restart();
			wrap.start();
			audio.game.play();
			document.getElementById('tutorial').style.display = 'none';

			canvas.subscribe('emit-gameover', () => {
			 	modalGameOver.classList.add('active');
			 	baff.classList.remove('baff');
			 	baff.classList.remove('debaff');
			 	wrap.stop();
			 	bitcoin.stop();
			 	audio.stopAll();
			 	audio.lose.play();
			});

			canvas.subscribe('emit-startgame', () => {
				bitcoin.start();
				wrap.start();
				audio.stopAll();
				audio.game.play();
			});

			canvas.subscribe('emit-eat', () => {
				audio.stopInGame();
				audio.omnom.play();
			});

			canvas.subscribe('emit-choke', () => {
				baff.classList.remove('baff')
				baff.classList.remove('debaff')
				audio.stopInGame();
				audio.choke.play();
			});

			canvas.subscribe('emit-speedup', () => {
				audio.levelUp.play();
				baff.classList.remove('baff')
				baff.classList.remove('debaff')
			});

			canvas.subscribe('emit-speedup-disabled', () => {
				audio.game.play();
			});
			
			canvas.subscribe('emit-active-baff', () => {
				baff.classList.remove('debaff');
				baff.classList.add('baff');
			});

			canvas.subscribe('emit-active-debaff', () => {
				baff.classList.remove('baff');
				baff.classList.add('debaff');
			});

			canvas.subscribe('emit-modal-finish', () => {
				modalFinish.classList.add('active');
				wrap.stop();
			 	bitcoin.stop();
			 	baff.classList.remove('baff');
				baff.classList.remove('debaff');
			 	document.getElementById('win-value').innerText = bitcoin.getValue().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
			 	audio.stopAll();
				audio.win.play();
			});


			let restartBtn = document.querySelectorAll('.restart-btn');
			restartBtn.forEach( item => {
				item.addEventListener('click', e => {
					e.stopPropagation();
					modalGameOver.classList.remove('active');
					modalFinish.classList.remove('active');
					canvas.init();
					wrap.init();
					canvas.restart();
				})
			});
		}, {once: true})

		document.querySelector('.main').style.display = 'none';
		audio.stopAll();
	})	
})
