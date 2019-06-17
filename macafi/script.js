class Background {
	constructor(node) { // меньше - быстрее
		this.node = node
		this.background = 'img/bg-game.png';
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.offset = 8556 / 5000;
		this.currentOffset = 0;

		this.setCanvasZoom();
		this.setBackground();
		this.start();
	}

	start() {
		this.stop()
		this.timer = setInterval(() => {
			this.currentOffset += this.offset
			if (this.currentOffset > 8556) this.currentOffset = 0;

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
	}

	setBackground() {
		this.node.style.backgroundImage = `url(${this.background})`;
	}
}

class Canvas {
	constructor(canvas, modalFinish) {

		this.ctx = canvas.getContext('2d');
		this.ctxWidth = canvas.width;
		this.ctxHeight = canvas.height;
		this.firstImg = document.getElementById('first');
		this.secondImg = document.getElementById('second');

		this.headClose = document.getElementById('head-close');
		this.headOpen = document.getElementById('head-open');
		
		this.boostTimer = null;

		this.events = {};

		document.body.addEventListener('click', () => {
			this.clickHandler();
		})

		this.init();
		this.restart(); // с включением таймера нового уровня
	}

	init() {
		
		this.offsetDick = 3;
		this.currentOffsetDick = 1800; // начальное значение
		this.offsetDickY = 7;
		this.currentOffsetDickY = 0;

		this.speedForward = 2.5;
		this.speedBackward = 2.5;
		this.speedHead = this.speedBackward;
		this.currentOffsetHead = 400;
		this.faceOpen = false;
	}

	boostEnd() {
		
		this.offsetDick = 3;
		this.offsetDickY = 7;

		this.headClose = document.getElementById('head-close');
		this.headOpen = document.getElementById('head-open');

		this.speedForward = 2.5;
		this.speedBackward = 2.5;
		this.speedHead = this.speedBackward;

		//таймер повышения уровня
		this.levelUpTimer();
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
			//проверка на окончание игры
			if (this.currentOffsetHead + 70 < 0) {
				this.emit('emit-gameover');
				this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
				this.stop();
				this.stopFinishTimer();
				return;
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
			if (this.currentOffsetHead + this.headOpen.width / 2 > 960)
				this.currentOffsetHead -= this.speedBackward;			//вычисление сдвига img head (только назад)
			else
				this.currentOffsetHead -= this.speedHead;				//вычисление сдвига img head (в обе стороны)

			//очистка экрана под головой и сзади головы
			this.ctx.clearRect(0, 0, this.currentOffsetHead + 270, this.ctxHeight);
			this.ctx.clearRect(0, 500, this.currentOffsetHead + 300, this.ctxHeight);

			//определение цвета пикселей в области рта
			const colorTop = this.ctx.getImageData(this.currentOffsetHead + 375, 350, 1, 1).data
			const colorBottom = this.ctx.getImageData(this.currentOffsetHead + 375, 500, 1, 1).data
			
			//вычисление вертикального сдвига img dick
			if (colorTop[0] >= 0 && colorTop[1] >= 0 && colorTop[2] >= 0 && colorBottom[0] < 10 && colorBottom[1] < 10 && colorBottom[2] < 10) {
				this.currentOffsetDickY +=this.offsetDickY
			}

			if (colorTop[0] < 10 && colorTop[1] < 10 && colorTop[2] < 10 && colorBottom[0] >= 0 && colorBottom[1] >= 0 && colorBottom[2] >= 0) {
				this.currentOffsetDickY -=this.offsetDickY
			}

			this.drawHead();			
		}, 10)

		//открыть/закрыть
		this.timerEat = setInterval(() => {
			this.faceOpen = !this.faceOpen;
		}, 200)
	}

	restart() {
		this.start();
		this.headClose = document.getElementById('head-close');
		this.headOpen = document.getElementById('head-open');

		this.emit('emit-startgame')

		//таймер повышения уровня
		this.levelUpTimer();

		//таймер окончания
		this.setFinishTimer();
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
		if (this.faceOpen)
			this.ctx.drawImage(this.headOpen, this.currentOffsetHead, 0)
		else
			this.ctx.drawImage(this.headClose, this.currentOffsetHead, 0)
	}

	stop() {
		this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
		clearInterval(this.timer);
		clearInterval(this.timerEat);
		clearInterval(this.gameTimer);
		clearInterval(this.boostTimer);
	}

	stopFinishTimer() {
		clearInterval(this.finishTimer);
	}

	levelUp() {
		this.offsetDick = 5;
		this.offsetDickY = 9;
		this.speedBackward = 6;
		this.headClose = document.getElementById('head-close-speed');
		this.headOpen = document.getElementById('head-open-speed');
	}

	clickHandler() {
		this.speedHead = -this.speedForward;
		if (this.clickTimer)
			clearInterval(this.clickTimer)
		
		this.clickTimer = setTimeout(()=>{
			this.speedHead = this.speedBackward;
		}, 400)
	}

	levelUpTimer() {
		this.emit('emit-baff-disenable');
		this.gameTimer = setTimeout(() => {
			this.emit('emit-baff-enable');

			document.body.addEventListener('keypress', e => {
				if (e.code === "KeyR") {
					this.stop();
					this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
					this.emit('emit-levelup-enable');
					setTimeout(() => {
						this.emit('emit-levelup-disenable');
						this.init();
						this.levelUp();
						this.start();

						this.boostTimer = setTimeout(() => {
							this.emit('emit-boost-end');
							this.emit('emit-baff-disenable');

							this.boostEnd();
						}, 15000)
					}, 2000)
				}
			}, {once: true})
		}, 5000)
	}

	setFinishTimer() {
		this.finishTimer = setTimeout(() => {
			this.emit('emit-modal-finish');
			this.stop();
		}, 180000) 
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
}

class AudioList {
	constructor() {

		this.open = new Audio(document.getElementById('audio-open').getAttribute('src'));
		this.open.loop = true;
		this.open.play();

		this.lose = new Audio(document.getElementById('audio-lose').getAttribute('src'));
		this.levelUp = new Audio(document.getElementById('audio-levelup').getAttribute('src'));
		
		this.omnom = new Audio(document.getElementById('audio-omnom').getAttribute('src'));
		this.omnom.loop = true;
		
		this.speedOmnom = new Audio(document.getElementById('audio-omnom-speed').getAttribute('src'));
		this.speedOmnom.loop = true;

		this.win = new Audio(document.getElementById('audio-win').getAttribute('src'));
		this.win.loop = true;		
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

		this.speedOmnom.pause();
		this.speedOmnom.currentTime = 0;

		this.win.pause();
		this.win.currentTime = 0;
	}
}

window.addEventListener('load', () => {
	let modalGameOver = document.querySelector('.modal-gameover');
	let modalLevelUp = document.querySelector('.modal-levelup');
	let modalFinish = document.querySelector('.modal-finish');
	let baff = document.getElementById('baff');
	let wrap = document.getElementById('wrap');
	let bitcoin = document.getElementById('bitcoin');

	let canvas = document.getElementById('canvas');
	canvas.width = 1920;
	canvas.height = 900;

	let audio = new AudioList();

	let startGameBtn = document.getElementById('start-game');

	startGameBtn.addEventListener('click', () => {
		document.querySelector('.main').style.display = 'none';
		audio.stopAll();
		audio.omnom.play();

		wrap.classList.remove('no-visible');

		wrap = new Background(wrap);

		bitcoin = new Bitcoin(bitcoin);

		canvas = new Canvas(canvas);

		canvas.subscribe('emit-gameover', () => {
		 	modalGameOver.classList.add('active');
		 	wrap.stop();
		 	bitcoin.stop();
		 	audio.stopAll();
		 	audio.lose.play();
		});

		canvas.subscribe('emit-startgame', () => {
			bitcoin.start();
			wrap.start();
			audio.stopAll();
			audio.omnom.play();
		});

		canvas.subscribe('emit-baff-disenable', () => {
			baff.classList.remove('active');
		});
		
		canvas.subscribe('emit-baff-enable', () => {
			baff.classList.add('active');
		});

		canvas.subscribe('emit-levelup-enable', () => {
			modalLevelUp.classList.add('active');
			audio.stopAll();
			audio.levelUp.play();
		});

		canvas.subscribe('emit-levelup-disenable', () => {
			modalLevelUp.classList.remove('active');
			audio.stopAll();
		 	audio.speedOmnom.play();
		});

		canvas.subscribe('emit-boost-end', () => {
			audio.stopAll();
		 	audio.omnom.play();
		});

		canvas.subscribe('emit-modal-finish', () => {
			modalFinish.classList.add('active');
			wrap.stop();
		 	bitcoin.stop();
		 	audio.stopAll();
			audio.win.play();
		});


		let restartBtn = document.querySelectorAll('.restart-btn');
		restartBtn.forEach( item => {
			item.addEventListener('click', () => {
				modalGameOver.classList.remove('active');
				modalFinish.classList.remove('active');
				canvas.init();

				canvas.restart();
			})
		});
	})
	
})
