'use strict';

import Username from './Username.js';
import { API } from '../utils/api.js';

export default function Navbar({
  $target,
  initialState,
  onClickDocument,
  onUpdateEditor,
}) {
  this.state = initialState;
  const $navbar = document.createElement('nav');
  $navbar.className = 'navbar';

  $target.append($navbar);
  $navbar.addEventListener('click', async ({ target }) => {
    if (target.matches('.navbar__list__document')) {
      const { id } = target.dataset;
      onClickDocument(Number(id));
    }

    if (target.matches('.add-root-document-button')) {
      const { id } = await addDocument();
      this.setState();
      onClickDocument(Number(id));
      return;
    }

    if (target.matches('.add-document-button')) {
      const $li = target.closest('li');
      const { id: parentId } = $li.dataset;
      const { id } = await addDocument(Number(parentId));
      this.setState();
      onClickDocument(Number(id));
      return;
    }

    if (target.matches('.delete-document-button')) {
      const $li = target.closest('li');
      const { id } = $li.dataset;
      await deleteDocument(Number(id));
      this.setState();
      onUpdateEditor();
      return;
    }
  });

  const renderDocumentList = function recur(document) {
    return /* html */ `
      <ul class="navbar__list">
        <li data-id="${document.id}" class="navbar__list__document">
          ${document.title} <button class="add-document-button">추가</button
          ><button class="delete-document-button">삭제</button>
        </li>
        ${document.documents.map(document => recur(document)).join('')}
      </ul>
    `;
  };

  const addDocument = async (id = null) => {
    const title = prompt('새로 추가할 문서의 제목을 작성해주세요.').trim();

    if (title === null) return;

    const document = {
      parent: id,
      title: title !== '' ? title : '제목없음',
    };

    return await API.addDocument(document);
  };

  const deleteDocument = async id => {
    await API.deleteDocument(id);
  };

  this.setState = async () => {
    this.state = await API.getRootDocuments();
    this.render();
  };

  this.render = async () => {
    $navbar.innerHTML = /* html */ `
      <div class="navbar__user">
        <h3 id="user-title">유저이름</h3>
      </div>
      <div class="navbar__btn-add">
          <button class="add-root-document-button">Add</button>
      </div>
      ${this.state.map(document => renderDocumentList(document)).join('')}
    `;
  };
}