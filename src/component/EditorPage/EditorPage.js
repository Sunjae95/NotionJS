import { getDocument, modifyDocument } from "../../utils/api.js";
import { getItem, removeItem, setItem } from "../../utils/storage.js";
import { createElement } from "../../utils/util.js";
import Editor from "./Editor.js";

export default function EditorPage({
  $target,
  initialState = { id: "", title: "", content: "" },
}) {
  const $page = createElement("div", "notion-editor");

  this.state = initialState;

  let timer = null;

  const editor = new Editor({
    $target: $page,
    initialState: { title: this.state.title, content: this.state.content },
    onEditing: async (post) => {
      setItem(this.state.id, post);

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        const data = getItem(this.state.id, post);

        await modifyDocument(this.state.id, data);
        removeItem(this.state.id);
      }, 2000);
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;

    editor.setState(nextState);
    this.render();
  };

  this.render = async () => {
    $target.appendChild($page);
  };

  this.render();
}
