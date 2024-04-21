import Game from "./Wolfie2D/Loop/Game";
import SplashScreen from "./sos_project/Scenes/SplashScreen";
import { PlayerInput } from "./sos_project/AI/Player/PlayerController";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1024, y: 1024},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            {name: PlayerInput.MOVE_FORWARD, keys: ["w"]},
            {name: PlayerInput.MOVE_BACKWARD, keys: ["s"]},
            {name: PlayerInput.TURN_LEFT, keys: ["a"]},
            {name: PlayerInput.TURN_RIGHT, keys: ["d"]},
            {name: PlayerInput.FIRE_STARBOARD, keys: ["e"]},
            {name: PlayerInput.FIRE_PORT, keys: ["q"]},
            {name: PlayerInput.PLACE_MINE, keys: ["m"]},
            {name: PlayerInput.PASS_LEVEL, keys: ["p"]},
            {name: PlayerInput.REPAIR, keys:["r"]},
            {name: PlayerInput.INVINCIBLE, keys:["i"]},
            {name: "slot1", keys: ["1"]},
            {name: "slot2", keys: ["2"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                      // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});

})();

function runTests(){};