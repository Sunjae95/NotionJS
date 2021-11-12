import Sidebar from "./component/SidebarPage/Sidebar.js";
import EditorPage from "./component/EditorPage/EditorPage.js";
import { getDocument } from "./utils/api.js";
import { initRouter, push } from "./utils/router.js";

export default function App({ $target }) {
  new Sidebar({
    $target,
    onCreatedDocument: async (createdInfo) => {
      const { id } = createdInfo;

      try {
        const nextState = await getDocument(id);
        const { pathname } = window.location;
        const isInitUrl = pathname === "/" ? `posts/${id}` : id;

        push(isInitUrl);
        editPage.setState(nextState);
      } catch (e) {
        console.log(e);
      }
    },
  });

  const editPage = new EditorPage({ $target });

  this.state = { id: "", title: "", content: "" };

  this.setState = async (id) => {
    try {
      const nextState = await getDocument(id);
      this.state = nextState;

      editPage.setState(this.state);
    } catch (e) {
      console.log(e);
    }
  };

  this.route = async () => {
    const { pathname } = window.location;

    try {
      if (pathname === "/") {
        const nextState = await getDocument();

        if (nextState.length === 0) return;

        push(`posts/${nextState[0].id}`);
        editPage.setState(nextState);
        console.log(e);
      } else if (pathname.indexOf("/posts/") === 0) {
        const [, , postId] = pathname.split("/");
        const nextState = await getDocument(postId);

        editPage.setState(nextState);
      }
    } catch (e) {}
  };

  initRouter(() => this.route());

  let isInit = null;

  if (!isInit) {
    this.route();
    isInit = true;
  }
}
