// self written code start

var playButton;
var generateButton;
var generatedWord;
var isPlaying = false;
var recognition;
var soundFile;
var soundPlay = false;

// Audio files for CAPTCHA words
var audioFiles = {};

// Array of simple words for CAPTCHA
const wordList = [
    "christmas",
    "notebook",
    "television",
    "pineapple",
    "computer",
    "Manchester",
    "examination",
    "strawberry",
];

function preload() {
    // Load audio files for each word
    audioFiles["christmas"] = loadSound("./assets/christmas.mp3");
    audioFiles["notebook"] = loadSound("./assets/notebook.mp3");
    audioFiles["television"] = loadSound("./assets/television.mp3");
    audioFiles["pineapple"] = loadSound("./assets/pineapple.mp3");
    audioFiles["computer"] = loadSound("./assets/computer.mp3");
    audioFiles["Manchester"] = loadSound("./assets/Manchester.mp3");
    audioFiles["examination"] = loadSound("./assets/examination.mp3");
    audioFiles["strawberry"] = loadSound("./assets/strawberry.mp3");
}

function setup() {
    createCanvas(400, 300);
    textAlign(CENTER, CENTER);
    textSize(16);

    // Create a button to play CAPTCHA audio
    playButton = createButton("Play CAPTCHA");
    playButton.position(width / 2 - 60, height / 2 + 60);
    playButton.mousePressed(playCaptcha);

    // Create a button to generate a new CAPTCHA word
    generateButton = createButton("Generate New Word");
    generateButton.position(width / 2 - 70, height / 2 + 150);
    generateButton.mousePressed(generateCaptchaWord);

    // Generate an initial word
    generateCaptchaWord(); 

    // Initialising Respective Constructors
    lowpassFilter = new p5.Filter();
    lowpassFilter.setType("lowpass");
    dynamicCompressor = new p5.Compressor();
    waveshaperDistortion = new p5.Distortion();
    reverbFilter = new p5.Reverb();
    delayEffect = new p5.Delay();
    
    ///// Effects with randomised parameters /////
    push()
    // Lowpass Filter Functionalities
    lowpassFilter.set(random(20, 20000))
    lowpassFilter.drywet(random(0, 0.5)); 
    lowpassFilter.res(random(0, 50)); 

    // Waveshaper Distortion Functionalities
    var os;
    var oversampleVal = [0, 2, 4];

    waveshaperDistortion.set(random(oversampleVal), os);

    if(oversampleVal == 0){
        os = "none";
    }
    else if( oversampleVal == 2){
        os = "2x";
    }
    else if(oversampleVal == 4){
        os = "4x"
    }
    waveshaperDistortion.drywet(random(0, 0.01));
    waveshaperDistortion.amp(random(0, 1));

    // Dynamic Compressor Functionalities
    dynamicCompressor.attack(random(0, 1));
    dynamicCompressor.knee(random(0, 40));
    dynamicCompressor.release(random(0, 1));
    dynamicCompressor.ratio(random(1, 20));
    dynamicCompressor.threshold(random(-100, 0));
    dynamicCompressor.drywet(random(0, 1));

    // Delay Effect Functionalities
    delayEffect.process(lowpassFilter, 0.5, 0.4, 2300);
    delayEffect.drywet(random(0, 0.2));

    // Reverb Functionalities
    reverbFilter.drywet(random(0, 1));
    durationReverb = random(0.1, 5);
    decayReverb = random(0, 2)
    reverbFilter.set(durationReverb, decayReverb);
    pop()

    // Initialise speech recognition
    recognition = new p5.SpeechRec("en-US", handleSpeech);
    recognition.continuous = false; // Single recognition event
    recognition.interimResults = false; // Final results only

    // Create a button to activate speech recognition
    var recogniseButton = createButton("Check with Voice");
    recogniseButton.position(width / 2 - 60, height / 2 + 190);
    recogniseButton.mousePressed(() => recognition.start());
}

function generateCaptchaWord() {
    // Randomly select a word from the word list
    generatedWord = random(wordList);
}

function playCaptcha() {
    // Play the corresponding audio file
    const soundFile = audioFiles[generatedWord];
    console.log(soundFile)

    if(soundFile.isPlaying()){}
    else {
        soundFile.disconnect();
        soundFile.connect(lowpassFilter);

        lowpassFilter.chain(waveshaperDistortion, delayEffect, dynamicCompressor, reverbFilter);

        soundFile.play()
        soundPlay = true;
    }
}

// Function to handle the checking of the user input and the CAPTCHA word
function handleSpeech() {
    const userInput = recognition.resultString.trim().toLowerCase();
    const expectedWord = generatedWord.toLowerCase();

    if (userInput === expectedWord) {
        alert("Correct! You matched the CAPTCHA word.");
    } else {
        alert(`Incorrect. You said "${userInput}", but the word was "${expectedWord}".`);
    }
}

function draw() {
    background(255, 196, 188);
    text("Listen to the CAPTCHA, and say the word you hear", width / 2, height / 4);
    text(`Generated CAPTCHA Word: ${generatedWord || "None"}`, width / 2, height / 1.8);
}

// self written code end

