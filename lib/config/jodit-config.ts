import { IJoditEditorProps } from "jodit-react";

export const baseJoditConfig: IJoditEditorProps["config"] = {
  defaultActionOnPaste: "insert_only_text",
  removeButtons: ["preview"],
  askBeforePasteHTML: false,
  height: 300,
  style: {
    fontFamily: "inherit",
    "h1, h2, h3, h4": {
      display: "block",
      fontWeight: "bold",
    },
    ul: {
      listStyleType: "disc",
      marginLeft: "1.5em",
      paddingLeft: "1em",
    },
    ol: {
      listStyleType: "decimal",
      marginLeft: "1.5em",
      paddingLeft: "1em",
    },
    li: {
      display: "list-item",
    },
  },
};
