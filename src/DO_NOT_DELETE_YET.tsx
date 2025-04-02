import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import * as Y from "yjs";
import { proxy, useSnapshot } from "valtio";
import { bind } from "valtio-yjs";
import { WebrtcProvider } from "y-webrtc";
import { nanoid } from "nanoid";
import toast, { Toaster } from "react-hot-toast";

const ydoc = new Y.Doc();
const ymap = ydoc.getMap("map");

const provider = new WebrtcProvider("New28", ydoc);

const store = proxy<any>({});

bind(store, ymap);

const relPos = Y.createRelativePositionFromTypeIndex(ymap, 2);
// const pos = Y.createAbsolutePositionFromRelativePosition(relPos, ydoc);

const encodedRelPos = JSON.stringify(relPos);
// send encodedRelPos to remote client..
const parsedRelPos = JSON.parse(encodedRelPos);
const pos = Y.createAbsolutePositionFromRelativePosition(parsedRelPos, ydoc);
// pos.type === remoteytext // => true
// pos.index === 2 // => true
console.log("pos ", pos);
console.log("rel ", pos?.type === ymap); // => true
console.log("rel ", pos?.index === 2);
// => true

function App() {
  const [value, setValue] = useState("");
  const [numberOfUser, setNumberOfUser] = useState<string[]>([]);
  // const [tasks, setTasks] = useState([]);

  const snap = useSnapshot(store);
  useEffect(() => {
    console.log(snap);

    console.log(tasks);
  }, [snap]);

  provider.on("peers", (e) => {
    console.log(e);
    setNumberOfUser(e.bcPeers);
    toast(`${e.added} joined`);
  });
  const tasks = useMemo(() => Object.values(snap), [snap]);
  return (
    <>
      <div>
        <Toaster />
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{numberOfUser.length} Users connected</h1>
      <div className="card">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            const id = nanoid();
            store[id] = value;
            setValue("");
            // setTasks(Object.values(snap));
          }}
        >
          Submit
        </button>
        <ul>
          {tasks.map((i, key) => (
            <li key={key}>{i as string}</li>
          ))}
        </ul>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
