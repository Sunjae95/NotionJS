import { on, emit } from '../../utils/emitter.js';
import { $createElement } from '../../utils/templates.js';
import { checkDataForPlaceholder } from '../../utils/render.js';

import ModalHeader from './ModalHeader.js';
import ModalBody from './ModalBody.js';

export default function Modal({ $target }) {
	const $modal = $createElement('div', '.modal-container', '.hide');
	const $modalHeader = $createElement('div', '.modal-header');
	const $modalBody = $createElement('div', '.modal-body');

	this.state = {
		id: 'new',
		title: '',
		content: '',
	};

	this.setState = nextState => {
		this.state = nextState;
	};

	const showModal = () => {
		modalBody.render();
		$modal.classList.remove('hide');
	};
	const hideModal = () => {
		$modal.classList.add('hide');
	};

	new ModalHeader({
		$target: $modalHeader,
		onClick: {
			openPage: () => {
				const { id } = this.state;

				emit.readDocument({ id });
				hideModal();
			},
			closeModal: () => {
				hideModal();
			},
		},
	});

	const LIMIT_TIME = 200;
	let modalBodyUpdateTimer = null;

	const setUpdateEditTimer = (id, nextDocument) => {
		if (modalBodyUpdateTimer) {
			clearTimeout(modalBodyUpdateTimer);
		}
		modalBodyUpdateTimer = setTimeout(() => {
			emit.updateDocument({ id, nextDocument, onModal: true });
		}, LIMIT_TIME);
	};

	const modalBody = new ModalBody({
		$target: $modalBody,
		onUpdate: {
			updateTitle: nextDocument => {
				const { id } = this.state;
				const { title } = nextDocument;

				const currentLi = $(`li[data-id="${id}"] .nav-page-title`);
				currentLi.textContent = title ? title : '제목 없음';

				const $target = $('.show-modal-title');
				checkDataForPlaceholder({ $target });

				setUpdateEditTimer(id, nextDocument);
			},
			updateContent: nextDocument => {
				const { id } = this.state;
				setUpdateEditTimer(id, nextDocument);
			},
		},
	});

	this.init = () => {
		$target.appendChild($modal);
		$modal.appendChild($modalHeader);
		$modal.appendChild($modalBody);

		on.showModal(showModal);
		on.updateModal(nextState => this.setState(nextState));

		window.addEventListener('click', e => {
			const createBtn = e.target.dataset?.target === 'modal';
			const onModal = e.target.className.includes('modal');

			if (createBtn || onModal) {
				return;
			}

			const noData =
				!$('.show-modal-title')?.textContent &&
				!$('.show-modal-content')?.value;
			const isHide = $modal.classList.contains('hide');
			const isEmpty = !onModal && !isHide && noData;

			if (isEmpty) {
				emit.deleteEmptyDocument(this.state.id);
			}
			hideModal();
		});
	};

	this.init();
}
