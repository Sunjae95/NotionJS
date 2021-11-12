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
    onAdd: async (id) => {
      const data = { title: "제목을 입력해주세요", parent: id };
      const createdInfo =
        id === "new" ? await createDocument() : await createDocument(data);

      onCreatedDocument(createdInfo);

      const nextState = await getDocument();
      documentList.setState(nextState);
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
    console.log("sidebar");
    const rootDocument = await getDocument();

    // if (rootDocument.length === 0) return;

    // push(`posts/${rootDocument[0].id}`);

    documentList.setState(rootDocument);
  };

  this.render();
}
