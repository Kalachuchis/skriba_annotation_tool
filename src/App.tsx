import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { homeDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import "./App.css";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [fileList, setFileList] = useState([]);
    const [inputDir, setinputDir] = useState<string>("./");

    async function openFileApp() {
        try {
            const filePath = await open({
                directory: true,
                multiple: true,
                defaultPath: await homeDir(),
            });
            if (filePath) setinputDir(filePath[0]);
        } catch (e) {
            console.error(e);
        }
    }
    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        try {
            setFileList(await invoke("get_files", { location: inputDir }));
            setGreetMsg(await invoke("greet", { name }));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="container">
            <h1>Welcome to Tauri!</h1>

            <div className="row">
                <a href="https://vitejs.dev" target="_blank">
                    <img
                        src="/vite.svg"
                        className="logo vite"
                        alt="Vite logo"
                    />
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img
                        src="/tauri.svg"
                        className="logo tauri"
                        alt="Tauri logo"
                    />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>

            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter a name..."
                />
                <button type="submit">Greet</button>
            </form>
            <button onClick={openFileApp}>image location</button>
            {fileList.map((file) => {
                return <p>{file}</p>;
            })}
            <p>{greetMsg}</p>
        </div>
    );
}

export default App;
