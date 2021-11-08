import { createElement } from "../../utils/util.js";

export default function Header({ $target, title }) {
  if (!new.target) {
    throw new Error("Header new 연산자 누락!");
  }

  const $header = createElement("div", "sidebar-header");

  $target.appendChild($header);

  this.render = () => {
    $header.innerHTML = `${title}`;
  };

  this.render();
}
