import Sidebar from "./component/SidebarPage/Sidebar.js";
import EditorPage from "./component/EditorPage/EditorPage.js";
import { getDocument } from "./utils/api.js";
import { initRouter } from "./utils/router.js";

export default function App({ $target }) {
  new Sidebar({
    $target,
    onCeatedDocument: async (createdInfo) => {
      const { id } = createdInfo;
      const nextState = await getDocument(id);

      editPage.setState(nextState);
    },
  });

  const editPage = new EditorPage({ $target });

  this.state = { id: "", title: "", content: "" };

  this.setState = async (id) => {
    const nextState = await getDocument(id);
    this.state = nextState;

    editPage.setState(this.state);
  };

  initRouter((id) => this.setState(id));
}
