import App from './App.js';
import {request} from './api.js';

const $target = document.querySelector('#app')

new App({$target})

// console.log('initialState :>> ', initialState);



// const fetchDocumentList = async () => {
  // await request(`/documents/4021`, {
  //   method: 'PUT',
  //   body: JSON.stringify(
  //     {
  //       "title" : "소정의 루트에 내용 추가",
  //       "content" : '내용을 추가해보자'
  //     }
  //   )
  // })
  // const res = await request('/documents')
//   console.log('documentList :>> ', documentList);
// }

// fetchDocumentList()

