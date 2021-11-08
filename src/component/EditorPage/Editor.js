import { createElement } from "../../utils/util.js";

export default function Editor({ $target, initialState, onEditing }) {
  if (!new.target) {
    throw new Error("Frame new 연산자 누락!");
  }

  const $editor = createElement("div", "editor-container");

  $editor.innerHTML = /*html*/ `
    <input type="text" name="title"/>
    <div class="horisontal-line"></div>
    <textarea name="content"/>
    `;

  $target.appendChild($editor);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $editor.querySelector("[name=title]").value = this.state.title;
    $editor.querySelector("[name=content]").value = this.state.content;
  };

  this.render();

  $editor.querySelector("[name=title]").addEventListener("keyup", (e) => {
    const nextState = { ...this.state, title: e.target.value };

    onEditing(nextState);
    this.setState(nextState);
  });
  $editor.querySelector("[name=content]").addEventListener("keyup", (e) => {
    const nextState = { ...this.state, content: e.target.value };

    onEditing(nextState);
    this.setState(nextState);
  });
}
