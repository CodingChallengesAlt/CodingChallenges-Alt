// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ERQcYaaZ6F0

// instance mode by Naoto Hieda

var circles;
var img;

var s = function (sketch) {

  sketch.setup = function () {
    sketch.createCanvas(800, 800);

    img = sketch.createGraphics(800, 800);
    img.beginDraw();
    img.background(0);
    // img.fill(255, 0, 0);
    // img.ellipse(200, 200, 500, 500);
    for(let i = 0; i < img.width; i++) {
      img.stroke(parseInt((i % 100) / 50) * 200 + 55);
      img.line(i, 0, i, img.height/2);
      img.stroke(parseInt((i % 200) / 100) * 200 + 55);
      img.line(i, img.height/2, i, img.height);
    }
    img.endDraw();

    var density = sketch.displayDensity();
    sketch.pixelDensity(1);
    img.loadPixels();
    circles = [];

    console.log(img.width);
    console.log(img.height);
    console.log("pixels", img.pixels.length);
    console.log(density)
  }

  sketch.draw = function () {
    sketch.background(0);

    var total = 3;
    var count = 0;
    var attempts = 0;

    while (count < total) {
      var newC = sketch.newCircle();
      if (newC !== null) {
        circles.push(newC);
        count++;
      }
      attempts++;
      if (attempts > 1000) {
        break;
      }
    }

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];

      if (circle.growing) {
        if (circle.edges()) {
          circle.growing = false;
        } else {
          for (var j = 0; j < circles.length; j++) {
            var other = circles[j];
            if (circle !== other) {
              var d = sketch.dist(circle.x, circle.y, other.x, other.y);
              var distance = circle.r + other.r;

              if (d - 1 < distance) {
                circle.growing = false;
                break;
              }
            }
          }
        }
      }

      circle.show();
      if(sketch.random(1) > 0.9) circle.grow();
    }
  }

  sketch.newCircle = function () {
    var x = sketch.random(0, img.width);
    var y = sketch.random(0, img.height);

    var valid = true;
    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];
      var d = sketch.dist(x, y, circle.x, circle.y);
      if (d - 2 < circle.r) {
        valid = false;
        break;
      }
    }
    if (valid) {
      var index = (parseInt(x) + parseInt(y) * img.width);
      var c;
      if(sketch.isLiveJs) {
        c = img.pixels[index];
      }
      else {
        var r = img.pixels[index * 4];
        var g = img.pixels[index * 4 + 1];
        var b = img.pixels[index * 4 + 2];
        c = sketch.color(r, g, b);
      }
      return new Circle(sketch, x, y, c);
    } else {
      return null;
    }
  }

};

var myp5 = new p5(s);
