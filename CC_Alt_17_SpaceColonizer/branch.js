// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Branch(sketch, parent, pos, dir) {
  this.pos = pos;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = 5;
  this.bornAt = 0;

  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  }


  this.next = function() {
    var nextDir = p5.Vector.mult(this.dir, this.len);
    var nextPos = p5.Vector.add(this.pos, nextDir);
    var nextBranch = new Branch(sketch, this, nextPos, this.dir.copy());
    return nextBranch;
  }

  this.show = function() {
    if(this.bornAt < 100)
    if (parent != null) {
      sketch.stroke(255);
      sketch.line(this.pos.x, this.pos.y, this.pos.z, this.parent.pos.x, this.parent.pos.y, this.parent.pos.z);
    }
    this.bornAt++;

  }
}
