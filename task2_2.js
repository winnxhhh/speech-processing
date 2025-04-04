// self written code start

var soundFile1, soundFile2, soundFile3;
var analyzer;
var sound1Button, sound2Button, sound3Button, musicButton, recogniseButton;
var sound1RMS, sound2ZCR, sound3Flat, musicEnergy;

var colourChoices = ["black", "white", "red", "green", "blue"];
var shapeChoices = ["square", "triangle", "circle", "pentagon"];

var currentColour = "black";
var currentShape = "square";

// Pre-load all sounds
function preload() {
    soundFile1 = loadSound('./assets/Ex2_sound1.wav');
    soundFile2 = loadSound('./assets/Ex2_sound2.wav');
    soundFile3 = loadSound('./assets/Ex2_sound3.wav');
    musicFile = loadSound('./assets/Kalte_Ohren_(_Remix_).mp3');
}

function setup() {
    createCanvas(800, 600);
    noStroke();

    // Set up buttons
    soundButtons();

    // Initialize speech recognition
    recognition = new p5.SpeechRec("en-US", handleSpeech);
    recognition.continuous = false; // Single recognition event
    recognition.interimResults = false; // Final results only
}

// Meyda Analyzer for soundFile1
function setupMeyda1() {
    analyzer = Meyda.createMeydaAnalyzer({
        "audioContext": getAudioContext(),
        "source": soundFile1,
        "bufferSize": 512,
        "featureExtractors": ['rms'],
        "callback": features => {
            sound1RMS = features.rms * 4000;
        }
    });

    analyzer.start();
}

// Meyda Analyzer for soundFile2
function setupMeyda2() {
    analyzer = Meyda.createMeydaAnalyzer({
        "audioContext": getAudioContext(),
        "source": soundFile2,
        "bufferSize": 512,
        "featureExtractors": ['zcr'],
        "callback": features => {
            sound2ZCR = features.zcr * 10;
        }
    });

    analyzer.start();
}

// Meyda Analyzer for soundFile3
function setupMeyda3() {
    analyzer = Meyda.createMeydaAnalyzer({
        "audioContext": getAudioContext(),
        "source": soundFile3,
        "bufferSize": 512,
        "featureExtractors": ['spectralFlatness'],
        "callback": features => {
            sound3Flat = features.spectralFlatness * 2500;
        }
    });

    analyzer.start();
}

// Meyda Analyzer for musicFile
function setupMeyda4() {
    analyzer = Meyda.createMeydaAnalyzer({
        "audioContext": getAudioContext(),
        "source": musicFile,
        "bufferSize": 512,
        "featureExtractors": ['energy'],
        "callback": features => {
            musicEnergy = features.energy * 10;
        }
    });

    analyzer.start();
}

function draw() {
    background(0);
    rectMode(CENTER);

    // Change opacity of rectangle according to soundFile1's RMS
    if(soundFile1.isPlaying())
    {
        fill(153, 178, 221, sound1RMS);
        rect(width/2, height/2, 200, 320);
    }

    // Change size of rectangle according to soundFile2's ZCR
    if(soundFile2.isPlaying())
        {
            fill(233, 175, 163);
            rect(width/2, height/2, sound2ZCR, sound2ZCR/2);
        }
    
    // Change stroke weight of rectangle according to soundFile3's spectral flatness
    if(soundFile3.isPlaying())
    {
        push()
        fill(148, 86, 0);
        stroke(126, 161, 114);
        strokeWeight(sound3Flat);
        rect(width/2, height/2, 30, 30);
        pop()
    }

    // Changing Music Visualisations Using Voice Command
    if(musicFile.isPlaying())
    {
        if(currentShape === "square") {
            rect(width / 2, height / 2, 100 + musicEnergy, 100 + musicEnergy);
        } else if(currentShape === "circle") {
            ellipse(width / 2, height / 2, 100 + musicEnergy);
        } else if(currentShape === "triangle") {
            triangle(width / 2 - 50 + musicEnergy/5, height / 2 + 50, width / 2, height / 2 - 50 - musicEnergy/5, width / 2 + 50 - musicEnergy/5, height / 2 + 50);
        } else if(currentShape === "pentagon") {
            beginShape();
            for (let i = 0; i < 5; i++) {
                let angle = TWO_PI / 5 * i - HALF_PI + musicEnergy/5;
                let x = width / 2 + cos(angle) * 50 + musicEnergy/5;
                let y = height / 2 + sin(angle) * 50;
                vertex(x, y);
            }
            endShape(CLOSE);
        }
    
        if(currentColour === "black") {
            fill(0);
            stroke(255);
        } else if(currentColour === "white") {
            fill(255);
            stroke(0);
        } else if(currentColour === "red") {
            fill(255, 0, 0);
        } else if(currentColour === "green") {
            fill(0, 255, 0);
        } else if(currentColour === "blue") {
            fill(0, 0, 255);
        }
    }
   
}

// Function to Handle Voice Recognition
function handleSpeech() {
    const userInput = recognition.resultString.trim().toLowerCase();
    const words = userInput.split(" ");

    // Variables to store detected color and shape
    var detectedColour = null;
    var detectedShape = null;

    // Check each word in the user input
    for (const word of words) {
        if (colourChoices.includes(word)) {
            detectedColour = word;
        } else if (shapeChoices.includes(word)) {
            detectedShape = word;
        }
    }

    // Update color and shape if detected
    if (detectedColour) {
        currentColour = detectedColour;
    }
    if (detectedShape) {
        currentShape = detectedShape;
    }

    // Log for debugging or in case of unrecognized commands
    if (!detectedColour && !detectedShape) {
        console.log(`Unrecognized command: ${userInput}`);
    } else {
        console.log(`Detected Color: ${detectedColour}, Detected Shape: ${detectedShape}`);
    }
}

// Draws out buttons to play/stop sounds
function soundButtons() {
    sound1Button = createButton('Sound 1');
    sound1Button.size(100, 50);
    sound1Button.position(width / 4 - 45, 120);
    sound1Button.mousePressed(playSound1);

    sound2Button = createButton('Sound 2');
    sound2Button.size(100, 50);
    sound2Button.position(width / 2 - 45, 120);
    sound2Button.mousePressed(playSound2);

    sound3Button = createButton('Sound 3');
    sound3Button.size(100, 50);
    sound3Button.position(3 * width / 4 - 45, 120);
    sound3Button.mousePressed(playSound3);

    musicButton = createButton('PLAY Music');
    musicButton.size(100, 50);
    musicButton.position(width / 2 - 45, 190);
    musicButton.mousePressed(playMusic);

    recogniseButton = createButton("Change Music Visuals with Voice");
    recogniseButton.position(width / 2 - 105, height / 2 + 340);
    recogniseButton.mousePressed(() => recognition.start());
}

///// Button Logics /////
function playSound1() {
    if (soundFile1.isPlaying()) {
        soundFile1.stop();
    } else {
        soundFile1.play();
        setupMeyda1();
    }
}

function playSound2() {
    if (soundFile2.isPlaying()) {
        soundFile2.stop();
    } else {
        soundFile2.play();
        setupMeyda2();
    }
}

function playSound3() {
    if (soundFile3.isPlaying()) {
        soundFile3.stop();
    } else {
        soundFile3.play();
        setupMeyda3();
    }
}

function playMusic() {
    if (musicFile.isPlaying()) {
        musicFile.stop();
    } else {
        musicFile.play();
        setupMeyda4();
    }
}

// self written code end
