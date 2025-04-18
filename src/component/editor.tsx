import * as Y from "yjs";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useRef, useState } from "react";
import { UseQuillEditor } from "../hooks/useQuill";
import toast, { Toaster } from "react-hot-toast";

const ydoc = new Y.Doc();
const ytype = ydoc.getText("Shared-edit");

Quill.register("modules/cursors", QuillCursors);

const provider = new WebsocketProvider(
  // "ws://localhost:3001",
  "wss://nedu-shared-edit-170d8cc65863.herokuapp.com",
  "Shared-edit",
  ydoc
);

/**
 * SharedEditor is a collaborative text editor component that enables real-time editing
 * between multiple users using Yjs and QuillJS.
 *
 * Features:
 * - Real-time collaborative editing
 * - User cursor tracking
 * - Connection status management
 * - User count display with toast notifications
 *
 * @component
 * @returns {JSX.Element} A collaborative text editor interface with connection controls
 */

export const SharedEditor = () => {
  const [numberOfUser, setNumberOfUser] = useState<string>("0");
  const [buttonText, setButtonText] = useState("connect");
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null); // Add this line
  const connectBtnRef = useRef<HTMLButtonElement>(null);
  UseQuillEditor(editorRef, ytype, provider);

  useEffect(() => {
    return () => provider.disconnect();
  }, []);
  useEffect(() => {
    // provider.connect();
    const updateConnectionStatus = () => {
      setIsConnected(provider.wsconnected);
    };
    provider.on("status", () => {
      updateConnectionStatus();
    });

    setButtonText(isConnected ? "disconnet" : "connect");

    provider.ws?.addEventListener("message", (event) => {
      if (typeof event.data === "string") {
        if (event.data !== numberOfUser) {
          toast(`${event.data} Connect`, {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
            position: "top-right",
          });
          setNumberOfUser(event.data);
        }
      }
    });
    return () => {
      provider.ws?.removeEventListener("message", () => console.log("removed"));

      // ydoc.destroy();
    };
  }, [isConnected, numberOfUser]);

  return (
    <div className="container">
      <div>
        <Toaster />
      </div>
      <h2 className="text-2xl font-bold text-white-800 mb-6 ">
        Real-time Collaborative Text Editor Demo
      </h2>
      <p className="text-lg text-white-600 mb-6">
        Built with Yjs (CRDT implementation), y-websocket, and QuillJS for
        seamless multi-user editing
      </p>
      <hr></hr>
      <div className="my-8">
        <h3 className="text-xl font-semibold text-white-700 mb-3 text-left">
          Features
        </h3>
        <ul className="space-y-2 list-none">
          <li className="flex items-center text-white-600">
            <span className="mr-2">•</span>
            Real-time collaborative editing
          </li>
          <li className="flex items-center text-white-600">
            <span className="mr-2">•</span>
            User cursor tracking
          </li>
          <li className="flex items-center text-white-600">
            <span className="mr-2">•</span>
            Connection status management
          </li>
        </ul>
      </div>
      <div className="container mx-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="my-4 text-lg  text-gray-200 flex items-center gap-2">
            <span className="inline-flex font-bold items-center justify-center px-2 py-1 text-green-500 rounded-full">
              {numberOfUser}
            </span>
            <span className="font-semibold">connected</span>
          </p>
          <div className="text-left my-4">
            <button
              ref={connectBtnRef}
              className="px-4 py-2 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{
                backgroundColor: isConnected ? "#ef4444" : "#22c55e",
              }}
              onClick={() => {
                if (isConnected) {
                  provider.disconnect();
                } else {
                  provider.connect();
                }
              }}
            >
              Click to {buttonText}
            </button>
          </div>
        </div>

        <div ref={editorRef} style={{ height: "300px" }}></div>
      </div>
    </div>
  );
};
