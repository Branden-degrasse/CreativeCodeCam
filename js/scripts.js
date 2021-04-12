var vidcapture, ctracker, drawcanvas;

var allParticles = [];
var maxSplitCount = 1;  // Define the maximum number of times a particle can split.

function Particle(x, y, splitCount) {  // Added extra parameter to determine the split count this particle starts with.
	
  this.splitCount = splitCount;  // The number of times this particle will split.
  this.age = 0;  // The total age of this particle. It will increase at every iteration it moves.
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.splitCount, 0, maxSplitCount, 2, 2));  // Map the split count to how fast it should move.
	
  this.move = function() {		
    this.vel.mult(.85);
    this.pos.add(this.vel);
    
		// At every 10th iteration this particle will try to split itself to create a new particle.
		// This is provided that its split count is at least above 0.
    if (this.age % 10 == 0 && this.splitCount > 0) {
			allParticles.push(new Particle(this.pos.x, this.pos.y, this.splitCount - 1));  // Create a new particle with a lower split count (remember, its direction will be randomized in its constructor)
			this.splitCount -= 1;  // Decrease this particle's split count by one, otherwise it would split forever!
    }
		
		this.age++;  // Increase its age.
  }
}

function setup(){
	var cnv = createCanvas(windowWidth, windowHeight/1.2);
	cnv.parent("p5canvas");

	// p5 method for creating a video stream
	vidcapture = createCapture(VIDEO);
	vidcapture.size(vidcapture.width*2,vidcapture.height*3);
	vidcapture.hide();

	// start the tracker
	ctracker = new clm.tracker();
	ctracker.init();
	ctracker.start(vidcapture.elt);
	// just for testing
	drawcanvas = document.getElementById('defaultCanvas0');
}

function draw(){

	image(vidcapture, 0, 0);
	translate(windowWidth/3.5,windowHeight/3.5);
	var positions = ctracker.getCurrentPosition();

	background(0);
	
  for (let i = allParticles.length - 1; i > -1; i--) {
    allParticles[i].move();
		point(allParticles[i].pos.x, allParticles[i].pos.y);
		
    if (allParticles[i].vel.mag() < 0.01) {
      allParticles.splice(i, 1);
    }
  }
	if(positions){

		positions.forEach(function(pos){
			allParticles.push(new Particle(pos[0], pos[1], maxSplitCount));

				var r = map(positions[62][0], 250, 300, 0, 255, true);
				var b = map(positions[62][1], 100, 200, 0, 255, true);
				stroke(r, 255, b);
	strokeWeight(3);
		})
		// ctracker.draw(drawcanvas);
	}
}

function mouseDragged() {
	if (frameCount % 4 == 0) {
  	allParticles.push(new Particle(mouseX, mouseY, maxSplitCount));  // Create a new particle at mouse's position with the maximum split count.
	}
}

