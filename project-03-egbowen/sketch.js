
let ydiff = 0.01
let NUM_BIRDS = 200;
let system 

function setup() {
  createCanvas(400, 400);
  ellipseMode(CENTER);
  system = new BirdSystem()
}

function draw() {
  background("#ADD8E6")
  randomSeed(2)


  noStroke()
  drawMountains()
  system.update()
  system.draw()

  // noStroke()
  // drawMountains()
  drawTrees()
  drawWater()
}

function drawTrees(){ 
  //left trees
  for (let i = 0; i <= width/2; i+=random(20, 50)){//bigger ones 
    let treeSpot = createVector(i, height)
    let treeHt = abs(height/3 + abs(i - height/2)) + random(20, 70)
    let green = color(random(0, 10), random(30, 60), random(20, 40))
    evergreen(treeSpot, treeHt, green)
  }
  for (let i = 0; i <= width/2; i+=random(20, 50)){ //smaller ones
    let treeSpot = createVector(i, height)
    let treeHt = abs(height/3 + abs(i - height/2)) + random(20, 80)
    let green = color(random(0, 10), random(50, 70), random(20, 40))
    evergreen(treeSpot, treeHt/random(1.5, 3), green)
  }

  //right trees
  for (let i = width + 50; i >= width/2; i-=random(20, 50)){//bigger ones 
    let treeSpot = createVector(i, height)
    let treeHt = abs(height/3 + abs(i - height/2)) + random(-20, 20)
    let green = color(random(0, 10), random(30, 60), random(20, 40))
    evergreen(treeSpot, treeHt, green)
  }
  for (let i = width + 50; i >= width/2 - 50; i-=random(20, 50)){//smaler ones 
    let treeSpot = createVector(i, height)
    let treeHt = abs(height/3 + abs(i - height/2)) + random(-20, 20)
    let green = color(random(0, 10), random(50, 70), random(20, 40))
    evergreen(treeSpot, treeHt/random(1.5, 3), green)
  }
}

function drawMountains(){
  sinMountain()
  //mountain(3/8*height, 5/8*height, '#f5fcff')
  noiseLine(3/8*height, 6/8*height, color('#5c6ac4'), 0.06, 10);
  noiseLine(4/8*height, 6/8*height, color('#3d53c1'), 0.07, 10);
  // mountain(3/8*height, 6/8*height, color('#5c6ac4'), 0.06, 10);
  // mountain(4/8*height, 6/8*height, color('#3d53c1'), 0.07, 10);
}

function drawWater(){
 water(0.009, 19/20*height)
 //water(0.002,  10+ 19/20*height)
 //so, in theory this should work to make water layers but it does not. sad.
}

function water(add, start){
  beginShape()
  for (let i = start; i <=height; i+= 100){
    let xdiff = 0.04
    beginShape()
    fill(random(40,60), random(90, 130), random(200,200))
    for (let j = 0; j <= width; j++){
      let y = map(noise(xdiff, ydiff), 0, 1, i, i-30)
      vertex(j,y)
      xdiff+=0.01
    }
    vertex(width, height)
    vertex(0, height)
    //ydiff+=0.009
    ydiff += add
    endShape()
  }

}


function noiseLine(minHt, maxHt, colorr, noiseChange, step){
  //use noise values to make a mountain range
  fill(colorr)
  //let noiseChange = 0.1
  beginShape()
  let  noiseVal = random(0,20);
  for (let x = 0; x <= width + 15; x+= step){
    let y = map(noise(noiseVal), 0, 1, minHt, maxHt) //map the noise value of val into the range you want it to be 
    vertex(x, y)
    noiseVal += noiseChange
  }
  vertex(width, height)
  vertex(0, height)
  endShape();
  //fill mountain with "ants" to make texture
}

function evergreen(bottom, ht, treeColor){
  let vleft = createVector(bottom.x - (1/5)*ht, bottom.y)
  let vright = createVector(bottom.x + (1/5)*ht, bottom.y)
  let vtop = createVector(bottom.x , bottom.y -ht)
  fill(treeColor)
  //fill(color(random(0, 10), random(30, 70), random(20, 40)))
  beginShape()
  vertex(vleft.x, vleft.y)
  noiseLineTree(vleft, vtop)
  noiseLineTree(vtop, vright) //this is the one we like -- top down
  vertex(vright.x, vright.y) 
  endShape()
}


function noiseLineTree(start, end){
  let nosieChange= random(3,6)
  let texture = random(10,20)
  let neg = -1
  if(start.y < end.y){
    neg = 1
  }
  //start and end are vectors 
  //this is all vertices in a shape
  let ydiff = end.y - start.y
  let xdiff = end.x - start.x
  let m = ydiff/xdiff
  let b = start.y - (m*start.x)
  
  //draw line 
  vertex(start.x, start.y)
  for (let i = 0; i <= xdiff; i+=1){
    let gradient = abs(xdiff/2 - abs(i - xdiff/2)) //makes the values further away from center lower 
    let moved = texture*noise(i*nosieChange)
    let hereX = i + start.x
    let hereY = m*(hereX) + b
    let noisyY = hereY +neg*(moved*(gradient/(xdiff/2)))
    let noisyX = hereX + (moved*(gradient/(xdiff/2)))

    //vertex(i+start.x, noisyY)
    vertex(noisyX, noisyY)
  }
  vertex(end.x, end.y)
}


function sinMountain(){
  let nosieChange= 5
  let texture = 7
  let shift = random(0,80)
  let apexX 
  let apexY
  fill('#dce5eb')
  beginShape()
  vertex(0, height)
  noiseLineTree(createVector(0,height), createVector())
  for (let i = 0; i <= width; i+=10){
    let gradient = abs(width/2 + abs(i - width/2)) //makes the values further away from center lower 
    let moved = texture*noise(i*nosieChange)
    let hereX = i 
    let hereY = -300*sin(1/200*(hereX)) + (height + shift)
    let noisyY = hereY + (moved*(gradient/(width/2)))
   
    vertex(hereX, noisyY)

    if (i <= 100*PI + 5 && i >= 100*PI - 5 ){
      //top middle point:(100pi,  noisyY) 
      //i is the x value -- value to put lines from 
      apexX = i
      apexY = noisyY
    }
  }
  vertex(width, height)
  endShape()
}


class BirdSystem{
  birds = []

  constructor() {
  }


  update(){
    for (let i = 0; i < NUM_BIRDS+3; i++){
      if (this.birds.length < NUM_BIRDS ){ 
        this.bird = new Bird(random(0,width), random(0, height/2), random(0.5, 0.21), random(0.5, 2), color(random(200, 255), random(100, 180), random(130, 200)));
        this.birds.push(this.bird);
      }
    }
     
    for (let b of this.birds){
      b.keepInside()
      b.update(this.birds)
    }
  }

  draw(){
    for (let b of this.birds){
      b.draw(this.birds)
    }
  }
}

class Bird{
  constructor(x, y, maxForce, maxSpeed, color){
    this.position = createVector(x, y);
    this.velocity = createVector(random(-5, 5),random(-5,5));
    this.maxForce = maxForce;
    this.maxSpeed = maxSpeed
  }

  
  separation(otherBirds){
    let posDiff = createVector(0,0) // pos diff between birds 
    let avoid = 0.03 //subject to change 
    let avoidDist = 10 //radius in which to avoid these birds 
    for (let other of otherBirds){
      // if eithin a distance 
      let distDiff = dist(this.position.x, this.position.y, other.position.x, other.position.y)
      if( avoidDist >= distDiff && other != this){
        posDiff.x += this.position.x - other.position.x
        posDiff.y += this.position.y - other.position.y
      }
    }
    posDiff.mult(avoid)

    return posDiff
  }
  
  cohesion(otherBirds){ //point in avg direction of all other birds 
    //avr position vector 
    let avrPos = createVector()
    let cohesionDist = 30
    let others = 0
    let factor = 0.03
    //calculate avg position of all others within a certain idst
    for (let other of otherBirds){
      let distDiff = dist(this.position.x, this.position.y, other.position.x, other.position.y)
      if(cohesionDist >= distDiff && other != this){
        avrPos.x += other.position.x
        avrPos.y += other.position.y
        others +=1
      }
    }

    if (others > 0){
      avrPos.add(this.position)
      avrPos.div(others+1)
      avrPos.sub(this.position)
      avrPos.mult(factor)
      avrPos.limit(this.maxForce)

    }
    
    return avrPos
  
  }

  alignment(otherBirds){
    //avg velocity vector
    let avgVelOthers = createVector()
    let alignmentDist = 50
    let othersNum = 0
    //calculate avg position of all others within a certain idst
    for (let other of otherBirds){
      let distDiff = dist(this.position.x, this.position.y, other.position.x, other.position.y)
      if(alignmentDist >= abs(distDiff) && other != this){
        //calculate avg velocity of all birds within a certain distance
        //cqalculate how many others are within distance 
        avgVelOthers.add(other.velocity)
        othersNum +=1
      }
    }

    if (othersNum > 0){
      othersNum +=1
      avgVelOthers.add(this.velocity)
      avgVelOthers.div(othersNum) // now is really the avg velocity of all others in the range
      avgVelOthers.limit(this.maxForce)
    }
   
    return avgVelOthers
  }

  keepInside(){
    if (this.position.x >= width){
      //this.velocity.x *= -1;
      this.position.x = 0
    }
    if (this.position.x <0){
      //this.velocity.x *= -1;
      this.position.x = width
    }

    if (this.position.y > height/2){
      this.velocity.y *= -1;
      //this.position.y = 0
    }
    if (this.position.y < 0){
      //this.velocity.y *= -1;
      this.position.y = height
    }
  }

  update(birdies){
    //birdies is the list of all birds 
    let teamMentality = this.cohesion(birdies) // be in same ish place: returns avg position
    let alignn = this.alignment(birdies) // speed: go in same direction: returns avg velocity 
    let getAway = this.separation(birdies) // dont get too close: returns avg pos

    this.velocity.add(teamMentality)
    this.velocity.add(alignn)
    this.velocity.add(getAway)
    this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity);
  }

  draw(){
    fill('black');
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    //circsle(0,0,1)
    bezier(0,0,  -0.25, 0.5, -0.75, 0.25 ,  -1,0)
    bezier(0,0,  0.25, 0.5, 0.75, 0.25,  1,0)
    pop();
  }
}

function nighttime(){
  fill(0,0,0,200)
  circle(100,100,100)
}

function keyPressed(){
  if (keyCode == 86 && screen == 1){ //v
    nighttime()
  } 
}
