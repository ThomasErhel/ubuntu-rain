let streams = [];
let fadeInterval = 1.6;
let symbolSize = 14;
let frameCounter = 1;
let rSlider, gSlider, bSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // create sliders
  rSlider = createSlider(0, 255, 255);
  rSlider.position(20, height - 100);
  gSlider = createSlider(0, 255, 255);
  gSlider.position(20, height - 70);
  bSlider = createSlider(0, 255, 255);
  bSlider.position(20, height - 40);

  let x = 0;
  for (let i = 0; i <= width / symbolSize; i++) {
    let stream = new Stream();
    stream.generateSymbols(x, random(-2000, 0));
    streams.push(stream);
    x += symbolSize;
  }

  textFont("Ubuntu");
  textSize(symbolSize);
}

function draw() {
  const r = rSlider.value();
  const g = gSlider.value();
  const b = bSlider.value();
  background(r, g, b);
  streams.forEach((stream) => {
    stream.render();
  });
}

class RainSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;
    this.speed = speed;
    this.first = first;
    this.opacity = opacity;
    this.switchInterval = round(random(2, 25));
  }

  setToRandomSymbol() {
    let charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // set it to Katakana
        this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
      } else {
        // set it to numeric
        this.value = round(random(0, 1));
      }
    }
  }

  rain() {
    if (frameCounter % this.speed == 0) {
      this.y = this.y >= height ? 0 : this.y + symbolSize;
    }
  }
}

class Stream {
  constructor() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));
    this.speed = floor(random(5, 30)); // frame skip
  }

  generateSymbols(x, y) {
    let opacity = 255;
    let first = round(random(0, 4)) == 1;
    for (let i = 0; i <= this.totalSymbols; i++) {
      let symbol = new RainSymbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= 255 / this.totalSymbols / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  render() {
    frameCounter++;
    this.symbols.forEach(function (symbol) {
      if (symbol.first) {
        fill(119, 33, 111, symbol.opacity);
      } else {
        fill(233, 84, 32, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
    if (frameCounter >= 60) {
      frameCounter = 0;
    }
  }
}
