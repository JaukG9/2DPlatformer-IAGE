window.addEventListener("load", function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    let canvasPosition = canvas.getBoundingClientRect();

    let gameTimer = 0;
    let gameOver = false;

    let condition = Math.floor(Math.random() * 6) + 1;
    let code = "";
    let implicitness = "";
    let adaptability = "";
    let L1Time = 0;
    let L2Time = 0;
    let L3Time = 0;
    let L4Time = 0;
    let L5Time = 0;
    let L6Time = 0;
    let L7Time = 0;
    let totalTime = 0;
    let L4Star = false;
    let L5Star = false;
    let L6Star = false;
    let L7Star = false;
    let totalStars = 0;
    let L1Deaths = 0;
    let L2Deaths = 0;
    let L3Deaths = 0;
    let L4Deaths = 0;
    let L5Deaths = 0;
    let L6Deaths = 0;
    let L7Deaths = 0;
    let totalDeaths = 0;
    let L1BP = 0;
    let L3BP = 0;
    let L2BP = 0;
    let L4BP = 0;
    let L5BP = 0;
    let L6BP = 0;
    let L7BP = 0;
    let totalButtonPresses = 0;

    if(condition === 1){code = "nb"; implicitness = "low"; adaptability = "no"}
    else if(condition === 2){code = "mb"; implicitness = "moderate"; adaptability = "no"}
    else if(condition === 3){code = "ib"; implicitness = "high"; adaptability = "no"}
    else if(condition === 4){code = "na"; implicitness = "low"; adaptability = "yes"}
    else if(condition === 5){code = "ma"; implicitness = "moderate"; adaptability = "yes"}
    else if(condition === 6){code = "ia"; implicitness = "high"; adaptability = "yes"}

    console.log(condition === 1 || condition === 6);

    let characters = '0123456789';
    let charsLen = characters.length;
    for(var i = 0; i < 6; i++){
        code += characters.charAt(Math.floor(Math.random() * charsLen));
    }

    window.addEventListener('beforeunload', (e) => {
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdwzPolLr7KLtthi7cN7kr4vipaGo9PVh5aHrGio8KJBERRQg/formResponse";
        const data = new URLSearchParams();
        totalTime = L1Time + L2Time + L3Time + L4Time + L5Time + L6Time + L7Time;
        totalDeaths = L1Deaths + L2Deaths + L3Deaths + L4Deaths + L5Deaths + L6Deaths + L7Deaths;
        totalButtonPresses = L1BP + L2BP + L3BP + L4BP + L5BP + L6BP + L7BP;
        avgDL = totalDeaths / 7;
        avgBPL = totalButtonPresses / 7;
        avgBPS = totalButtonPresses / totalTime;

        data.append("entry.1955057386", code);
        data.append("entry.1993401091", implicitness);
        data.append("entry.1157741162", adaptability);
        data.append("entry.291193905", L1Time);
        data.append("entry.329961467", L2Time);
        data.append("entry.1676311474", L3Time);
        data.append("entry.977434056", L4Time);
        data.append("entry.391429005", L5Time);
        data.append("entry.742161815", L6Time);
        data.append("entry.569095564", L7Time);
        data.append("entry.773165647", totalTime);
        data.append("entry.1728185382", L4Star);
        data.append("entry.442596606", L5Star);
        data.append("entry.188403111", L6Star);
        data.append("entry.118065855", L7Star);
        data.append("entry.1806392904", totalStars);
        data.append("entry.120527382", L1Deaths);
        data.append("entry.1349664674", L2Deaths);
        data.append("entry.71433522", L3Deaths);
        data.append("entry.93379501", L4Deaths);
        data.append("entry.306630458", L5Deaths);
        data.append("entry.701475094", L6Deaths);
        data.append("entry.1171473796", L7Deaths);
        data.append("entry.192676016", totalDeaths);
        data.append("entry.1656937526", L1BP);
        data.append("entry.580726587", L2BP);
        data.append("entry.1474541622", L3BP);
        data.append("entry.872884090", L4BP);
        data.append("entry.1312253188", L5BP);
        data.append("entry.1356147104", L6BP);
        data.append("entry.1559634866", L7BP);
        data.append("entry.1215189062", totalButtonPresses);
        data.append("entry.873547421", avgDL);
        data.append("entry.1447842233", avgBPL);
        data.append("entry.2103162980", avgBPS);

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",  // important to prevent browser errors
            body: data
        }).then(() => {
            console.log("Numbers saved to Google Sheets!");
        });

        e.preventDefault();
    });

    window.addEventListener('resize', function(){
        canvasPosition = canvas.getBoundingClientRect();
    });
    const mouse = {
        x: 10,
        y: 10,
        width: 0.1,
        height: 0.1,
        clicked: false
    }
    canvas.addEventListener('mousemove', function(e){
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
    });
    canvas.addEventListener("click", function(){
  
    });

    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if(((e.key === 'ArrowDown' || e.key === 's') || (e.key === 'ArrowUp' || e.key === 'w') || (e.key === 'ArrowLeft' || e.key === 'a') || (e.key === 'ArrowRight' || e.key === 'd') || e.key === 'r' || (e.key === '1' || e.key === '2' || e.key === '3') || e.key === ' ') && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                    if(levels.level === 1){L1BP++;}
                    if(levels.level === 2){L2BP++;}
                    if(levels.level === 3){L3BP++;}
                    if(levels.level === 4){L4BP++;}
                    if(levels.level === 5){L5BP++;}
                    if(levels.level === 6){L6BP++;}
                    if(levels.level === 7){L7BP++;}
                }
            });
            window.addEventListener('keyup', e => {
                if(((e.key === 'ArrowDown' || e.key === 's') || (e.key === 'ArrowUp' || e.key === 'w') || (e.key === 'ArrowLeft' || e.key === 'a') || (e.key === 'ArrowRight' || e.key === 'd') || e.key === 'r' || (e.key === '1' || e.key === '2' || e.key === '3') || e.key === ' ')){
                    if(this.keys.indexOf(e.key > -1)){
                        this.keys.splice(this.keys.indexOf(e.key), 1);
                        if(levels.level === 1){L1BP++;}
                        if(levels.level === 2){L2BP++;}
                        if(levels.level === 3){L3BP++;}
                        if(levels.level === 4){L4BP++;}
                        if(levels.level === 5){L5BP++;}
                        if(levels.level === 6){L6BP++;}
                        if(levels.level === 7){L7BP++;}
                    }
                }
            });
        }
    }
    class Background{
        constructor(){
            this.image = document.getElementById('lvl1BG');
            this.x = 0;
            this.y = 0;
            this.width = canvas.width;
            this.height = canvas.height;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    class Levels{
        constructor(){
            this.level = 1;
            this.surfacePool = [];

            this.x = 0
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        update(deltaTime){
            if(this.level === 1){
                L1Time += deltaTime / 1000;
            }else if(this.level === 2){
                L2Time += deltaTime / 1000;
            }else if(this.level === 3){
                L3Time += deltaTime / 1000;
            }else if(this.level === 4){
                L4Time += deltaTime / 1000;
            }else if(this.level === 5){
                L5Time += deltaTime / 1000;
            }else if(this.level === 6){
                L6Time += deltaTime / 1000;
            }else if(this.level === 7){
                L7Time += deltaTime / 1000;
            }
        }
        draw(context){
            context.fillStyle = "red";
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    class Player{
        constructor(){
            this.x = canvas.width * 1/10;
            this.y = 635;
            this.width = 40;
            this.height = 40;
            this.vx = 0;
            this.vy = 0;
            this.arrowRightTime = 0;
            this.arrowLeftTime = 0;
            this.toggleArrowRight = false;
            this.toggleArrowLeft = false;
            this.arrowDownTime = 0;
            this.arrowUpTime = 0;
            this.toggleArrowDown = false;
            this.toggleArrowUp = false;
            this.jumped = true;
            this.doubleJumped = false;
            this.jumpRePressed = false;
            this.surfaceMax = 0;
            this.onSurface = false;
            this.doubleJumpLock = true;
            this.invincibilityLock = true;
            this.lowGravity = 0;
        }
        update(input){
            //Smooth Controls
            if((input.keys.indexOf('ArrowRight') > -1 || input.keys.indexOf('d') > -1) && !this.toggleArrowRight){
                this.arrowRightTime = gameTimer;
                this.toggleArrowRight = true;
            }else if(!(input.keys.indexOf('ArrowRight') > -1 || input.keys.indexOf('d') > -1)){
                this.toggleArrowRight = false;
                this.arrowRightTime = 0;
            }
            if((input.keys.indexOf('ArrowLeft') > -1 || input.keys.indexOf('a') > -1) && !this.toggleArrowLeft){
                this.arrowLeftTime = gameTimer;
                this.toggleArrowLeft = true;
            }else if(!(input.keys.indexOf('ArrowLeft') > -1 || input.keys.indexOf('a') > -1)){
                this.toggleArrowLeft = false;
                this.arrowLeftTime = 0;
            }
            if((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('w') > -1) && !this.jumped){
                this.vy = -11;
                this.jumped = true;
                this.jumpRePressed = false;
            }else if((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('w') > -1) && this.jumped && !this.doubleJumped && this.jumpRePressed){
                this.vy = -11;
                this.doubleJumped = true;
            }
            if(!this.jumpRePressed && this.jumped && !(input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('w') > -1)){
                this.jumpRePressed = true;
            }
            /*if(((input.keys.indexOf('ArrowDown') > -1 || input.keys.indexOf('s') > -1) && !(input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('w') > -1) && this.jumped) && (background.image !== document.getElementById('lvl6BG') || (this.x < 680 || this.x > 1000))){
                this.vy = 20;
            }*/

            //Update Velocity
            if(this.arrowRightTime > this.arrowLeftTime && this.x + this.width < canvas.width){
                this.vx = 8;
            }else if(this.arrowRightTime < this.arrowLeftTime && this.x > 0){
                this.vx = -8;
            }else{
                this.vx = 0;
            }

            //Gravity
            if(this.vy < 50){this.vy += (0.4 - (0.1 * this.lowGravity));}

            //Update x & y
            this.x += this.vx;
            this.y += this.vy;

            //borders
            if(this.x < 0){this.x = 0}
            if(this.x + this.width > canvas.width){this.x = canvas.width - this.width}
            if(this.y < 0){
                this.y = 0; 
                this.vy = 0;
            }
            if(this.y + this.height > canvas.height){
                this.y = canvas.height - this.height;
                this.jumped = false;
                this.doubleJumped = false;
            }
            if((!this.onSurface) && (this.y + this.height !== canvas.height)){this.jumped = true;}
            if(this.doubleJumpLock){this.doubleJumped = true;}else if(!this.doubleJumped){this.doubleJumped = false;}
        }
        draw(context){
            context.fillStyle = "purple";
            context.fillRect(this.x, this.y, this.width, this.height);

            if(this.LSCollected){
                context.beginPath();
                context.fillStyle = "rgba(0,181,226,0.5)"
                context.strokeStyle = "purple";
                context.lineWidth = 5;
                context.arc(this.x + (this.width / 2), this.y + (this.width / 2), 80, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();
            }
        }
    }
    class Surface{
        constructor(){
            this.x = 0;
            this.y = 0;
            this.width = 100;
            this.height = 100;
            this.type = "";
            this.endingReached = false;
            this.restart = false;
            this.level = 1;
            this.surfaceMax = 2;
            this.potionMax = 0;
            this.spikeMax = 0;
            this.enemyMax = 0;
            this.surfacePool = [];
            this.potionPool = [];
            this.spikePool = [];
            this.enemyPool = [];
            this.surfaceIndex = 0;
            this.potionIndex = 0;
            this.spikeIndex = 0;
            this.enemyIndex = 0;
            this.timerActivate = 0;
            this.timer = 0;
            this.countDown = 0;
            this.startCount = false;
            this.bgChanged = false;
            this.levelStart = [];
            this.LSCollected = false;
            this.enemiesKilled = 0;
            this.ffDistance = 0;
            this.tagTime = 0;

            this.objects = {
                surfaces: [
                    [
                        {
                        x: 0,
                        y: 680,
                        width: 1920,
                        height: 10
                        },{
                        x: 0,
                        y: 390,
                        width: 1920,
                        height: 10
                        }
                    ],
                    [
                        {
                        x: 0,
                        y: 680,
                        width: 1920,
                        height: 10
                        },{
                        x: 0,
                        y: 390,
                        width: 1920,
                        height: 10
                        },{
                        x: 1698,
                        y: 458,
                        width: 222,
                        height: 45
                        },{
                        x: 1880,
                        y: 500,
                        width: 40,
                        height: 190
                        }
                    ],
                    [
                        {
                        x: 0,
                        y: 680,
                        width: 1920,
                        height: 10
                        },{
                        x: 0,
                        y: 390,
                        width: 1920,
                        height: 10,
                        }
                    ],
                    [
                        {
                        x: 272,
                        y: 879,
                        width: 156,
                        height: 201
                        },{
                        x: 644,
                        y: 998,
                        width: 216,
                        height: 82        
                        },{
                        x: 1226,
                        y: 845,
                        width: 127,
                        height: 235  
                        },{
                        x: 1836,
                        y: 780,
                        width: 84,
                        height: 300  
                        },{
                        x: 1590,
                        y: 590,
                        width: 330,
                        height: 196  
                        },{
                        x: 1840,
                        y: 135,
                        width: 80,
                        height: 305  
                        },{
                        x: 1568,
                        y: 0,
                        width: 352,
                        height: 135  
                        },{
                        x: 0,
                        y: 157,
                        width: 111,
                        height: 16
                        }
                    ],
                    [
                        {
                        x: 1364,
                        y: 852,
                        width: 126,
                        height: 228
                        },{
                        x: 272,
                        y: 944,
                        width: 156,
                        height: 136
                        },{
                        x: 1836,
                        y: 900,
                        width: 84,
                        height: 220  
                        },{
                        x: 1590,
                        y: 710,
                        width: 330,
                        height: 196  
                        },{
                        x: 1840,
                        y: 135,
                        width: 80,
                        height: 305  
                        },{
                        x: 1568,
                        y: 0,
                        width: 352,
                        height: 135  
                        },{
                        x: 0,
                        y: 140,
                        width: 1200,
                        height: 20 
                        }
                    ],
                    [  
                        {
                        x: 474,
                        y: 138,
                        width: 99,
                        height: 942
                        },{
                        x: 1020,
                        y: 311,
                        width: 379,
                        height: 769
                        },{
                        x: 1020,
                        y: 0,
                        width: 499,
                        height: 125   
                        },{
                        x: 1577,
                        y: 323,
                        width: 132,
                        height: 22  
                        },{
                        x: 1700,
                        y: 0,
                        width: 10,
                        height: 240
                        },{
                        x: 1848,
                        y: 0,
                        width: 72,
                        height: 867   
                        }
                    ],
                    [   
                        {
                        x: 0,
                        y: 585,
                        width: 690,
                        height: 155
                        },{
                        x: 686,
                        y: 522,
                        width: 207,
                        height: 218
                        },{
                        x: 1169,
                        y: 514,
                        width: 751,
                        height: 110
                        },{
                        x: 1252,
                        y: 1015,
                        width: 65,
                        height: 65
                        },{
                        x: 1298,
                        y: 260,
                        width: 622,
                        height: 39
                        },{
                        x: 1296,
                        y: 0,
                        width: 622,
                        height: 39
                        },{
                        x: 1858,
                        y: 0,
                        width: 62,
                        height: 300
                        },{
                        x: 983,
                        y: 0,
                        width: 10,
                        height: 190
                        },{
                        x: 428,
                        y: 180,
                        width: 193,
                        height: 10
                        },{
                        x: 699,
                        y: 180,
                        width: 290,
                        height: 10
                        },{
                        x: 423,
                        y: 180,
                        width: 10,
                        height: 192
                        },{
                        x: 423,
                        y: 359,
                        width: 10,
                        height: 20
                        },{
                        x: 428,
                        y: 370,
                        width: 565,
                        height: 10
                        },{
                        x: 762,
                        y: 1015,
                        width: 197,
                        height: 65,
                        type: "invis"
                        },{
                        x: 1642,
                        y: 198,
                        width: 200,
                        height: 63,
                        type: "invis"
                        },{
                        x: 1370,
                        y: 39,
                        width: 20,
                        height: 222, 
                        type: "brown"   
                        }
                    ]
                ],
                potions: [
                    [{}],
                    [
                        {
                        type: "DJ",
                        x: 935,
                        y: 515,
                        width: 50,
                        height: 50
                        }
                    ],
                    [
                        {
                        type: "IN",
                        x: 455,
                        y: 515,
                        width: 50,
                        height: 50
                        } 
                    ],
                    [
                        {
                        type: "DJ",
                        x: 995,
                        y: 875,
                        width: 50,
                        height: 50
                        },
                        {
                        type: "STAR",
                        x: 31,
                        y: 100,
                        width: 50,
                        height: 50
                        }
                    ],
                    [
                        {
                        type: "LS",
                        x: 325,
                        y: 875,
                        width: 50,
                        height: 50
                        },{
                        type: "STAR",
                        x: 45,
                        y: 70,
                        width: 50,
                        height: 50
                        }
                    ],
                    [
                        {
                        type: "IN",
                        x: 1065,
                        y: 160,
                        width: 50,
                        height: 50
                        },{
                        type: "STAR",
                        x: 1785,
                        y: 270,
                        width: 50,
                        height: 50  
                        }
                    ],
                    [
                        {
                        type: "IN",
                        x: 1257,
                        y: 905,
                        width: 50,
                        height: 50
                        },{
                        type: "LS",
                        x: 1710,
                        y: 60,
                        width: 50,
                        height: 50
                        },{
                        type: "IN",
                        x: 220,
                        y: 205,
                        width: 50,
                        height: 50
                        },{
                        type: "DJ",
                        x: 500,
                        y: 450,
                        width: 50,
                        height: 50
                        },{
                        type: "STAR",
                        x: 491,
                        y: 258,
                        width: 50,
                        height: 50   
                        }
                    ]
                ],

                /* 
                Regular Spike Layout:
                        {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 50
                        },{
                        x: 0 - 12,
                        y: 0 + 20,
                        width: 0 + 28,
                        height: 26
                        }
                */
                spikes: [
                    [{}],
                    [{}],
                    [
                        {
                        x: 996,
                        y: 630,
                        width: 437,
                        height: 50
                        },{
                        x: 982,
                        y: 650,
                        width: 465,
                        height: 26
                        }
                    ],
                    [
                        {
                        x: 289,
                        y: 830,
                        width: 122,
                        height: 50
                        },{
                        x: 275,
                        y: 850,
                        width: 150,
                        height: 26
                        },{
                        x: 450,
                        y: 1030,
                        width: 160,
                        height: 50
                        },{
                        x: 450 - 12,
                        y: 1030 + 20,
                        width: 160 + 28,
                        height: 26
                        },{
                        x: 905,
                        y: 1030,
                        width: 270,
                        height: 50
                        },{
                        x: 905 - 12,
                        y: 1030 + 20,
                        width: 270 + 28,
                        height: 26
                        }
                    ],
                    [{}],
                    [
                        {
                        x: 1205,
                        y: 262,
                        width: 28,
                        height: 50
                        },{
                        x: 1205 - 12,
                        y: 262 + 20,
                        width: 28 + 28,
                        height: 26
                        },{
                        x: 1600,
                        y: 273,
                        width: 86,
                        height: 50
                        },{
                        x: 1600 - 12,
                        y: 273 + 20,
                        width: 86 + 28,
                        height: 26
                        },{
                        x: 1417,
                        y: 1030,
                        width: 204,
                        height: 50
                        },{
                        x: 1417 - 12,
                        y: 1030 + 20,
                        width: 204 + 28,
                        height: 26
                        }
                    ],
                    [
                        {
                        x:160,
                        y: 535,
                        width: 140,
                        height: 50
                        },{
                        x: 160 - 12,
                        y: 535 + 20,
                        width: 140 + 28,
                        height: 26
                        },{
                        x: 719,
                        y: 573,
                        width: 140,
                        height: 50
                        },{
                        x: 719 - 12,
                        y: 573 + 20,
                        width: 140 + 28,
                        height: 26
                        },{
                        x: 1290,
                        y: 464,
                        width: 320,
                        height: 50
                        },{
                        x: 1290 - 12,
                        y: 464 + 20,
                        width: 320 + 28,
                        height: 26
                        }
                    ]
                ],
                enemies: [
                    [{}],
                    [{}],
                    [{}],
                    [{}],
                    [
                        {
                        x: 600,
                        y: 1040,
                        width: 40,
                        height: 40,
                        color: "lime"
                        },{
                        x: 610,
                        y: 100,
                        width: 40,
                        height: 40
                        }
                    ],
                    [{}],
                    [
                        {
                        x: 400,
                        y: 545,
                        width: 40,
                        height: 40
                        },{
                        x: 1400,
                        y: 1040,
                        width: 40,
                        height: 40,
                        },{
                        x: 1400,
                        y: 220,
                        width: 40,
                        height: 40,
                        color: "brown"
                        },{
                        x: 800,
                        y: 140,
                        width: 40,
                        height: 40,
                        color: "lime"
                        }
                    ]
                ]
            }
        }
        getElement(){
            for(let i = 0; i < this.surfaceMax; i++){
                this.surfacePool.push(new Surface);
            }
            for(let i = 0; i < this.potionMax; i++){
                this.potionPool.push(new Potion);
            }
            for(let i = 0; i < this.spikeMax; i++){
                this.spikePool.push(new Spike);
            }
            for(let i = 0; i < this.enemyMax; i++){
                this.enemyPool.push(new Enemy);
            }
        }
        backgrounds(){
            if(!this.bgChanged){
                if(this.level === 1){background.image = document.getElementById('lvl1BG'); this.levelStart = [canvas.width * 1/10, 635];}
                else if(this.level === 2){background.image = document.getElementById('lvl2BG'); this.levelStart = [0, player.y];}
                else if(this.level === 3){background.image = document.getElementById('lvl3BG'); this.levelStart = [0, 635];}
                else if(this.level === 4){background.image = document.getElementById('lvl4BG'); this.levelStart = [10, canvas.height - player.height];}
                else if(this.level === 5){background.image = document.getElementById('lvl5BGD'); this.levelStart = [10, canvas.height - player.height];}
                else if(this.level === 6){background.image = document.getElementById('lvl6BG'); this.levelStart = [10, canvas.height - player.height];}
                else if(this.level === 7){background.image = document.getElementById('lvl7BG'); this.levelStart = [10, canvas.height - player.height];}
            }

            if(this.level === 1){
                ctx.fillStyle = "skyblue";
                ctx.font = "60px Orbitron";
                ctx.textAlign = "center";
                ctx.fillText("Code: " + code, canvas.width / 2, 925);
                ctx.textAlign = "left";
            }
        }
        update(context, deltaTime, levelGlobal){
            if(this.level === 4){if(player.x + player.width <= 275){player.lowGravity = 3;}else{player.lowGravity = 0;}}
            else if(this.level === 5){
                if(player.x + player.width > 1232 && player.x < 1364 && (background.image === document.getElementById('lvl5BG') || background.image === document.getElementById('lvl5BGSR'))){
                    player.vy = -10;
                }
            }else if(this.level === 6){
                if(player.x + player.width > 386 && player.x - player.width < 435){
                    player.vy = -20;
                    player.lowGravity = 0;
                }else if(player.x + player.width > 573 && player.x - player.width < 980 && player.y + player.height < 840){
                    player.lowGravity = 3;
                }else if(player.x > 1345 && player.x < 1391){
                    if(!(this.countDown > 20))player.invincibilityLock = true;
                }else{player.lowGravity = 0;}
            }else if(this.level === 7 && player.x > 610 && player.x < 695 && player.y < 370 && (background.image === document.getElementById('lvl7BGA') || background.image === document.getElementById('lvl7BGSR'))){
                player.vy = -50;
            }

            //Surface Stuff
            this.surfacePool.forEach((surface) => {
                this.surfaceIndex = this.surfacePool.indexOf(surface);

                surface.x = this.objects.surfaces[this.level - 1][this.surfaceIndex].x;
                surface.y = this.objects.surfaces[this.level - 1][this.surfaceIndex].y;
                surface.width = this.objects.surfaces[this.level - 1][this.surfaceIndex].width;
                surface.height = this.objects.surfaces[this.level - 1][this.surfaceIndex].height;
                if(this.objects.surfaces[this.level - 1][this.surfaceIndex].type){
                    surface.type = this.objects.surfaces[this.level - 1][this.surfaceIndex].type;
                }

                surface.yBoundUp = (player.y + player.height) - surface.y;
                surface.yBoundDown = (player.y + player.height) - (surface.y + surface.height);

                if(player.x + player.width > surface.x && player.x < surface.x + surface.width && player.y + player.height > surface.y && player.y < surface.y + surface.height){
                    if(player.y <= surface.y && player.vy >= 2){
                        player.y = surface.y - player.height;
                        player.vy = 2;
                        player.jumped = false;
                        player.doubleJumped = false;
                        player.onSurface = true;
                    }else if(player.x < surface.x){
                        player.x = surface.x - player.width;
                    }else if(player.x + player.width > surface.x + surface.width){
                        player.x = surface.x + surface.width;
                    }else if(player.y + player.height > surface.y + surface.height){
                        player.vy = 1;
                    }
                }else{
                    player.onSurface = false;
                }

                if(this.level === 7 && surface.type === "invis" && player.y + player.height === surface.y && player.x > 728 && player.x < 952 && background.image !== document.getElementById('lvl7BG')){
                    player.x += 875;
                    player.y -= 800;
                    player.vy = -10;
                }

                surface.draw(context);
            });

            //Potion Stuff
            this.potionPool.forEach((potion) => {
                this.potionIndex = this.potionPool.indexOf(potion);

                    potion.type = this.objects.potions[this.level - 1][this.potionIndex].type;
                    if(!potion.potionCollected){potion.x = this.objects.potions[this.level - 1][this.potionIndex].x;}
                    potion.y = this.objects.potions[this.level - 1][this.potionIndex].y;
                    potion.width = this.objects.potions[this.level - 1][this.potionIndex].width;
                    potion.height = this.objects.potions[this.level - 1][this.potionIndex].height; 

                if(player.x + player.width >= potion.x && player.x <= potion.x + potion.width && player.y + player.height >= potion.y && player.y <= potion.y + potion.height){
                    potion.x += 10000;
                    potion.potionCollected = true;

                    if(potion.type === "DJ"){
                        player.doubleJumpLock = false;
                        player.invincibilityLock = true;
                        player.doubleJumped = false;
                        player.LSCollected = false;
                        this.timer = 0;
                    }else if(potion.type === "IN"){
                        player.doubleJumpLock = true;
                        player.invincibilityLock = false;
                        player.LSCollected = false;
                        this.timer = 2;
                    }else if(potion.type === "STAR"){
                        if(this.level === 4){background.image = document.getElementById('lvl4BGSR'); L4Star = true; totalStars++;}
                        else if(this.level === 5){background.image = document.getElementById('lvl5BGSR'); L5Star = true; totalStars++;}
                        else if(this.level === 6){background.image = document.getElementById('lvl6BGSR'); L6Star = true; totalStars++;}
                        else if(this.level === 7){background.image = document.getElementById('lvl7BGSR'); L7Star = true; totalStars++;}
                        this.bgChanged = true;
                    }else if(potion.type === "LS"){
                        player.doubleJumpLock = true;
                        player.invincibilityLock = true;
                        player.doubleJumped = false;
                        player.LSCollected = true;
                    }
                }

                potion.draw(context);
            });

            //Spike Stuff
            this.spikePool.forEach((spike) => {
                this.spikeIndex = this.spikePool.indexOf(spike);

                spike.x = this.objects.spikes[this.level - 1][this.spikeIndex].x;
                spike.y = this.objects.spikes[this.level - 1][this.spikeIndex].y;
                spike.width = this.objects.spikes[this.level - 1][this.spikeIndex].width;
                spike.height = this.objects.spikes[this.level - 1][this.spikeIndex].height;
                if(this.level === 7 && background.image === document.getElementById('lvl7BGSR') && spike.x > 300 && spike.x < 800){spike.y -= 100}

                spike.draw(context);

                if(player.x + player.width >= spike.x && player.x <= spike.x + spike.width && player.y + player.height >= spike.y && player.y <= spike.y + spike.height){
                    if(player.invincibilityLock){
                        this.restart = true;
                        this.doubleJumpLock = true;
                        if(levelGlobal.level === 1){L1Deaths++;}
                        else if(levelGlobal.level === 2){L2Deaths++;}
                        else if(levelGlobal.level === 3){L3Deaths++;}
                        else if(levelGlobal.level === 4){L4Deaths++;}
                        else if(levelGlobal.level === 5){L5Deaths++;}
                        else if(levelGlobal.level === 6){L6Deaths++;}
                        else if(levelGlobal.level === 7){L7Deaths++;}
                    }
                    else{
                        this.startCount = true;
                    }
                }
            });

            //Enemy Stuff
            this.enemyPool.forEach((enemy) => {
                this.enemyIndex = this.enemyPool.indexOf(enemy);

                if(enemy.create){
                    enemy.x = this.objects.enemies[this.level - 1][this.enemyIndex].x;
                    enemy.y = this.objects.enemies[this.level - 1][this.enemyIndex].y;
                    enemy.create = false;
                }
                enemy.width = this.objects.enemies[this.level - 1][this.enemyIndex].width;
                enemy.height = this.objects.enemies[this.level - 1][this.enemyIndex].height;
                if(this.objects.enemies[this.level - 1][this.enemyIndex].color){enemy.color = this.objects.enemies[this.level - 1][this.enemyIndex].color;}
                enemy.dx = enemy.x - player.x;
                enemy.dy = enemy.y - player.y;
                enemy.distance = Math.sqrt((enemy.dx * enemy.dx) + (enemy.dy * enemy.dy));

                this.surfacePool.forEach((surface) => {
                    if(enemy.x < 0){enemy.vx = 3;}else if(enemy.x + enemy.width > 1920 && enemy.vx !== 0){enemy.vx = -3;}
                    else if(enemy.y + enemy.height === surface.y && enemy.x > surface.x && enemy.x + enemy.width < surface.x + surface.width){
                        if(enemy.x < surface.x && enemy.vx < 0){enemy.vx = 3;}
                        else if(enemy.x + enemy.width > surface.x + surface.width && enemy.vx > 0){enemy.vx = -3;}
                    }else if(enemy.x < surface.x + surface.width && enemy.x + enemy.width > surface.x && enemy.y + enemy.height >= surface.y && enemy.y <= surface.y + surface.height){
                        if(enemy.vx < 0){enemy.vx = 3;}
                        else{enemy.vx = -3;}
                    }
                });
                this.spikePool.forEach((spike) => {
                    if(enemy.y + enemy.height >= spike.y && enemy && enemy.y <= spike.y + spike.height){
                        if(enemy.x < spike.x + spike.width && enemy.x + enemy.width > spike.x && enemy.vx < 0){enemy.vx = 3;}
                        else if(enemy.x + enemy.width > spike.x && enemy.x < spike.x + spike.width && enemy.vx > 0){enemy.vx = -3;}
                    }
                });
                enemy.x += (enemy.vx);

                if(player.LSCollected){
                    if(enemy.distance <= 100){
                        enemy.x = 10000;
                        enemy.vx = 0;
                        if(this.level === 7 && enemy.color === "brown"){this.objects.surfaces[6][15].x += 10000;}
                        this.enemiesKilled++;
                        player.LSCollected = false;
                    }
                }

                if(player.x + player.width > enemy.x && player.x < enemy.x + enemy.width && player.y + player.height > enemy.y && player.y < enemy.y + enemy. height){
                    if(player.invincibilityLock){
                        this.restart = true; 
                        this.doubleJumpLock = true;
                        if(levelGlobal.level === 1){L1Deaths++;}
                        else if(levelGlobal.level === 2){L2Deaths++;}
                        else if(levelGlobal.level === 3){L3Deaths++;}
                        else if(levelGlobal.level === 4){L4Deaths++;}
                        else if(levelGlobal.level === 5){L5Deaths++;}
                        else if(levelGlobal.level === 6){L6Deaths++;}
                        else if(levelGlobal.level === 7){L7Deaths++;}
                    }else{
                        this.startCount = true; 
                        enemy.x = 10000; 
                        enemy.vx = 0; 
                        if(this.level === 7 && enemy.color === "lime"){background.image = document.getElementById('lvl7BGFR');}
                        this.enemiesKilled++;
                    }
                }
                if(this.level === 5 && this.enemiesKilled === 1 && background.image !== document.getElementById('lvl5BGSR')){background.image = document.getElementById('lvl5BG'); this.bgChanged = true;}
                else if(this.level === 7 && this.enemiesKilled === 1){background.image = document.getElementById('lvl7BGFR'); this.bgChanged = true;}
                else if(this.level === 7 && this.enemiesKilled === 2 && background.image !== document.getElementById('lvl7BGSR')){background.image = document.getElementById('lvl7BGA');}

                enemy.draw(context);
            });

            if(this.startCount){
                this.countDown += deltaTime;
                if(this.countDown > 600 && this.timer > 0){
                    this.timer--;
                    this.countDown = 0;
                }else if(this.timer <= 0){
                    player.invincibilityLock = true;
                    this.startCount = false;
                }

                context.fillStyle = "white";
                context.font = "60px Orbitron";
                context.fillText(this.timer, 1860, 1060);
            }

            if(this.level === 7 && background.image === document.getElementById('lvl7BG')){
                this.ffDistance = Math.sqrt(((856 - (player.x + player.width / 2))**2) + ((canvas.height - (player.y + player.height / 2))**2));
                if(this.ffDistance + (player.width / 2) < 175){player.vy = -10;}
            }

            //Level Detector
            if((this.level <= 7) && player.x + player.width >= canvas.width){
                if(!(this.level === 7 && player.y + player.height > 540)){
                    if(this.level !== 7){
                        this.endingReached = true;
                    }else{gameOver = true;}
                }
            }
            if(input.keys.indexOf('r') > -1){
                this.restart = true;
            }

            if(this.endingReached && !gameOver){
                this.surfaceMax = this.objects.surfaces[this.level].length;
                this.potionMax = this.objects.potions[this.level].length;
                this.spikeMax = this.objects.spikes[this.level].length;
                this.enemyMax = this.objects.enemies[this.level].length;
                this.endingReached = false;
                this.surfacePool = [];
                this.potionPool = [];
                this.spikePool = [];
                this.enemyPool = [];
                player.doubleJumpLock = true;
                player.invincibilityLock = true;
                player.LSCollected = false;
                this.bgChanged = false;
                this.startCount = false;
                this.level++;
                levelGlobal.level++;
                this.enemiesKilled = 0;
                this.getElement();
                this.backgrounds();
                player.x = this.levelStart[0];
                player.y = this.levelStart[1];
            }
            if(this.restart){
                this.restart = false;
                player.doubleJumpLock = true;
                player.invincibilityLock = true;
                player.LSCollected = false;
                this.endingReached = false;
                this.surfacePool = [];
                this.potionPool = [];
                this.spikePool = [];
                this.enemyPool = [];
                if(this.level === 7){this.objects.surfaces[6][15].x = 1370;}
                this.startCount = false;
                this.bgChanged = false;
                this.enemiesKilled = 0;
                this.getElement();
                this.backgrounds();
                player.x = this.levelStart[0];
                player.y = this.levelStart[1];
            }
        }
        draw(context){
            context.fillStyle = "orange";
            if(this.type === "invis"){context.fillStyle = "rgba(0,0,0,0)";}
            else if(this.type === "brown"){context.fillStyle = "brown";}
            context.fillRect(this.x,this.y,this.width,this.height);
            context.fillStyle = "orange";
        }
    }
    class Potion{
        constructor(){
            this.type = "";
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.fillStyle = "";
        }
        draw(context){
            if(this.type === "DJ"){context.fillStyle = "green";}
            else if(this.type === "IN"){context.fillStyle = "red";}
            else if(this.type === "STAR"){context.fillStyle = "rgba(255,255,0,0)"}
            else if(this.type === "LS"){context.fillStyle = "skyblue"}
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    class Spike{
        constructor(){
            this.x = 0;
            this.y = 0;
            this.center = 0;
            this.radius = 0;
        }
        draw(context){
            context.fillStyle = "rgba(255,0,0,0)";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Enemy{
        constructor(){
            this.x = 0;
            this.y = 0;
            this.center = 0;
            this.radius = 0;
            this.create = true;
            this.color = "blue";
            this.randomChoose = Math.random();
            if(this.randomChoose < 0.5){this.vx = -3;}
            else(this.vx = 3);
        }
        draw(context){
            if(this.color === "blue"){context.fillStyle = "blue";}
            if(this.color === "lime"){context.fillStyle = "rgba(56,193,56,1)";}
            else if(this.color === "brown"){context.fillStyle = "brown";}
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Messages{
        constructor(){
            this.x = 0;
            this.y = 0;
            this.fillStyle = "";
            this.font = "";
            this.message = "";
        }
        update(){
            this.fillStyle = "white";
            this.font = "60px Orbitron";
            if(surface.level === 1){
                this.y = 180
                this.message = "WASD or Arrow Keys to Move"
            }else if(surface.level === 2){
                this.y = 180;
                this.message = "Green Potions Allow Double Jumps"
            }else if(surface.level === 3){
                this.y = 180;
                this.message = "Red Potions Allow 1-Time Incincibility"
            }else if(surface.level === 4 && !surface.bgChanged){
                this.y = 180;
                this.message = "Blue Sections mean Low Gravity"
            }else if(surface.level === 4){
                this.y = 180;
                this.message = "Collect Stars for Bonus Levels at End"
            }else if(surface.level === 5){
                this.y = 240;
                this.message = "Grab Blue Potion - Go in Enemy Range"
            }else if(surface.level === 6){
                this.y = 1040;
                this.fillStyle = "black"
                this.font = "40px Orbitron"
                this.message = "White Bar Clears Potion Effects"
            }else if(surface.level === 7){
                this.message = ""
            }
        }
        draw(context){
            context.fillStyle = this.fillStyle;
            context.font = this.font;
            context.textAlign = "center";
            context.fillText(this.message, canvas.width / 2, this.y);
            context.textAlign = "left";
        }
    }

    const levels = new Levels();
    const input = new InputHandler();
    const background = new Background();
    const player = new Player();
    const surface = new Surface();
    const message = new Messages();

    surface.getElement();
    surface.update(ctx);

    let lastTime = 0;
    function animate(timeStamp){
        if(!gameOver){
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx);
            levels.draw(ctx);
            levels.update(deltaTime);
            player.update(input);
            surface.update(ctx, deltaTime, levels);
            player.draw(ctx);
            surface.backgrounds(ctx);
            message.update();
            if(condition != 3 && condition != 6){message.draw(ctx);}
            gameTimer++;
            requestAnimationFrame(animate);
        }else if(gameOver){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "100px Orbitron";
            ctx.textAlign = "center";
            ctx.fillText("You Finished", canvas.width / 2, canvas.height / 2 - 30);
            ctx.fillStyle = "skyblue";
            ctx.font = "80px Orbitron";
            ctx.fillText(code, canvas.width / 2, canvas.height / 2 + 100);
        }
    }
    animate(0);

});
