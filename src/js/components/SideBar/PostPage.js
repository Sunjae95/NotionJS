import { request } from '../api.js'
import { $creEle } from '../../utils/document.js'
import LinkButton from '../../utils/LinkButton.js'
import PostList from './PostList.js'

// 사이드바를  담당하는 페이지
export default function PostPage({ $target }) {
  const $page = $creEle('div')
  $page.className = 'documentList'

  // 실제로는 Api에서 데이터 불러서 보여주는게 맞을듯
  const $userInfo = $creEle('div')
  $userInfo.innerHTML = `
    <h2>김동현님의 Notion</h2>
    <h3>ehehdgus1@hanyang.ac.kr</h3>
  `
  $page.appendChild($userInfo)

  const postList = new PostList({
    $target: $page,
    initialState: [],
    onAttach: async (id) => {
      await request('/documents', {
        method: 'POST',
        body: JSON.stringify({
          title: 'untitled',
          parent: id,
        }),
      })

      this.setState()
    },
    onDelete: async (id) => {
      await request(`/documents/${id}`, {
        method: 'DELETE',
      })

      this.setState()
    },
  })

  new LinkButton({
    $target: $page,
    initialState: {
      text: '+ New Page',
      link: 'new',
      name: 'addNew',
    },
  })

  this.setState = async () => {
    const posts = await request('/documents')
    postList.setState(posts)
    this.render()
  }

  this.render = async () => {
    $target.appendChild($page)
  }
}
