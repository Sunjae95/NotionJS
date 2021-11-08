import { createDocument, getDocument } from "../../utils/api.js";
import Header from "./Header.js";
import DocumentList from "./DocumentList.js";
import { createElement } from "../../utils/util.js";
import { push } from "../../utils/router.js";

export default function Sidebar({ $target, onCeatedDocument }) {
  if (!new.target) {
    throw new Error("Sidebar new 연산자 누락!");
  }

  const $sidebar = createElement("div", "notion-sidebar");

  $target.appendChild($sidebar);

  new Header({ $target: $sidebar, title: "Notion Clone" });

  const documentList = new DocumentList({
    $target: $sidebar,
    initialState: null,
    onAdd: async (id) => {
      const data = { title: "제목을 입력해주세요", parent: id };
      const createdInfo =
        id === "new" ? await createDocument() : await createDocument(data);

      onCeatedDocument(createdInfo);

      const nextState = await getDocument();
      documentList.setState(nextState);
    },
  });

  this.render = async () => {
    const rootDocument = await getDocument();

    if (rootDocument.length === 0) return;

    push(rootDocument[0].id);

    documentList.setState(rootDocument);
  };

  this.render();
}

// 실수로 열기버튼까지 구현함
// export default function getDocument(doc) {
//   const { id, title, documents } = doc;

//   return /*html*/ `
//   <ul id = 'document-${id}'>
//     <div><button class="openClose-btn">열기</button>${title}<button class="add-btn">추가</button></div>
//     <li style="display: none">${
//       documents.length === 0
//         ? "Add a Page"
//         : documents.map((document) => getDocument(document)).join("")
//     }</li>
//   </ul>`;
// }

// 실수로 열기버튼까지 구현함
// $sidebar.addEventListener("click", (e) => {
//   //e.target 배경클릭시 에러 해결하기
//   const $document = e.target.closest("ul");
//   const openCloseButton = $document.querySelector(".openClose-btn");
//   const addButton = $document.querySelector(".add-btn");

//   switch (e.target) {
//     case openCloseButton: {
//       const list = $document.querySelector("li");
//       list.style.display = list.style.display === "block" ? "none" : "block";
//       break;
//     }
//     case addButton: {
//       const nextState = [
//         {
//           id: 1,
//           title: "hi",
//           documents: [{ id: 1, title: "bye", documents: [] }],
//         },
//         {
//           id: 1,
//           title: "hello",
//           documents: [{ id: 1, title: "meto", documents: [] }],
//         },
//       ];
//       this.setState(nextState);
//       this.render();
//     }
//   }
// });
