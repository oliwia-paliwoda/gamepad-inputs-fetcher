import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {

    const defaultButtonNames = [
        "3", "4", "1", "2",
        "L1", "R1", "L2", "R2",
        "Select", "Start",
        "L3", "R3",
        "u", "d", "b", "f"
    ];

    let buttonNames = [
        "3", "4", "1", "2",
        "L1", "R1", "L2", "R2",
        "Select", "Start",
        "L3", "R3",
        "u", "d", "b", "f"
    ];

    const [showLayoutTable, setShowLayoutTable] = React.useState(false);
    function handleShowLayoutTable(value) {
        setShowLayoutTable(value);
    }

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

    function SetCustomLayout(){
        const [activeIndex, setActiveIndex] = React.useState(0);

        React.useEffect(() => {
            const handleKeyDown = (e) => {
                if (e.key === "Enter") {
                    setActiveIndex((prev) =>
                        prev < defaultButtonNames.length - 1 ? prev + 1 : prev
                    );
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }, []);

        if (showLayoutTable===true){
           return ( <table>
               <thead>
               <tr>
                   <th>Input name</th>
                   <th>Current button</th>
               </tr>
               </thead>
               <tbody>
               {defaultButtonNames.map((item, index) => (

                   <tr key={index} style={{
                       backgroundColor:
                           index === activeIndex ? "rgba(100, 149, 237, 0.3)" : "transparent",
                   }}
                   >
                       <td>{item}</td>
                       <td>{buttonNames[index]}</td>
                   </tr>

               ))}
               </tbody>
           </table>
           );
       }
    }

    function trackInputs() {
        let previousButtons = [];

        function update() {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0];
            if (!gp) {
                requestAnimationFrame(update);
                return;
            }

            const newlyPressed = [];

            gp.buttons.forEach((button, i) => {
                const wasPressed = previousButtons[i] || false;
                const isPressed = button.pressed;

                if (!wasPressed && isPressed) {
                    newlyPressed.push(buttonNames[i] || `Button ${i}`);
                }

                previousButtons[i] = isPressed;
            });

            if (newlyPressed.length > 1) {
                setLatestInput(newlyPressed.join(" + "));

            }


            else if (newlyPressed.length === 1) {
                setLatestInput(newlyPressed[0]);

            }

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
            <button className="set-layout-button"  onClick={() => setShowLayoutTable(true)}
            >Set custom layout</button>
            <SetCustomLayout />
        </div>
    </div>
  );
}

export default App;
