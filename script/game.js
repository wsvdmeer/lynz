
/*// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
//document.body.appendChild(canvas);

console.log(document.body)


http://stackoverflow.com/questions/13916066/speed-up-the-drawing-of-many-points-on-a-html5-canvas-element
*/

var canvas;
var context;
var screenWidth = 400;
var screenHeight = 400;
var maxX = 4;
var maxY = 4;
var radius = 10;
var arcStop = 2 * Math.PI;
var offset = 100;
var padding= 20;
var dots = [];
var lines = [];
var paths = [];
var availableDots = [];



var offsetX;
var offsetY;

var firstSelected = false;

var dotOne = null;
var dotTwo = null;

var player = 0;
var players = ["ws1","ws2"];

//COLORS
var playerColor = ["#81ad29","#e2127b"];
var backgroundColor = "#9ea7b8";
var lineColor = "rgba(255, 255, 255, 0.2)";
var dotColor = "#ffffff";

var fromArray = [];
var toArray =  [];
var chainArray = [];

window.onload = init;



function init(){
    canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    document.body.appendChild(canvas);
    
    context = canvas.getContext('2d');
    context.fillStyle = backgroundColor;
    context.fillRect(0,0,screenWidth,screenHeight);
    
    offsetX = ((screenWidth-(padding*2))/(maxX-1));
    offsetY = ((screenHeight-(padding*2))/(maxY-1));

   
    //DRAW GRID  
    renderGrid();
    
    //DRAW DOTS
    createDots();
    
    //CLICK
    canvas.addEventListener("mousedown",onGridDown);
    
}

function createDots(){
    var cur =0;
    for(var y = 0;y<maxY;y++){
    for(var x = 0;x<maxX;x++){
        
             
            var xpos = Math.round((x * offsetX)+padding);
            var ypos =  Math.round((y * offsetY)+padding);
            
            context.beginPath();   
            context.arc(xpos,ypos, radius, 0, arcStop,false);
            context.fillStyle = dotColor;
            context.fill();
            context.closePath();
            
            //CREATE NUMBERS
            context.font = '10pt Arial';
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(cur, xpos, ypos+5);
 
            var dot = {};
            dot.x = xpos;
            dot.y = ypos;
            dot.id = cur;
            
            //LEFT SIBLING
             //check if same row!
            if ((cur>=1)){
                
                if (cur%maxX == 0) {
                     dot.leftSibling = -1;
                }else{
                    dot.leftSibling = cur-1;
                     
                }
              
               
                
            }else{
                dot.leftSibling = -1;
            }
            
            //RIGHT SIBLING
            
            //check if same row!
            if (cur<= (maxX*maxY)){
                if (cur%maxX == maxX-1) {
                    dot.rightSibling = -1;
                }else{
                     dot.rightSibling = cur+1;
                }
               
               
               
                
            }else{
                dot.rightSibling = -1;
            }
            
            //TOP SIBLING
            if (cur-maxX >= 0) {
                //code
                dot.topSibling = cur-maxX;
            }else{
                dot.topSibling = -1;
            }
            
            if (cur+maxX <= (maxX*maxY)) {
               dot.bottomSibling = cur+maxX;
            }else{
                dot.bottomSibling = -1;
            }
 
            dot.selected = false;
           // dot.paths = [];
           dot.chain= [];

            dots.push(dot);
              
              
              
            cur++;
           
            //ADD CLICK TO CANVAS
            //RENDER CANVAS AGAIN
   
        }
    }
}

//DRAW
function draw(){

    //FILL CONTEXT
    context.clearRect ( 0 , 0 , canvas.width, canvas.height );
    context.fillStyle = backgroundColor;
    context.fillRect(0,0,screenWidth,screenHeight);
    
    //RENDER GRID
    renderGrid();
    
    //DRAW LINES
    for(var l =0;l<lines.length;l++){
        var line = lines[l];
        context.lineWidth = 5;
        context.strokeStyle = playerColor[line.player];
        context.beginPath();
        context.moveTo(line.startX, line.startY);
        context.lineTo(line.endX, line.endY);
        context.closePath();
        context.stroke();
    }
    
    
    //DRAW DOTS
    for(var i =0;i<dots.length;i++){
        var dot = dots[i];
        context.beginPath();   
        
      
        //HIGHLIGHT
        if (availableDots.length==0) {
             context.arc(dot.x,dot.y, radius, 0, arcStop,false);
        }else{
            for(var a = 0;a<availableDots.length;a++){
                if (dot.id == availableDots[a]) {
                   
                    context.lineWidth=5;
                    context.strokeStyle=playerColor[player];
                    context.arc(dot.x,dot.y, radius, 0, arcStop,false);
                   
                    context.stroke();
                    
                }else{
                    context.arc(dot.x,dot.y, radius, 0, arcStop,false);
                }
            }
        }
        //FILL
        context.fillStyle = dotColor;
        context.fill();
        context.closePath();
        
         context.font = '10pt Arial';
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.fillText(dot.id, dot.x, dot.y+5);
    }
    
    //DRAW TEXT
   

}



function renderGrid() {
    
        context.save();
        context.lineWidth = 5;
        context.strokeStyle = lineColor;
      
        var stepY = ((screenHeight-(padding*2))/(maxY-1));
        var stepX = ((screenWidth-(padding*2))/(maxX-1));
       
       
        for(var x =0;x<maxX;x++){
            var ypos = (x*stepY)+padding//screenHeight/maxY///(x * (offsetY))+padding;
            context.beginPath();
            context.moveTo(padding, ypos);
            context.lineTo(canvas.width-padding, ypos);
            context.closePath();
            context.stroke();
        }
        
        
        for(var y=0;y<maxY;y++){
            var xpos = (y * stepX)+padding;
            context.beginPath();
            context.moveTo(xpos, padding);
            context.lineTo(xpos, canvas.height-padding);
            context.closePath();
            context.stroke();    
        }
        context.restore();
}

function onGridDown(event) {
    //code
   
    var px = event.pageX;
    var py = event.pageY;
 
    
    
    
    for(var i = 0;i<dots.length;i++){
        var dot = dots[i];
        
        
        if ((px <dot.x+radius)&&(px >dot.x-radius)&&(py <dot.y+radius)&&(py >dot.y-radius)) {
            

            if (!firstSelected) {
                dotOne = dot;
                
                //SHOW SELECTABLE
                showSelectable(dotOne);
                firstSelected = true;
                
            }else {
                dotTwo = dot;
                
                if (dotOne != dotTwo) {
        
                    var available = false
                    
                    //CHECK AVAILABLE DOT
                    for(var a =0;a<availableDots.length;a++){

                        if (dotTwo.id == availableDots[a]) {
                            available = true;
                        }
                    }

                    if (available) {
                        
                        //console.log(dotOne.x+"X"+dotOne.y)
                        
                        drawLine(dotOne,dotTwo,player);
                        
                        nextPlayer();
                        availableDots = [];
                    }else{
                        console.log("not available");
                        
                    }
  
                }else{
                    console.log("same dot!");
                }
                //RESET
                firstSelected = false;
                dotOne = null;
                dotTwo = null;
                
               
            }
            draw();    
        }
    }
}





function nextPlayer() {
    player++;
    if (player>=players.length) {
       player = 0;
    }
}





function sortNumber(a,b) {
    return a - b;
}


function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}





//CHECK IF THERE IS AL LINE BETWEEN TO POINTS
function hasLine(fromId,toId){
    //console.log("has line from id : "+fromId+" - to "+toId)
    var bool = false;
    for(var i =0;i<lines.length;i++){
        var line = lines[i];
        //console.log("check from : "+line.fromId+" -  to "+line.toId); 
        if ((line.fromId == fromId)||(line.fromId == toId)){
            if((line.toId == fromId)||(line.toId == toId)) {
                 bool = true;
            }
        }
    }
    return bool;
}

function showSelectable(currentDot){
    availableDots = [];
    var id = currentDot.id;
    var leftDot = currentDot.leftSibling;
    var rightDot = currentDot.rightSibling;
    var topDot = currentDot.topSibling;
    var bottomDot = currentDot.bottomSibling;

    if (leftDot!=-1) {
      
        if (!hasLine(id,leftDot)) {
            availableDots.push(leftDot);
        }
    }
    if (rightDot!=-1) {
       
        if (!hasLine(id,rightDot)) {
            availableDots.push(rightDot);
        }
    }
    if (topDot!=-1) {
       
        if (!hasLine(id,topDot)) {
            availableDots.push(topDot);
        }
    }
    if (bottomDot!=-1) {

        if (!hasLine(id,bottomDot)) {
            availableDots.push(bottomDot);
        }
    }
    currentDot = null;
   
}

function drawLine(dotOne,dotTwo,player) {
   var line = {};

   line.fromId = dotOne.id;
   line.toId = dotTwo.id;
   
   line.startX = dotOne.x;
   line.endX = dotTwo.x;
   line.startY = dotOne.y;
   line.endY = dotTwo.y;
   line.player = player;
   lines.push(line);
  
   checkPath(dotOne,dotTwo);
    


}
/*var current = null;
var cnt = 0;
for (var i = 0; i < array_elements.length; i++) {
    if (array_elements[i] != current) {
        if (cnt > 0) {
            document.write(current + ' comes --> ' + cnt + ' times<br>');
        }
        current = array_elements[i];
        cnt = 1;
    } else {
        cnt++;
    }
}
if (cnt > 0) {
    document.write(current + ' comes --> ' + cnt + ' times');
}*/

function cleanArray(arr){
    
    var k = {};

    //push into hashtable
    for(i in arr){
     k[arr[i]]=(k[arr[i]]||0)+1; //increments count if element already exists
    }
    
    //result
    for(var j in k) {
     console.log(j+" comes -> "+k[j]+" times");
    }
}

function checkPath(dotOne,dotTwo){
    
    console.log("add "+dotOne.id+"/"+dotTwo.id);
    paths.push(dotOne.id,dotTwo.id);
    
    
    //REMOVE DOUBLES
    var sorted = paths.sort(sortNumber);
   
    console.log(sorted)
    cleanArray(sorted);
    
   /* var foundOne = 0;
    var foundTwo = 0;
    for (var i = 0;i<paths.length;i++) {
        if (paths[i] == dotOne.id) {
            foundOne++;
        }else if (paths[i]== dotTwo.id) {
            foundTwo++;
        }
    }
    
    console.log("found "+dotOne.id+" : "+foundOne+"x / found "+dotTwo.id+" : "+foundTwo+"x")
    
    console.log(paths.sort(sortNumber))
    
    
    if (foundOne>=2 && foundTwo>=2 ) {
        console.log("combine")
    }
   */
   
   
    //console.log(uniq_fast(paths.sort(sortNumber)));
    
}

