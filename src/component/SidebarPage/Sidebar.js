import {
  createDocument,
  deleteDocument,
  getDocument,
} from "../../utils/api.js";
import Header from "./Header.js";
import DocumentList from "./DocumentList.js";
import { createElement } from "../../utils/util.js";
import { push } from "../../utils/router.js";

export default function Sidebar({ $target, onCreatedDocument }) {
  if (!new.target) {
    throw new Error("Sidebar new 연산자 누락!");
  }

  const $sidebar = createElement("div", "notion-sidebar");
  $target.appendChild($sidebar);

  new Header({ $target: $sidebar, title: "Notion Clone" });
  const documentList = new DocumentList({
    $target: $sidebar,
    onChange: async (id) => {
      const { pathname } = window.location;

      if (pathname.indexOf("/posts/") === 0) {
        push(`${id}`);
      } else {
        push(`posts/${id}`);
      }
    },
    onAdd: async (id) => {
      const data = { title: "제목을 입력해주세요", parent: id };

      try {
        const isNew = id === "new" ? null : data;
        const createdInfo = await createDocument(isNew);
        onCreatedDocument(createdInfo);

        const nextState = await getDocument();
        documentList.setState(nextState);
      } catch (e) {
        console.log(e);
      }
    },
    onDelete: async (id) => {
      try {
        await deleteDocument(id);

        const nextState = await getDocument();
        documentList.setState(nextState);
      } catch (e) {
        console.log(e);
      }
    },
  });

  this.render = async () => {
    try {
      const rootDocument = await getDocument();
      documentList.setState(rootDocument);
    } catch (e) {
      console.log(e);
    }
  };

  this.render();
}
