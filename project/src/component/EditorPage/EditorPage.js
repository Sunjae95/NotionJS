import { modifyDocument } from "../../utils/api.js";
import { getItem, removeItem, setItem } from "../../utils/storage.js";
import { createElement } from "../../utils/util.js";
import Editor from "./Editor.js";
import Loading from "./Loading.js";

export default function EditorPage({ $target }) {
  const $page = createElement("div", "notion-editor");

  this.state = { id: "", title: "", content: "" };

  let timer = null;
  const loading = new Loading({ $target: $page });
  const editor = new Editor({
    $target: $page,
    initialState: { title: this.state.title, content: this.state.content },
    onEditing: (post) => {
      loading.setState(true);
      setItem(this.state.id, post);

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        const data = getItem(this.state.id, post);

        await modifyDocument(this.state.id, data);
        loading.setState(false);
        removeItem(this.state.id);
      }, 2000);
    },
    handleChangeTitle: (title) => {
      const { pathname } = window.location;
      const [, , postId] = pathname.split("/");
      const $title = document.querySelector(`span[data-id="${postId}"]`);

      $title.innerHTML = title;
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
