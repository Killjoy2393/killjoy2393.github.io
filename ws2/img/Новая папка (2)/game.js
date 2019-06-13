let newGame = document.querySelector('.new');
let mainScreen = document.querySelector('.main')

newGame.addEventListener('click', showGame);

function showGame() {
    mainScreen.classList.add('hide');
}

const cvs = document.getElementById('macafi');
const ctx = cvs.getContext('2d');
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
cvs.width = maxWidth;
cvs.height = maxHeight;


//Game vars and consts
let frames = 0;

//Load sprite Image
const sprite = new Image();
sprite.src = "sprite13.png";

//Game State
const state = {
    current : 0,
    mainScreen : 0,
    game :1,
    gameOver : 2
}
//Control the Game
cvs.addEventListener("click", function() {
    switch(state.current) {
        case state.mainScreen:
            state.current = state.game;
            break;
        case state.game:
            head.eat();
            break;
        case state.gameOver:
            state.current = mainScreen;
            break;

    }
});
//background image

const bg = {
    sX : 0,
    sY : 2497,
    w : 3600,
    h : 900,
    x : 0,
    y : cvs.height - 900,

    dx : 5,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update : function() {
        if(state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}
//Dick
const dick = {
    sX : 1020,
    sY : 1170,
    w : 950,
    h : 176,
    x : 1100,
    y : cvs.height - 350,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        setInterval(() => {
            this.moveDick();
        }, 1000);
    },
    
    moveDick : function() {
        this.x = this.x - 1;
    }
}


//Head
const head = {
    animation : [
        {sX: 0, sY: 0},
        {sX: 426, sY: 0},
        {sX: 0, sY: 0},
        {sX: 426, sY: 0}
    ],
    x : 300,
    y : 500,
    w : 419,
    h : 609,

    frame : 0,

    moveBackward :0.25,
    moveForward : 4.6,
    speed :0,

    draw : function() {
        let head = this.animation[this.frame];

        ctx.drawImage(sprite, head.sX, head.sY, this.w, this.h, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    },

    eat : function() {
        this.speed = -this.moveForward;
    },

    update : function() {
        // If the game state is mainScreen , the head must eat slowly
        this.period = state.current == state.mainScreen ? 1 : 8;
        //We increment the frame by 1, each period
        this.frame += frames%this.period == 0 ? 1 : 0;
        //Frame goes from 0 to 4, then again to 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.mainScreen) {
            this.x = 300; ///reset position head
        }else{
            this.speed += this.moveBackward;
            this.x -= this.speed;
///Выход за экран тогда проигрыш
            if(this.x + this.w/2 <= cvs.width - bg.w/2) {
                this.x = cvs.width - bg.w/2 - this.w/2;
                if(state.current == state.game) {
                    state.current = state.gameOver;
                }
            }
        }
      }
}
// //Main Screen
// const mainScreen = {
//     sX : 0,
//     sY : 1414,
//     w : maxWidth,
//     h : maxHeight,
//     x : cvs.width/2 - maxWidth/2,
//     y : 0,
    

//     draw : function() {
//         if(state.current == state.mainScreen){
//             ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
//         }
//     }
    
// }
//Game Over
const gameOver = {
    sX : 840,
    sY : 0,
    w : 424,
    h : 680,
    x : cvs.width/2 - 424/2,
    y : 50,
    

    draw : function() {
        if(state.current == state.gameOver){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}
//Draw
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    bg.draw();
    dick.draw();
    head.draw();
    // mainScreen.draw();
    gameOver.draw();
}
//Update
function update() {
    head.update();
    bg.update();
}

//Loop
function loop () {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();