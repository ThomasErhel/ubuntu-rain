const streams = [];
const fadeInterval = 1.6;
const symbolSize = 14;
let frameCounter = 1;
let rSlider, gSlider, bSlider;

function setup() {
  // create sliders
  rSlider = createSlider(0, 255, 100);
  rSlider.position(20, 700);
  gSlider = createSlider(0, 255, 0);
  gSlider.position(20, 750);
  bSlider = createSlider(0, 255, 255);
  bSlider.position(20, 800);
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  let x = 0;
  for (let i = 0; i <= width / symbolSize; i++) {
    let stream = new Stream();
    stream.generateSymbols(x, random(-2000, 0));
    streams.push(stream);
    x += symbolSize
  }

  textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  const r = rSlider.value();
  const g = gSlider.value();
  const b = bSlider.value();
  background(r, g, b);
  text('Rouge', rSlider.x * 2 + rSlider.width, 700);
  text('Vert', gSlider.x * 2 + gSlider.width, 750);
  text('Bleu', bSlider.x * 2 + bSlider.width, 800);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(2, 25));

  this.setToRandomSymbol = function() {
    let charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // set it to Katakana
        this.value = String.fromCharCode(
          0x30A0 + round(random(0, 96))
        );
      } else {
        // set it to numeric
        this.value = round(random(0,9));
      }
    }
  }

  this.rain = function() {
    if(frameCounter % this.speed==0){
      this.y = (this.y >= height) ? 0 : this.y += symbolSize;
    }
  }

}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(5, 35));
  this.speed = floor(random(5, 30)); // frame skip

  this.generateSymbols = function(x, y) {
    let opacity = 255;
    let first = round(random(0, 4)) == 1;
    for (let i =0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
      );
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  this.render = function() {
    frameCounter++;
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(3, 244, 252, symbol.opacity);
      } else {
        fill(3, 119, 252, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
    if(frameCounter>=60){
      frameCounter = 0;
    }
  }
}