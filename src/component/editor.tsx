import * as Y from "yjs";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { WebsocketProvider } from "y-websocket";
import { useRef, useState } from "react";
import { UseQuillEditor } from "../hooks/useQuill";

const ydoc = new Y.Doc();
const ytype = ydoc.getText("Shared-edit");

Quill.register("modules/cursors", QuillCursors);

const provider = new WebsocketProvider("ws://localhost:1234", "New41", ydoc);

export const SharedEditor = () => {
  const [numberOfUser] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState("connect");
  const editorRef = useRef<HTMLDivElement>(null); // Add this line
  const connectBtnRef = useRef<HTMLButtonElement>(null);
  UseQuillEditor(editorRef, ytype, provider);

  provider.on("status", (e) => {
    console.log(e);
    console.log(e.status);
  });

  return (
    <div className="container">
      <div className="col">
        <button
          ref={connectBtnRef}
          onClick={() => {
            if (provider.shouldConnect) {
              provider.disconnect();
              setButtonText("Connect");
            } else {
              provider.connect();
              setButtonText("Disconnect");
            }
          }}
        >
          {buttonText}
        </button>
        <h1 className="mx-4">{numberOfUser.length} Users connected</h1>
        <div ref={editorRef} style={{ height: "500px" }}></div>
      </div>
    </div>
  );
};
