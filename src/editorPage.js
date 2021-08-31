export default function EditorPage({
  $target,
  ininialState,
  onSave,
  onSelecte,
}) {
  const defaultImage =
    "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80";

  const defaultContent = {
    text: "빈페이지",
    image: defaultImage,
    emoji: "",
  };

  const $editorPage = document.createElement("div");
  $editorPage.className = "editor-page";
  $target.appendChild($editorPage);

  this.state = ininialState;
  this.image = defaultImage;

  this.setState = (nextState) => {
    if (nextState === undefined) {
      this.state = null;
      this.render();
      return;
    }
    if (nextState.content !== null) {
      const state = { ...nextState, content: JSON.parse(nextState.content) };
      this.state = state;
    } else {
      const state = { ...nextState, content: defaultContent };
      this.state = state;
    }
    this.render();
  };
  this.setImage = (nextState) => {
    this.image = nextState || defaultImage;
    const backgroundImage = document.querySelector(".background");
    console.log(backgroundImage);
    backgroundImage.src = nextState;
  };
  this.setTitle = (nextState) => {
    this.state = { ...this.state, title: nextState } || null;
    const subTitle = document.querySelector(".sub-title");
    subTitle.textContent = nextState;
  };
  this.setEmoji = (nextState) => {
    this.emoji = nextState;
    const subEmoji = document.querySelector(".header-emoji");
    const emoji = document.querySelector(".select-emoji");
    emoji.textContent = this.emoji;
    subEmoji.textContent = this.emoji;
  };

  this.render = () => {
    if (!this.state) {
      $editorPage.innerHTML = `<div calss="editor-empty-page">왼쪽에서 문서를 선택해주세요.</div>`;
      return;
    }
    $editorPage.innerHTML = `
        <header>
        <div class="header-emoji">${this.state.content.emoji}</div>
        <div class="sub-title">${this.state.title}</div>
        </header>
        <img class="background" src ="${
          this.state.content.image || defaultImage
        }">
        <div  class = "emoji-container">
        <div class="select-emoji">${this.state.content.emoji || "+"}</div>
        <ul class  ="emoji-list hide">
        <li class = "fire emoji">🔥</li>
        <li class = "bike emoji">🛵</li>
        <li class = "rocket emoji">🚀</li>
        <li class = "book emoji">📖</li>
        <li class = "umbrella emoji">⛱</li>
        </ul>
        </div>
        <div contenteditable="true" class="editor-title" >${
          this.state.title
        }</div>
        <div contenteditable="true" class="editor-content" >${
          this.state.content.text
        }</div>
        <div class="child-documents-container"></div>
`;
    const childContainer = document.querySelector(".child-documents-container");

    childContainer.innerHTML = `
        
          ${this.state.documents
            .map((document) => {
              return `<span id="${document.id}" class ="child-document">${document.title}</span>`;
            })
            .join("")}
            `;
  };
  let saveTimer = null;

  this.render();
  const payLoadData = () => {
    const title = document.querySelector(".editor-title").innerHTML;
    const content = document.querySelector(".editor-content").innerHTML;
    return {
      title,
      content: { text: content, image: this.image, emoji: this.emoji },
      id: this.state.id,
    };
  };
  $editorPage.addEventListener("keyup", (e) => {
    if (!saveTimer !== null) clearTimeout(saveTimer);
    const isOnEditTitle = e.target.className === "editor-title";
    const title = document.querySelector(".editor-title").innerHTML;
    if (isOnEditTitle) this.setTitle(title);
    saveTimer = setTimeout(() => {
      onSave(payLoadData());
    }, 500);
  });
  const background = document.querySelector(".backgound");
  console.log(background);
  $editorPage.addEventListener("click", (e) => {
    if (e.target.classList[1] === "emoji") {
      e.target.parentNode.classList.toggle("hide");
      this.setEmoji(e.target.textContent);
      onSave(payLoadData());

      return;
    }
    if (e.target.className === "select-emoji") {
      e.target.nextSibling.nextSibling.classList.toggle("hide");
      return;
    }
    const id = e.target.id;
    const isChildDocument = e.target.className === "child-document";
    if (isChildDocument) onSelecte(id);
  });
}
