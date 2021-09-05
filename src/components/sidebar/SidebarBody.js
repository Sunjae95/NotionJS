import { $createElement } from '../../utils/templates.js';

import { drawNavList, markListItemOfId } from '../../utils/render.js';
import { getOpenedLiAfter } from '../../store/gettersLi.js';

export default function SidebarBody({ $target, initialState, onClick }) {
	const $navList = $createElement('div', '.nav-list');
	const $ul = $createElement('ul', '.root');
	const $createBtn = $createElement('div', '.create-btn');
	$createBtn.innerHTML = `<span data-target="page">+ 페이지 추가</span>`;

	this.state = initialState;
	this.setState = nextState => {
		this.state = nextState;
	};

	this.render = () => {
		const { documents, currentDocument } = this.state;

		const $selected = $('p.selected');
		const openedLi = getOpenedLiAfter('fetch');

		$ul.innerHTML = '';
		drawNavList($ul, documents, openedLi);

		if (!$selected) {
			markListItemOfId(currentDocument.id);
		}
	};

	this.init = () => {
		$navList.appendChild($ul);
		$target.appendChild($navList);
		$target.appendChild($createBtn);

		$createBtn.addEventListener('click', e => {
			onClick.createDocument(null, null);
		});

		$navList.addEventListener('mouseover', e => {
			const currentTarget = e.target.parentNode;

			const $needRemoveCollection = document.querySelectorAll('.show');
			const $deleteBtn = currentTarget.querySelector('.nav-delete-btn');
			const $createBtn = currentTarget.querySelector('.nav-create-btn');

			removeClassAll($needRemoveCollection, 'show');

			if (currentTarget.tagName !== 'LI') {
				addClass($deleteBtn, 'show');
				addClass($createBtn, 'show');
			}
		});

		$navList.addEventListener('mouseout', e => {
			const $needRemoveCollection = document.querySelectorAll('.show');
			removeClassAll($needRemoveCollection, 'show');
		});

		$ul.addEventListener('click', e => {
			const { toggleList, deleteDocument, createDocument, readDocument } =
				onClick;
			const { tagName, className, parentNode } = e.target;
			const $li = parentNode.parentNode;
			const { id } = $li.dataset;
			const { act } = e.target.dataset;

			if (tagName === 'LI' || className.includes('blank')) {
				return;
			}

			switch (act) {
				case 'toggle':
					const isOpened = className.includes('icon-down-dir');

					if (isOpened) {
						toggleList('hide', $li);
					} else {
						toggleList('show', $li);
					}
					break;
				case 'create':
					createDocument(id, $li);
					break;
				case 'delete':
					const isCurrent = Number(id) === this.state.currentDocument.id;
					deleteDocument(id, isCurrent);
					break;
				default:
					readDocument(id);
					break;
			}
		});
	};

	this.init();
}
