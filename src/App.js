import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {

    const [gamepadState, setGamepadState] = React.useState("No gamepad found");
    function handleGamepadConnected(value) {
        setGamepadState(value);
    }

    window.addEventListener("gamepadconnected", (e) => {
        console.error(
            "Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index,
            e.gamepad.id,
            e.gamepad.buttons.length,
            e.gamepad.axes.length,
        );

        setGamepadState("Gamepad found: " + e.gamepad.id);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        console.error(
            "Gamepad disconnected from index %d: %s",
            e.gamepad.index,
            e.gamepad.id,
        );

        setGamepadState("No gamepad found");

    });

  return (
    <div className="App">
        <div className="App-header">
            Gamepad inputs fetcher
        </div>
        <div className="App-body">
            {gamepadState}
        </div>
    </div>
  );
}

export default App;
