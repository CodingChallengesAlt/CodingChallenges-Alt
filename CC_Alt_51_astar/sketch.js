// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// instance mode by Naoto Hieda

// How many columns and rows?
var cols = 50;
var rows = 50;

// This will be the 2D array
var grid = new Array(cols);

// Open and closed set
var openSet = [];
var closedSet = [];

// Start and end
var start;
var end;

// Width and height of each cell of grid
var w, h;

// The road taken
var path = [];
var paths = [];


var s = function (sketch) {

  // Function to delete element from the array
  sketch.removeFromArray = function (arr, elt) {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }

  // An educated guess of how far it is between two points
  sketch.heuristic = function (a, b) {
    var d = sketch.dist(a.i, a.j, b.i, b.j);
    // var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
  }

  sketch.setup = function () {
    sketch.createCanvas(800, 800);

    openSet = [];
    closedSet = [];
    path = [];
    paths = [];

    // Grid cell size
    w = sketch.width / cols;
    h = sketch.height / rows;

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Spot(sketch, i, j);
      }
    }

    // All the neighbors
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }


    // Start and end
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;

    // openSet starts with beginning only
    openSet.push(start);
  }

  sketch.draw = function () {

    // Am I still searching?
    if (openSet.length > 0) {

      // Best next option
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];

      // Did I finish?
      if (current === end) {
        console.log("DONE!");
        sketch.setup();
        return;
      }

      // Best option moves from openSet to closedSet
      sketch.removeFromArray(openSet, current);
      closedSet.push(current);

      // Check all the neighbors
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        // Valid next spot?
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + sketch.heuristic(neighbor, current);

          // Is this a better path than before?
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          // Yes, it's a better path
          if (newPath) {
            neighbor.h = sketch.heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }

      }
      // Uh oh, no solution
    } else {
      console.log('no solution');
      sketch.setup();
      return;
    }

    // Draw current state of everything
    sketch.background(0);

    // for (var i = 0; i < cols; i++) {
    //   for (var j = 0; j < rows; j++) {
    //     grid[i][j].show();
    //   }
    // }

    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(sketch.color(255, 50, 50));
    }

    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(sketch.color(100, 0, 255));
    }


    // Find the path by working backwards
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }


    // for (var i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255));
    //}

    paths.push(path);
    if (paths.length > 50) paths.shift();

    for (let n = 0; n < paths.length; n++) {
      let p = paths[n];
      // Drawing path as continuous line
      sketch.noFill();
      sketch.stroke(255, n * 3);
      sketch.strokeWeight(2);
      sketch.beginShape();
      for (let i = 0; i < p.length; i++) {
        sketch.vertex(p[i].i * w + w / 2, p[i].j * h + h / 2);
      }
      sketch.endShape();
    }


  }

};

var myp5 = new p5(s);
