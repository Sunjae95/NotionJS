import { createElement } from "../../utils/util.js";

export default function Loading({ $target }) {
  if (!new.target) {
    throw new Error("Loading new 연산자 누락");
  }

  const $loading = createElement("span", "loading");
  $target.appendChild($loading);

  this.state = false;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $loading.innerHTML = `${this.state ? "저장중..." : ""}`;
  };

  this.render();
}
