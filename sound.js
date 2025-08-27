//<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.52/Tone.js"></script>

// Create a simple synth for the "eat food" sound
const eatSynth = new Tone.Synth().toDestination();

// Create a noise synth for the "game over" sound
const gameOverNoise = new Tone.NoiseSynth({
    volume: -10,
    envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1
    },
    filterEnvelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.1,
        release: 0.1,
        baseFrequency: 200,
        octaves: 4
    }
}).toDestination();

// Function to play the "eat food" sound
function playEatSound() {
    eatSynth.triggerAttackRelease("C4", "8n");
}

// Function to play the "game over" sound
function playGameOverSound() {
    gameOverNoise.triggerAttackRelease("1n");
}

// Export the functions to be used in script.js
// This makes the functions globally accessible
window.playEatSound = playEatSound;
window.playGameOverSound = playGameOverSound;
