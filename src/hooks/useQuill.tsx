import Quill from "quill";
import { useEffect } from "react";
import { Awareness } from "y-protocols/awareness.js";
import { QuillBinding } from "y-quill";
import { Text } from "yjs";

export const UseQuillEditor = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorRef: any,
  yText: Text,
  provider: { awareness: Awareness | undefined } | undefined
) => {
  let binding;
  useEffect(() => {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      // array for drop-downs, empty array = defaults
      [{ size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["image", "video"],
      ["clean"], // remove formatting button
    ];

    const editor = new Quill(editorRef!.current, {
      modules: {
        cursors: true,
        toolbar: toolbarOptions,
        history: {
          userOnly: true, // only user changes will be undone or redone.
        },
      },
      placeholder: "collab-edit-test",
      theme: "snow",
    });
    new QuillBinding(yText, editor, provider?.awareness);
  }, [editorRef, provider?.awareness, yText]);

  return {
    binding,
  };
};
