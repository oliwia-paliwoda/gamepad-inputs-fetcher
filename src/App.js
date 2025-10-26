import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {

    const buttonIndices = { 0: "A", 1: "B", 2: "X", 3: "Y", 4: "LB", 5: "RB", 6: "LT", 7: "RT", 8: "View", 9: "Menu", 10: "LS", 11: "RS", 12: "DUp", 13: "DDown", 14: "DLeft", 15: "DRight", 16: "Xbox" };

    const [gamepadState, setGamepadState] = React.useState("No gamepad found");
    function handleGamepadConnected(value) {
        setGamepadState(value);
    }

    const [latestInput, setLatestInput] = React.useState("");
    function handleLatestInput(value) {
        setLatestInput(value);
    }

    const mapGamepadToGamepadState = (gamepad, deadzone) => {
        const { axes, buttons } = gamepad;

        return {
            buttons: {
                A: buttons[0].pressed,
                B: buttons[1].pressed,
                X: buttons[2].pressed,
                Y: buttons[3].pressed,
                LB: buttons[4].pressed,
                RB: buttons[5].pressed,
                LT: buttons[6].pressed,
                RT: buttons[7].pressed,
                View: buttons[8].pressed,
                Menu: buttons[9].pressed,
                LS: buttons[10].pressed,
                RS: buttons[11].pressed,
                DUp: buttons[12].pressed,
                DDown: buttons[13].pressed,
                DLeft: buttons[14].pressed,
                DRight: buttons[15].pressed,
                Xbox: buttons[16].pressed,

                LUp: axes[1] < -deadzone,
                LDown: axes[1] > deadzone,
                LLeft: axes[0] < -deadzone,
                LRight: axes[0] > deadzone,
                RUp: axes[3] < -deadzone,
                RDown: axes[3] > deadzone,
                RLeft: axes[2] < -deadzone,
                RRight: axes[2] > deadzone,
            },
            axes: {
                L: {
                    x: axes[0],
                    y: axes[1],
                },
                R: {
                    x: axes[2],
                    y: axes[3],
                },
            },
        };
    };


    window.addEventListener("gamepadconnected", (e) => {
        console.error(
            "Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index,
            e.gamepad.id,
            e.gamepad.buttons.length,
            e.gamepad.axes.length,
        );

        setGamepadState("Gamepad found: " + e.gamepad.id);
        trackInputs();
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        console.error(
            "Gamepad disconnected from index %d: %s",
            e.gamepad.index,
            e.gamepad.id,
        );

        setGamepadState("No gamepad found");

    });

    function trackInputs(){
        let previousButtons = [];

        function update(){
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[0];
            if (!gamepad) return;

            gamepad.buttons.forEach((button, i) => {
                const lastPressed = previousButtons[i] || false;
                const nowPressed = button.pressed;

                if (!lastPressed && nowPressed) {
                    setLatestInput(buttonIndices[i]);
                }

                previousButtons[i] = nowPressed;
            });

            requestAnimationFrame(update);

        }

        requestAnimationFrame(update);

    }

  return (
    <div className="App">
        <div className="App-header">
            Gamepad inputs fetcher
        </div>
        <div className="App-body">
            {gamepadState}
            <div className="test">{"Pressed button: "+latestInput}</div>
        </div>
    </div>
  );
}

export default App;
