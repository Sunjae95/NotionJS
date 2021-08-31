export default function RootList({
  $target,
  initialState
}) {
  const $rootList = document.createElement('div')

  $target.appendChild($rootList)

  this.state = initialState

  this.render = () => {

    const createLi = (nextState) => {`<li>${nextState}</li>`}

    $rootList.innerHTML = `
      <ul>
        ${this.state.map(root => 
        `<li>
        ${root.title} <button>페이지 추가</button>
        </li>`
        ).join('')}  
        <br><br><br><br>
      <li>여기에는 루트 페이지들이 나타나야한다.</li>
      <button>새로운 root 추가</button>
      </ul>
    `
  }
  
  this.render()



}


