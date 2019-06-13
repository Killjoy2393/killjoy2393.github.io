list();
if (window.innerWidth <= 1680 && window.innerHeight <=1050){
list1();

}
function list() {
    // //Select CVS
const cvs = document.getElementById('macafi');
const ctx = cvs.getContext('2d');
//Game vars and consts
let i;
let w;
let frames = 0;
w = cvs.width = window.innerWidth;
h = cvs.height = window.innerHeight;
//Load sprite Image
const sprite = new Image();
sprite.src = "img/sprite.png";

const bgImg = new Image();
bgImg.src = "img/bg-game.png";
const gover = new Image();
gover.src = "img/gover.png";
const mouse = new Image();
mouse.src = "img/mouse.png";
//Game State
const state = {
    current : 0,
    newGame : 0,
    mainScreen : 1,
    game :2,
    gameOver : 3,
}
let newGame = document.querySelector('.new');

let startGame = document.querySelector('.main')

newGame.addEventListener('click', showGame);







function showGame() {
    startGame.classList.add('hide');
    if(state.current = state.newGame){
        state.current == state.mainScreen;
        if(state.current==state.mainScreen){
            state.mainScreen=state.game;
            // alert(123);
        }
    }
    // state.current = 0;
}
//Control the Game
// document.addEventListener("click", function(evt) {
//     switch(state.current) {
//         case state.newGame:
//             state.current = state.mainScreen;
//             break;
//         case state.mainScreen:
//             state.current = state.game;
//             break;
//         case state.game:
//             head.eat();
//             break;
//         case state.gameOver:
//             state.current = state.mainScreen;
//             break;
//     }
// });
document.addEventListener("click", function(evt) {
    switch(state.current) {
        case state.newGame:
            state.current = state.mainScreen;
            // alert(12);
            break;
        case state.mainScreen:
            state.current = state.game;
            // alert(123);
            break;
        case state.game:
            head.eat();
            break;
        case state.gameOver:
            state.current = state.mainScreen;
            break;
    }
});
//background image

const bg = {
    sX : 0,
    sY : 0,
    w : 8565,
    h : 1100,
    x : 0,
    y : 0,

    dx : 5,

    draw : function() {
        ctx.drawImage(bgImg, this.sX, this.sY, this.w, this.h, this.x, this.y-cvs.height/2+this.h/2, this.w, cvs.height);

        ctx.drawImage(bgImg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y-cvs.height/2+this.h/2, this.w, cvs.height);
    },

    update : function() {
        if(state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w);
        }
    }
}
//Dick
const dick = {
    sX : 1010,
    sY : 1112,
    w : 3600,
    h : 300,
    x : cvs.width,
    y : 0,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y+cvs.height/2, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x-cvs.width/2, this.y+cvs.height/2, this.w, this.h);
    },
    
    
    update : function() {
        if(state.current == state.game) {
            this.x = this.x - 4;
        }
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
    x : 0,
    y : 0,
    w : 419,
    h : 609,

    frame : 0,

    moveBackward :0.25,
    moveForward : 2.6,
    speed :0,

    draw : function() {
        let head = this.animation[this.frame];

        ctx.drawImage(sprite, head.sX, head.sY, this.w, this.h, this.x, this.y +cvs.height/2 - this.h/2, this.w+cvs.width/2-cvs.width/2, this.h+cvs.height/2-cvs.height/2);
        
    },

    eat : function() {
        this.speed = -this.moveForward;
    },

    update : function() {
        // If the game state is mainScreen , the head must eat slowly
        this.period = state.current == state.newGame ? 1 : 8;
        //We increment the frame by 1, each period
        this.frame += frames%this.period == 0 ? 1 : 10;
        //Frame goes from 0 to 4, then again to 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.mainScreen) {
            this.x = 300; ///reset position head
         }else{
            this.speed += this.moveBackward;
            this.x -= this.speed;
///Выход за экран тогда проигрыш
            if(this.x - this.w/2 <= cvs.width - bg.w/4) {
                this.x = cvs.width - bg.w + this.w/2;
                if(state.current == state.game) {
                    state.current = state.gameOver;
                }
            }
        }
      }
}
//Main Screen
const mainScreen = {
    sX : 0,
    sY : 0,
    w : 664,
    h : 350,
    x : 0,
    y : 0,
    

    draw : function() {
        if(state.current == state.mainScreen){
            ctx.drawImage(mouse, this.sX, this.sY, this.w, this.h, this.x+cvs.width/2 -this.w/2, this.y+cvs.height/2 +this.h/2, this.w, this.h);
           
        }
    }
    
}

//Game Over   нет изображения
const gameOver = {
    sX : 0,
    sY : 0,
    w : 0,
    h : 0,
    x : 0,
    y : 0,
    

    draw : function() {
        if(state.current == state.gameOver){
            ctx.drawImage(gover, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            
        }
    }
    
}

  //istening to resize events and draw canvas.
  initialize();

  function initialize() {
      // Register an event listener to call the resizeCanvas() function 
      // each time the window is resized.
      window.addEventListener('resize', resizeCanvas, false);
      // Draw canvas border for the first time.
      resizeCanvas();
   }

//Draw
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    bg.draw();
    dick.draw();
    head.draw();
    mainScreen.draw();
    gameOver.draw();
}
//Update
function update() {
    head.update();
    bg.update();
    dick.update();
}

//Loop
function loop () {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();
function resizeCanvas() {

   
        w = cvs.width = window.innerWidth;
        h = cvs.height = window.innerHeight;
        // w = 10/16;
        // h = 5.7/6;
        draw();
    update();
    
        // if (cvs.width <= 800 && cvs.height <=600){
        //     ctx.scale(0.41,0.54);
        // }else if (window.innerWidth <= 960 && window.innerHeight <=540){
        //     ctx.scale(0.5,0.519);
        // }else if (window.innerWidth <= 1024 && window.innerHeight <=600){
        //     ctx.scale(0.5,0.58);
        // }else if (window.innerWidth <= 1024 && window.innerHeight <=768 ){
        //     ctx.scale(0.5,0.75);
        // }else if (window.innerWidth <= 1152 && window.innerHeight <=864){
        //     ctx.scale(0.55,0.85);
        // }else if (window.innerWidth <= 1200 && window.innerHeight <=600){
        //     ctx.scale(0.5,0.58);
        // }else if (window.innerWidth <= 1280 && window.innerHeight <=720){
        //     ctx.scale(0.67,0.7);
        // }else if (window.innerWidth <= 1280 && window.innerHeight <=768){
        //     ctx.scale(0.67,0.75);
        // }else if (window.innerWidth <= 1280 && window.innerHeight <=1024){
        //     ctx.scale(0.7,0.99);
        // }else if (window.innerWidth <= 1408 && window.innerHeight <=1152){
        //     ctx.scale(0.73,1.11);
        // }else if (window.innerWidth <= 1440 && window.innerHeight <=900){
        //     ctx.scale(0.75,0.87);
        // }else if (window.innerWidth <= 1440 && window.innerHeight <=1050){
        //     ctx.scale(0.75,1.01);
        // }else if (window.innerWidth <= 1440 && window.innerHeight <=1080){
        //     ctx.scale(0.8,1.04);
        // }else if (window.innerWidth <= 1536 && window.innerHeight <=960){
        //     ctx.scale(0.9,0.93);
        // }else if (window.innerWidth <= 1536 && window.innerHeight <=1024){
        //     ctx.scale(0.9,0.99);
        // }else if (window.innerWidth <= 1600 && window.innerHeight <=900){
        //     ctx.scale(0.9,0.87);
        // }else if (window.innerWidth <= 1600 && window.innerHeight <=1024){
        //     ctx.scale(0.9,0.99);
        // }else if (window.innerWidth <= 1600 && window.innerHeight <=1200){
        //     ctx.scale(0.95,1.16);
        // }else if (window.innerWidth <= 1680 && window.innerHeight <=1050){
        //     ctx.scale(0.6,1.05);
        // }else if (window.innerWidth <= 1920 && window.innerHeight <=1080){
        //     ctx.scale(0.7,0.92);
        // }else if (window.innerWidth <= 1920 && window.innerHeight <=1200){
        //     ctx.scale(1,1.16);
        // }else if (window.innerWidth <= 2040 && window.innerHeight <=1080){
        //     ctx.scale(1,1.05);
        // }
        
     

     
    // loop();
}
}

function list1() {
    // //Select CVS
const cvs = document.getElementById('macafi');
const ctx = cvs.getContext('2d');
//Game vars and consts
let i;
let w;
let frames = 0;
w = cvs.width = window.innerWidth;
h = cvs.height = window.innerHeight;
//Load sprite Image
const sprite = new Image();
sprite.src = "img/sprite.png";

const bgImg = new Image();
bgImg.src = "img/bg-game.png";
const gover = new Image();
gover.src = "img/gover.png";
const mouse = new Image();
mouse.src = "img/mouse.png";
//Game State
const state = {
    current : 0,
    newGame : 0,
    mainScreen : 1,
    game :2,
    gameOver : 3,
}
let newGame = document.querySelector('.new');

let startGame = document.querySelector('.main')

newGame.addEventListener('click', showGame);







function showGame() {
    startGame.classList.add('hide');
    if(state.current = state.newGame){
        state.current == state.mainScreen;
        if(state.current==state.mainScreen){
            state.mainScreen=state.game;
            // alert(123);
        }
    }
}

document.addEventListener("click", function(evt) {
    switch(state.current) {
        case state.newGame:
            state.current = state.mainScreen;
            // alert(12);
            break;
        case state.mainScreen:
            state.current = state.game;
            // alert(123);
            break;
        case state.game:
            head.eat();
            break;
        case state.gameOver:
            state.current = state.mainScreen;
            break;
    }
});
//background image

const bg = {
    sX : 0,
    sY : 0,
    w : 8565,
    h : 1100,
    x : 0,
    y : 0,

    dx : 5,

    draw : function() {
        ctx.drawImage(bgImg, this.sX, this.sY, this.w, this.h, this.x, this.y-cvs.height/2+this.h/2, this.w, cvs.height);

        ctx.drawImage(bgImg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y-cvs.height/2+this.h/2, this.w, cvs.height);
    },

    update : function() {
        if(state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w);
        }
    }
}
//Dick
const dick = {
    sX : 1010,
    sY : 1112,
    w : 3600,
    h : 300,
    x : cvs.width,
    y : 0,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y+cvs.height/1.8, this.w/1.8, this.h/1.8);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x-cvs.width/3, this.y+cvs.height/1.8, this.w/1.8, this.h/1.8);
    },
    
    
    update : function() {
        if(state.current == state.game) {
            this.x = this.x - 4;
        }
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
    x : 0,
    y : 0,
    w : 419,
    h : 609,

    frame : 0,

    moveBackward :0.25,
    moveForward : 2.6,
    speed :0,

    draw : function() {
        let head = this.animation[this.frame];

        ctx.drawImage(sprite, head.sX, head.sY, this.w, this.h, this.x-this.x/2, this.y +cvs.height/1.5 - this.h/2, this.w/1.5, this.h/1.5);
        
    },

    eat : function() {
        this.speed = -this.moveForward;
    },

    update : function() {
        // If the game state is mainScreen , the head must eat slowly
        this.period = state.current == state.newGame ? 1 : 8;
        //We increment the frame by 1, each period
        this.frame += frames%this.period == 0 ? 1 : 10;
        //Frame goes from 0 to 4, then again to 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.mainScreen) {
            this.x = 300; ///reset position head
         }else{
            this.speed += this.moveBackward;
            this.x -= this.speed;
///Выход за экран тогда проигрыш
            if(this.x - this.w/2 <= cvs.width - bg.w/4.9) {
                this.x = cvs.width - bg.w + this.w/2;
                if(state.current == state.game) {
                    state.current = state.gameOver;
                }
            }
        }
      }
}
//Main Screen
const mainScreen = {
    sX : 0,
    sY : 0,
    w : 664,
    h : 350,
    x : 0,
    y : 0,
    

    draw : function() {
        if(state.current == state.mainScreen){
            ctx.drawImage(mouse, this.sX, this.sY, this.w, this.h, this.x+cvs.width/2 -this.w/4, this.y+cvs.height/2 +this.h/1.25, this.w/1.8, this.h/1.8);
           
        }
    }
    
}

//Game Over   нет изображения
const gameOver = {
    sX : 0,
    sY : 0,
    w : 0,
    h : 0,
    x : 0,
    y : 0,
    

    draw : function() {
        if(state.current == state.gameOver){
            ctx.drawImage(gover, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            
        }
    }
    
}

  //istening to resize events and draw canvas.
  initialize();

  function initialize() {
      // Register an event listener to call the resizeCanvas() function 
      // each time the window is resized.
      window.addEventListener('resize', resizeCanvas, false);
      // Draw canvas border for the first time.
      resizeCanvas();
   }

//Draw
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    bg.draw();
    dick.draw();
    head.draw();
    mainScreen.draw();
    gameOver.draw();
}
//Update
function update() {
    head.update();
    bg.update();
    dick.update();
}

//Loop
function loop () {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();
function resizeCanvas() {

   
        w = cvs.width = window.innerWidth;
        h = cvs.height = window.innerHeight;
        // w = 10/16;
        // h = 5.7/6;
        draw();
    update(); 
       // loop();

}
}


