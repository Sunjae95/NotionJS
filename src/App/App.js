import PostsEditPage from "./page/EditPage/PostEditPage.js";
import PostsPage from "./page/PostPage/PostsPage.js";
import {
  getRootDocument,
  getContentDocument,
  deleteDocument,
  putDocument,
  postDocument,
} from "../api/request.js";
import { setItem } from "./page/storage.js";

export default function App({ $target, initialState = [] }) {
  this.state = initialState;
  this.setState = ({ $target, nextState, type }) => {
    this.state = nextState;
    if (type === "li-click") {
      postsPage.setState({ $target, nextState: this.state.documents, type });
      postsEditPage.setState({ $target, nextState });
    } else if (type === "erase-btn-click") {
      $target = document.querySelector("#app");
      postsPage.setState({ $target, nextState: this.state, type });
    } else if (type === "edit-btn-click") {
      const $target = document.getElementById(`${nextState.id}`);
      console.log(this.state);
      postsPage.setState({ $target, nextState: this.state, type });
    } else if (type === "add-btn-click") {
      postsPage.setState({ $target, nextState: this.state.documents, type });
      postsEditPage.setState({
        $target: $target.lastElementChild.lastElementChild,
        nextState: this.state.documents[this.state.documents.length - 1],
      });
    } else if (type === "root-add-btn-click") {
      postsPage.setState({ $target, nextState: this.state, type });
    }

    this.render();
  };

  let addDocCount = 0;

  const postsPage = new PostsPage({
    $target,
    initialState,
    onClick: async ($target) => {
      const rootId = $target.id;
      const result = await getContentDocument(rootId);
      this.setState({ $target, nextState: result, type: "li-click" });
    },
    onEraseBtnClick: async ($target) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        await deleteDocument($target.id);
        const initialState = await getRootDocument();
        this.setState({
          $target,
          nextState: initialState,
          type: "erase-btn-click",
        });
      }
    },
    onAddBtnClick: async ($target) => {
      await postDocument(`새로운 문서 ${++addDocCount}`, $target.id);
      const result = await getContentDocument($target.id);
      this.setState({ $target, nextState: result, type: "add-btn-click" });
    },
    onRootAddBtnClick: async ($target) => {
      const result = await postDocument(
        `새로운 루트 문서 ${++addDocCount}`,
        ""
      );
      this.setState({
        $target: $target.nextElementSibling,
        nextState: result,
        type: "root-add-btn-click",
      });
    },
  });

  let timer = null;

  const postsEditPage = new PostsEditPage({
    $target,
    initialState,
    onEditing: ({ $target, nextState }) => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      this.setState({ $target, nextState, type: "edit-btn-click" });
      timer = setTimeout(async () => {
        const { title, id, content } = nextState;
        await putDocument(title, id, content);
        setItem(`temp-post-${this.state.id}`, {
          ...nextState,
          tempSaveDate: new Date(),
        });
        this.state = nextState;
      }, 1000);
    },
  });

  this.render = () => {};
  this.render();
}