import Editor from './Editor.js';

import { request } from '../services/api.js';
import {
  getItem,
  removeItem,
  setItem,
} from '../services/storage.js';

export default function EditorPage({ $target, initialState }) {
  const $page = document.createElement('div');
  $page.setAttribute('class', 'editorpage-container');

  this.state = initialState;

  const docTempSaveKey = (id) => `temp-doc-${id}`;

  let timer = null;

  const editor = new Editor({
    $target: $page,
    initialState: {
      id: null,
      title: '',
      content: '',
    },
    onEditing: (doc) => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        setItem(docTempSaveKey(doc.id), {
          ...doc,
          tempSaveDate: new Date(),
        });

        await request(`/documents/${doc.id}`, {
          method: 'PUT',
          body: JSON.stringify(doc),
        });

        removeItem(docTempSaveKey(doc.id));
      }, 1000);
    },
  });

  const fetchDoc = async () => {
    const { id } = this.state;

    const doc = await request(`/documents/${id}`);

    const tempSavedDoc = getItem(docTempSaveKey(id) || {});

    if (tempSavedDoc && tempSavedDoc.tempSaveDate > doc.updatedAt) {
      if (confirm('저장되지 않은 임시 데이터가 있습니다. 불러올까요?')) {
        this.setState({
          ...this.state,
          ...tempSavedDoc,
        });
        return;
      }
    }

    this.setState({
      ...this.state,
      ...doc,
    });
  };

  this.setState = async (nextState) => {
    if (this.state.id !== nextState.id) {
      this.state = nextState;
      await fetchDoc();
      return;
    }

    this.state = nextState;

    editor.setState({
      ...editor.state,
      ...this.state,
    });
    this.render();
  };

  this.render = () => {
    $target.appendChild($page);
  };
}
