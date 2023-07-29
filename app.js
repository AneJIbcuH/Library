const listBook = document.querySelector('.listBook')
const favBookArea = document.querySelector('.favBookArea')

const page2 = document.querySelector('.page2')
const dropArea = document.querySelector('.dropArea')

const fileInput = document.querySelector('.inputBookFile') // get input element
const myButton = document.querySelector('.myButton') // get button element

let books = []

function addBook(element) {
  const inputBookName = document.querySelector('.inputBookName')
  const inputBookText = document.querySelector('.inputBookText')
  
  let book = {
  id: Date.now(),
  name: inputBookName.value,
  text: inputBookText.value
  }
  
  let myBook = document.createElement('div')
  myBook.innerHTML = `<div class='rowListBook' draggable='true' id='${book.id}'><div class='listBookName'>${book.name}</div><div class='listBookBtn'><button onclick='changeBook(this)'>РЕД.</button><button onclick='readDone(this)'>Прочитано</button><button onclick='readBook(this)'>ЧИТАТЬ</button><button onclick='removeBook(this)'>Х</button></div></div>`
  listBook.prepend(myBook)

  books.push(book)

  inputBookName.value = ''
  inputBookText.value = ''
  
  //////////////////Drag n Drop/////////////////////////////////////
    let rowListBooks = document.querySelectorAll('.rowListBook')
    for (let item of rowListBooks) {
        item.addEventListener('dragstart', dragstart)
        item.addEventListener('dragend', dragend)
    }
  
    // myBook.addEventListener('dragstart', dragstart)
    // myBook.addEventListener('dragend', dragend)


    dropArea.addEventListener('dragover', dragover)
    dropArea.addEventListener('dragenter', dragenter)
    dropArea.addEventListener('dragleave', dragleave)
    dropArea.addEventListener('drop', dragdrop)

    function dragstart(event) {
    // event.target.classList.add('hold')
    // setTimeout(() => event.target.classList.add
    // ('hide'), 0)    
    }

    function dragend(event) {
    // event.target.classList.remove('hold', 'hide')
    // event.target.className = 'item'
    }

    function dragover(event) {
    event.preventDefault()
    }

    function dragenter(event) {
    // event.target.classList.add('hovered')
    }

    function dragleave(event) {
    // event.target.classList.remove('hovered')
    }

    function dragdrop(event) {
    // event.target.classList.remove('hovered')
    // event.target.append(myBook)
    favBookArea.prepend(myBook)
    myBook.removeEventListener('dragstart', dragstart)
    myBook.removeEventListener('dragend', dragend)
    dropArea.removeEventListener('dragover', dragover)
    dropArea.removeEventListener('dragenter', dragenter)
    dropArea.removeEventListener('dragleave', dragleave)
    dropArea.removeEventListener('drop', dragdrop)
    }

/////////////////////////////////////
}

function removeBook(element) {
    element.parentNode.parentNode.remove()
    books = books.filter(el => el.id != element.parentNode.parentNode.id)
}

function readBook(element) {
    // if (page2.children) {
    //     page2.innerHTML = ''
    // }
    let book = books.find(el => el.id == element.parentNode.parentNode.id)
    // let readMyBook = document.createElement('div')
    // readMyBook.innerHTML = `<div><p>${book.name}</p><div>${book.text}</div></div>`
    // page2.prepend(readMyBook)
  
   page2.innerHTML = `<div><p>${book.name}</p><div>${book.text}</div></div>`
    // page2.prepend(readMyBook)
}

function readDone(element) {
  if (element.parentNode.parentNode.classList.contains('done')) {
    if (element.closest('.listBook')) {
      listBook.prepend(element.parentNode.parentNode)} 
    if (element.closest('.favBookArea')) {
      favBookArea.prepend(element.parentNode.parentNode)}
    element.parentNode.parentNode.classList.remove('done')
  } else { 
    if (element.closest('.listBook')) {
      listBook.append(element.parentNode.parentNode)} 
    if (element.closest('.favBookArea')) {
      favBookArea.append(element.parentNode.parentNode)}
     element.parentNode.parentNode.classList.add('done')
  }
}

function changeBook(element) {
  let book = books.find(el => el.id == element.parentNode.parentNode.id)
  page2.innerHTML = `<input type="text" value='${book.name}' class='inputChangeBookName'> <br>
  <input type="text" value='${book.text}' class='inputChangeBookText'> <br> <button class='saveChange'>Сохранить измения в книге</button>`
  document.querySelector('.inputChangeBookName').focus()
  let oldBook = books.indexOf(book, 0)

  document.querySelector('.saveChange').addEventListener('click', () => {
    book.id = element.parentNode.parentNode.id
    book.name = document.querySelector('.inputChangeBookName').value
    book.text = document.querySelector('.inputChangeBookText').value
    books[oldBook].name = document.querySelector('.inputChangeBookName').value
    books[oldBook].text = document.querySelector('.inputChangeBookText').value
    element.parentNode.parentNode.firstChild.innerHTML = book.name = document.querySelector('.inputChangeBookName').value
    page2.innerHTML = `<div><p>${book.name}</p><div>${book.text}</div></div>`
  })   
}

async function sendPostRequest(login, file) {
  const url = "https://apiinterns.osora.ru"

  const formData = new FormData()
  formData.append("login", login)
  formData.append("file", file)

  const authHeader = btoa("Dev:qdprivate") // for code to Base64 login and password

  const requestOptions = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
    body: formData,
  }



  
    // const response = await fetch(url, requestOptions)

  
    // let result = await response.json(); // читать тело ответа в формате JSON
    // console.log(result.title, '+', result.text)  
      // let json = respone.json()
      // let obj = JSON.parse(json)
      // console.log(typeof response.json())   
      // console.log(Object.values(response.json()))  
      // console.log("Request complete, response: ", response.json())      




  try {
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      // let json = respone.json()
      // let obj = JSON.parse(json)
       
      let result = await response.json()

      let book = {
        id: Date.now(),
        name: result.title.slice(0, -4),
        text: result.text
        }
        
      let myBook = document.createElement('div')
      myBook.innerHTML = `<div class='rowListBook' draggable='true' id='${book.id}'><div class='listBookName'>${book.name}</div><div class='listBookBtn'><button onclick='changeBook(this)'>РЕД.</button><button onclick='readDone(this)'>Прочитано</button><button onclick='readBook(this)'>ЧИТАТЬ</button><button onclick='removeBook(this)'>Х</button></div></div>`
      listBook.prepend(myBook)
      
      books.push(book)
      
      fileInput.value = ''
 

      // console.log(result)
      // console.log(result.title.slice(0, -4), '+', result.text)
      // console.log(typeof response.json())   
      // console.log(Object.values(response.json()))  
      // console.log("Request complete, response: ", response.json())      
    } else {
      console.error("Get some error", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Nihera ne rabotaet padla: ", error)
  }
}

const login = "Dev"


myButton.addEventListener("click", () => {
const file = fileInput.files[0] // get file
sendPostRequest(login, file)
})

const radioLoad = document.querySelector('.radioLoad')
const radioWrite = document.querySelector('.radioWrite')
const radioChecked = document.querySelector('.radioChecked')

// function select() {
//   console.log('tosi bosi')
//     radioChecked.innerHTML = `<button class='myButton'>Загрузить книгу</button>`
 
// }


const addBookWrite = document.querySelector('.addBook_write')
const addBookLoad = document.querySelector('.addBook_load')


radioLoad.addEventListener('click', () => {
  console.log('загрузить книгу из файла')
  addBookWrite.classList.add('hidden')
  addBookLoad.classList.remove('hidden')
    // radioChecked.innerHTML = `<input type="file" accept='.txt' class='inputBookFile'> <br>        
    //     <button class='myButton'>Загрузить книгу</button>`
})

radioWrite.addEventListener('click', () => {
  console.log('написать книгу самому')
  addBookWrite.classList.remove('hidden')
  addBookLoad.classList.add('hidden')
  // radioChecked.innerHTML = `<input type="text" placeholder='Заголовок' class='inputBookName'> <br>
  //       <input type="text" placeholder='Описание' class='inputBookText'> <br>
  //       <button onclick='addBook(this)'>Добавить книгу</button>`
})


