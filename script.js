let canvas=document.getElementById("game-canvas");//getting the game canvas
let ctx=canvas.getContext("2d");//getting the 2d rendering context i.e. the tool we're using to paint the canvas

let headingContainer=document.getElementById("heading-container");//getting the heading container
let mainContainer=document.getElementById("main-container");//getting the main container
let controlsInstructionsContainer=document.getElementById("controls-instructions-container");//getting the controls instructions container

let squareSide=30;//the side of the square
let x=(squareSide/2);//the coordinates of the top left corner of the square
let y=(canvas.height-squareSide)/2;

let obstacles=[];//obstacles array
let frameNo=0;//current frame number

let upPressed=false;//currently we're assuming that we've not pressed any of the keys(up, left, right or down)
let leftPressed=false;
let rightPressed=false;
let downPressed=false;

let firstRemoval=true;//the default value of whether the first obstacle which is not needed anymore in the current frame(i.e. has gone past the game area) is removed or not

let backgroundMusic=document.getElementById("background-music");//getting the background, game over and the high score music
let gameOverMusic=document.getElementById("game-over-music");
let highScoreMusic=document.getElementById("high-score-music");

let wadsContainer=document.getElementById("wads-container");//getting the wads and the arrow container
let arrowContainer=document.getElementById("arrow-container");

let newHighScoreMessage=document.getElementById("new-high-score-message");//getting the new high score and the game over message
let gameOverMessage=document.getElementById("game-over-message");

let highScore=localStorage.getItem("highScore");//getting the value of the current high score from the local storage
let highScoreValue=document.getElementById("high-score-value");//getting the high score value element

if(highScore==null){//if this is the first time that we're trying to access the local storage, then we'll get null as the output and we need to create a local storage for the first time in this case
    localStorage.setItem("highScore", 0);
}

highScoreValue.innerText=localStorage.getItem("highScore");//setting the content of the high score value to the high score obtained from the local storage

document.addEventListener("keydown", function(event){//handling the event when a key is pressed down

    let keyCode=event.code;//getting the key code
        
    if(keyCode[0]=="K"){//excluding the "Key" part from the key i.e. pressed and getting the alphabetical part
        keyCode=keyCode.slice(3, 4);
    }

    let id=null;//id of the key i.e. pressed
    let validKey=false;//whether the key i.e. pressed is a valid key or not

    if(keyCode=="ArrowUp" || keyCode=="W"){//if the key corresponds to upwards movement of the box

        validKey=true;//it is a valid key 
        upPressed=true;//setting the value of up pressed to true

        if(keyCode=="ArrowUp"){//setting the value of the id of the key i.e. pressed and adding the needed styles

            id="up";//setting the value of the id of the key i.e. pressed
            arrowContainer.style.transform="rotateX(30deg)";//rotating the arrow container is the X direction by 30deg

        }
        else{

            id="w";
            wadsContainer.style.transform="rotateX(30deg)";

        }

    }
    if(keyCode=="ArrowLeft" || keyCode=="A"){//if the key corresponds to left movement of the box

        validKey=true;
        leftPressed=true;//setting the value of left pressed to true

        if(keyCode=="ArrowLeft"){

            id="left";
            arrowContainer.style.transform="rotateY(-30deg)";//rotating the arrow container in the Y direction by -30deg

        }
        else{

            id="a";
            wadsContainer.style.transform="rotateY(-30deg)";

        }

    }
    if(keyCode=="ArrowRight" || keyCode=="D"){//if the key corresponds to right movement of the box

        validKey=true;
        rightPressed=true;//setting the value of right pressed to true

        if(keyCode=="ArrowRight"){

            id="right";
            arrowContainer.style.transform="rotateY(30deg)";//rotating the arrow container in the Y direction by 30deg

        }
        else{

            id="d";
            wadsContainer.style.transform="rotateY(30deg)";

        }

    }
    if(keyCode=="ArrowDown" || keyCode=="S"){//if the key corresponds to downwards movement of the box
       
        validKey=true;
        downPressed=true;//setting the value of down pressed to true  

        if(keyCode=="ArrowDown"){

            id="down";
            arrowContainer.style.transform="rotateX(-30deg)";//rotating the arrow container in the X direction by -30deg

        }
        else{

            id="s";
            wadsContainer.style.transform="rotateX(-30deg)";

        }

    }

    if(validKey){//adding a box shadow to the key if it is a valid i.e. pressed

        let keyPressed=document.getElementById(id);
        keyPressed.style.boxShadow="0 0 4px 4px grey";

    }
    

});

document.addEventListener("keyup", function(event){//handling the event when a key is released

    let keyCode=event.code;

    if(keyCode[0]=="K"){
        keyCode=keyCode.slice(3, 4);
    }

    let id=null;
    let validKey=false;

    if(keyCode=="ArrowUp" || keyCode=="W"){
        
        validKey=true;
        upPressed=false;//setting the value of up pressed to false if the key is a valid key to move up

        if(keyCode=="ArrowUp"){

            id="up";
            arrowContainer.setAttribute("style", "");

        }
        else{

            id="w";
            wadsContainer.setAttribute("style", "");

        }

    }
    if(keyCode=="ArrowLeft" || keyCode=="A"){

        validKey=true;
        leftPressed=false;//setting the value of left pressed to false if the key is a valid key to move left       

        if(keyCode=="ArrowLeft"){

            id="left";
            arrowContainer.setAttribute("style", "");

        }
        else{

            id="a";
            wadsContainer.setAttribute("style", "");

        }

    }
    if(keyCode=="ArrowRight" || keyCode=="D"){

        validKey=true;
        rightPressed=false;//setting the value of right pressed to false if the key is a valid key to move right        

        if(keyCode=="ArrowRight"){

            id="right";
            arrowContainer.setAttribute("style", "");

        }
        else{

            id="d";
            wadsContainer.setAttribute("style", "");

        }

    }
    if(keyCode=="ArrowDown" || keyCode=="S"){

        validKey=true;
        downPressed=false;//setting the value of down pressed to false if the key is a valid key to move down        

        if(keyCode=="ArrowDown"){

            id="down";
            arrowContainer.setAttribute("style", "");

        }
        else{

            id="s";
            wadsContainer.setAttribute("style", "");

        }

    }    

    if(validKey){//removing the styles added above from the key if the key i.e. pressed is a valid one

        let keyPressed=document.getElementById(id);
        keyPressed.setAttribute("style", "");

    }

});

function drawSquare(){//function to draw the square

    ctx.beginPath();//beginning the path to draw the shape
    ctx.rect(x, y, squareSide, squareSide);//setting the top left corner and the width and the height of the square
    ctx.fillStyle="red";//defining the color of the square
    ctx.fill();//filling the square with the above color
    ctx.closePath();//closing the path

}

function drawObstacle(obsX, obsY, obsWidth, obsHeight){//function to draw an obstacle

    ctx.beginPath();//beginning the path to draw the obstacle
    ctx.rect(obsX, obsY, obsWidth, obsHeight);//defining the top left corner and the width and the height of the obstacle
    ctx.fillStyle="green";//defining the color of the obstacle
    ctx.fill();//filling the obstacle with the above color
    ctx.closePath();//closing the path 

}

function collisionDetection(){//function to detect a collision and handle it

    let topSq=y;//getting the top, bottom, left and right coordinates of the square
    let bottomSq=(y+squareSide);
    let leftSq=x;
    let rightSq=(x+squareSide);

    for(let i=0;i<obstacles.length;i++){//iterating on all the obstacles

        let topObs=obstacles[i].y;//getting the top, bottom, left and right coordinates of the current obstacle
        let bottomObs=(obstacles[i].y+obstacles[i].height);
        let leftObs=obstacles[i].x;
        let rightObs=(obstacles[i].x+obstacles[i].width);

        if(!(topSq>bottomObs) && !(bottomSq<topObs) && !(leftSq>rightObs) && !(rightSq<leftObs)){//checking if the square is colliding with the current obstacle
           
            if(volumeOn){//if the volume is on, then we pause the background music
                backgroundMusic.pause();                            
            }
                        

            clearInterval(intervalId);//clear the game interval

            headingContainer.style.opacity="0";//hiding the heading, main and the controls instructions container
            mainContainer.style.opacity="0";
            controlsInstructionsContainer.style.opacity="0";

            let newHighScore=false;//default value of whether a new high score has been made or not
            let time=2000;//time for which the message has to be displayed("game over" or "new high score")

            if(frameNo>localStorage.getItem("highScore")){//if a new high score has been made

                localStorage.setItem("highScore", frameNo);//update the value of the high score in the local storage
                newHighScoreMessage.style.opacity="1";//display the "new high score" message
                
                newHighScore=true;//set the value of new high score to true
                time*=3;//adjusting the time according to the message

            }
            else{
                gameOverMessage.style.opacity="1";//display the "game over" message in case a new high score has not been made
            }

            if(newHighScore){//if a new high score has been made

                time+=500;//adjust the time according to the message
                newHighScoreMessage.classList.add("animate__animated", "animate__backInDown");//adding the backInDown animation to the new high score message
                
                newHighScoreMessage.addEventListener("animationend", function(){//when the above added animation has
                    // ended

                    newHighScoreMessage.classList.remove("animate__animated", "animate__backInDown");//remove the backInDown animation

                    setTimeout(function(){

                        newHighScoreMessage.classList.add("animate__animated", "animate__rubberBand");//add the rubberBand animation to the new high score message after 1s

                    }, 1000);                    

                });

            }        
            else{//if a new high score has not been made

                time+=1000;//adjust the time according to the message    
                gameOverMessage.classList.add("animate__animated", "animate__tada");//adding the tada animation to the game over message

            }                       

            setTimeout(function(){//when the message has been displayed which takes 0.3s

                if(volumeOn){//if the volume is on

                    if(newHighScore){//if a new high score has been made

                        highScoreMusic.load();//load and play the high score music
                        highScoreMusic.play();

                    }
                    else{//if a new high score has not been made
                        
                        gameOverMusic.load();//load and play the game over music
                        gameOverMusic.play();

                    }                    
                    
                }

                setTimeout(function(){//wait for the time according to the message and then we reload the current URL i.e. reload the current page
                    document.location.reload();            
                }, time);

            }, 300);

        }

    }

}

function drawScore(){//function to draw the score

    ctx.font="15px Consolas";//setting the font size and family for the score text
    ctx.fillStyle="black";//defining the color for the text
    ctx.fillText("Score : "+frameNo, 20, 20);//filling the text with the provided content with the top left corner as 20, 20

}

function draw(){//draw function which is responsible for drawing on the game canvas at each frame

    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the canvas before we draw on it in a new frame
    frameNo++;//increasing the frame number

    drawSquare();//drawing the square

    if(frameNo==1 || frameNo%150==0){//if the current frame is the first frame or after every 150 frames i.e. 3s we add a random obstacle to the game       

        let minHeight=30;//mininum and the maximum height of the obstacle
        let maxHeight=220;
        let height=Math.floor((Math.random()*(maxHeight-minHeight+1))+minHeight);//getting a random height in the range [minHeight, maxHeight+1](are adding 1 above, so that the chances of getting a height equal to maxHeight are not very low)

        if(height==(maxHeight+1)){//if the random height is maxHeight+1(chances are very less), then we bring it back to maxHeight
            height=maxHeight;
        }

        let minGap=40;//minimum and the maximum gap between two obstacles(one obstacle over the other)
        let maxGap=(canvas.height-(height+minGap));
        let gap=Math.floor((Math.random()*(maxGap-minGap+1))+minGap);//getting a random gap value in the range [minGap, maxGap+1](1 is added above, so that the chances of getting a gap value equal to maxGap are not very low)
        
        if(gap==(maxGap+1)){//if the random gap is maxGap+1(chances are very less), then we bring it back to maxGap
            gap=maxGap;
        }

        let newObs1={//making a new obstacle object(the top one)

            x: canvas.width,//setting the coordinates of the top left corner of the obstacle
            y: 0,
            width: 10,//setting the width and the height of the obstacle
            height: height

        }

        let newObs2={//making a new obstacle object(the bottom one)

            x: canvas.width,//setting the coordinates of the top left corner of the obstacle
            y: (height+gap),
            width: 10,//setting the width and the height of the obstacle
            height: (canvas.height-(height+gap))

        }

        obstacles.push(newObs1);//adding the obstacles to the obstacles array   
        obstacles.push(newObs2);

        if(firstRemoval){//if we are removing the non needed obstacles for the first time

            if(frameNo==9000){//the first set of obstacles are removed after 9s
               
                setTimeout(function(){//after 0.2s, when the first set of obstacles go out of the canvas, then we remove them from the array as they are not needed anymore

                    obstacles=obstacles.slice(2, obstacles.length);//removing the first set of obstacles from the obstacles array       
                    firstRemoval=false;//setting first removal value to false as the first set of obstacles have now been removed from the obstacles array

                }, 200);                    

            }            

        }
        else{//if we are done with the removal of the first set of obstacles from the obstacles array

            if(frameNo%150==0){//removing a set of obstacles after every 3s
                
                setTimeout(function(){//after 0.2s, when the set of obstacles has gone out of the canvas, we remove them from the obstacles array as they are not needed anymore

                    obstacles=obstacles.slice(2, obstacles.length);                                            

                }, 200);

            }

        }        
    
    }    

    for(let i=0;i<obstacles.length;i++){//iterating on all the obstacles

        let obsX=obstacles[i].x;//getting the coordinates of the top-left corner and the width and the height of the current obstacle
        let obsY=obstacles[i].y;
        let obsWidth=obstacles[i].width;
        let obsHeight=obstacles[i].height;

        drawObstacle(obsX, obsY, obsWidth, obsHeight);//drawing the current obstacle

    }

    drawScore();//drawing the score

    collisionDetection();//detecting and handling collision

    if(upPressed){//moving the square upwards, in case up key is pressed
        y--;
    }
    else if(leftPressed){//moving the square left, in case left key is pressed
        x--;
    }
    else if(rightPressed){//moving the square right, in case right key is pressed
        x++;
    }
    else if(downPressed){//moving the square down, in case down key is pressed
        y++;
    }

    if(y<0){//making sure that the square does not go out of the top edge of the canvas
        y=0;
    }    
    if(y>(canvas.height-squareSide)){//making sure that the square does not go out of the bottom edge of the canvas
        y=(canvas.height-squareSide);
    }

    for(let i=0;i<obstacles.length;i++){//shifting all the obstacles towards left with each frame
        obstacles[i].x--;
    }    

}

let volumeOn=false;//default value of whether the volume is on or not

let volumeContainerInner=document.getElementById("volume-container-inner");//getting the inner volume container and the mute and the unmute elements
let mute=document.getElementById("mute");
let unmute=document.getElementById("unmute");

let countVol=0;//count of times the volume button is pressed

let gameOn=false;//default value of whether the game is on or not

let start=document.getElementById("start");//getting the start button
let countStr=0;//count of times the start button is pressed

let intervalId=null;//interval id of the setInterval function which is responsible for running the frames and is currently null as no setInterval function is defined

volumeContainerInner.addEventListener("click", function(){//handling the event when the inner volume container is pressed

    if(countVol%2==0){//if countVol is even

        if(gameOn){//if the game is on
            
            backgroundMusic.load();//loading and playing the background music
            backgroundMusic.play();

        }

        volumeContainerInner.style.backgroundColor="lightgreen";//setting the background color of the inner volume container to shade of green 
        mute.style.opacity="0";//hiding the mute icon and showing the unmute icon
        unmute.style.opacity="1";

        volumeOn=true;//setting volume on to true

    }
    else{//if countVol is odd

        if(gameOn){//if the game is on then we pause the backgound music
            backgroundMusic.pause();          
        }

        volumeContainerInner.style.backgroundColor="rgb(245, 53, 53)";//setting the background color of the inner volume container to shade of red
        unmute.style.opacity="0";//hiding the unmute icon and showing the mute icon
        mute.style.opacity="1";

        volumeOn=false;//setting volume on to false        

    }

    countVol++;//increasing countVol

});

start.addEventListener("click", function(){//handling the event when the start button is clicked

    if(countStr%2==0){//if countStr is even

        if(volumeOn){//if the volume is on, then we play the background music   
            backgroundMusic.play();
        }

        start.style.color="rgb(248, 76, 46)";//setting the color to shade of orange and background color to shade of white
        start.style.backgroundColor="whitesmoke";  
        start.innerText="pause game";//setting the content of the start button to "pause game"

        canvas.style.opacity="1";//making the game canvas appear
                      
        intervalId=setInterval(draw, 20);//setting the intervalId
        gameOn=true;//setting the value of gameOn to true

    }
    else{//if count Str is odd

        if(volumeOn){//if the volume is on, then we pause the background music
            backgroundMusic.pause();
        }

        start.style.color="whitesmoke"//setting the color to shade of white and background color to shade of orange
        start.style.backgroundColor="rgb(248, 76, 46)";  
        start.innerText="resume game";//setting the content of the start button to "resume game"
        
        canvas.style.opacity="0.3";//fading the game canvas

        clearInterval(intervalId);//clearing the game interval
        gameOn=false;//setting the value of gameOn to false

    }

    countStr++;//increasing countStr

});