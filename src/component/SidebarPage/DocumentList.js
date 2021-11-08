import { push } from "../../utils/router.js";
import { createElement } from "../../utils/util.js";

const createDocument = (data) => {
  const { id, title, documents } = data;

  return /*html*/ `
    <ul data-id=${id}>
      <div data-id=${id}>${title}<button class="add-btn">+</button></div>
      <li>${
        documents.length === 0
          ? ""
          : documents.map((document) => createDocument(document)).join("")
      }</li>
    </ul>`;
};

export default function DocumentList({ $target, onAdd }) {
  const $listContainer = createElement("div", "document-container");
  $target.appendChild($listContainer);

  $listContainer.addEventListener("click", (e) => {
    if (e.target.className === "document-container") return;

    const $document = e.target.closest("ul");
    const $addButton = $document.querySelector(".add-btn");

    if (e.target === $addButton) {
      const { id } = $document.dataset;

      onAdd(id);
    } else {
      const { id } = $document.dataset;

      push(id);
    }
  });

  this.state = null;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  //조건부 렌더링 this.state가 없으면 아무것도 렌더하지 않음
  this.render = () => {
    $listContainer.innerHTML = `${
      this.state
        ? this.state.map((document) => createDocument(document)).join("")
        : ""
    }<ul data-id="new"><button class="add-btn">+</button> Add a Page</ul>`;
  };

  this.render();
}
