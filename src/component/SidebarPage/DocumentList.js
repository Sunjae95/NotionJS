import { createElement } from "../../utils/util.js";

const createDocument = (data) => {
  const { id, title, documents } = data;

  return `
    <ul class="list-off" data-id=${id}>
      <div class="document">
      <button class="toggle-btn">▸</button>
        <span data-id=${id}>${title}</span>
        <button class="add-btn">+</button>
        <button class="delete-btn">-</button>
      </div>
      <li>${
        documents.length === 0
          ? `<ul data-id="${id}"><button class="add-btn">+</button> Add a Page</ul>`
          : documents.map((document) => createDocument(document)).join("")
      }</li>
    </ul>`;
};

export default function DocumentList({ $target, onAdd, onDelete, onChange }) {
  const $listContainer = createElement("div", "document-container");
  $target.appendChild($listContainer);

  $listContainer.addEventListener("click", (e) => {
    if (e.target.className === "document-container") return;

    const $document = e.target.closest("ul");
    const $addButton = $document.querySelector(".add-btn");
    const $deleteButton = $document.querySelector(".delete-btn");
    const $toggleButton = $document.querySelector(".toggle-btn");
    const { id } = $document.dataset;

    switch (e.target) {
      case $addButton: {
        onAdd(id);
        break;
      }
      case $deleteButton: {
        onDelete(id);
        break;
      }
      case $toggleButton: {
        if ($document.className === "list-off") {
          $document.className = "list-on";
          $toggleButton.innerHTML = "▾";
        } else {
          $document.className = "list-off";
          $toggleButton.innerHTML = "▸";
        }
        break;
      }
      default: {
        onChange(id);
      }
    }
  });

  this.state = null;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $listContainer.innerHTML = `${
      this.state
        ? this.state.map((document) => createDocument(document)).join("")
        : ""
    }<ul data-id="new"><button class="add-btn">+</button> Add a Page</ul>`;
  };

  this.render();
}
