const listBook = document.querySelector('.listBook')
const favBookArea = document.querySelector('.favBookArea')

const page2 = document.querySelector('.page2')
const dropArea = document.querySelector('.dropArea')

const fileInput = document.querySelector('.inputBookFile') // get input element
const myButton = document.querySelector('.myButton') // get button element

let books = []

function addBook() {
  const inputBookName = document.querySelector('.inputBookName')
  const inputBookText = document.querySelector('.inputBookText')
  
  let book = {
  id: Date.now(),
  name: inputBookName.value,
  text: inputBookText.value
  }
  
  let myBook = document.createElement('div')
  myBook.innerHTML = `<div class='rowListBook' draggable='true' id='${book.id}' onmouseover='dragBook(this)'><div class='listBookName'>${book.name}</div><div class='listBookBtn'><button onclick='changeBook(this)'>РЕД.</button><button onclick='readDone(this)'>Прочитано</button><button onclick='readBook(this)'>ЧИТАТЬ</button><button onclick='removeBook(this)'>Х</button></div></div>`
  listBook.prepend(myBook)

  books.push(book)

  inputBookName.value = ''
  inputBookText.value = ''
}

dropArea.ondragover = allowDrop

function allowDrop(event) {
  event.preventDefault()
}

function dragBook(element) {
  element.ondragstart = drag
  let id = element.id

  function drag(event) {
    event.dataTransfer.setData('id', id)
  }
}

dropArea.ondrop = drop

function drop(event) {
  let ItemId = event.dataTransfer.getData('id')
  console.log(ItemId)
  favBookArea.append(document.getElementById(ItemId))
  document.getElementById(ItemId).draggable = false
}

function removeBook(element) {
    element.parentNode.parentNode.remove()
    books = books.filter(el => el.id != element.parentNode.parentNode.id)
}

function readBook(element) {
  let book = books.find(el => el.id == element.parentNode.parentNode.id)
  page2.innerHTML = `<div><p>${book.name}</p><div>${book.text}</div></div>`
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
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
    body: formData,
  }

  try {
    const response = await fetch(url, requestOptions)
    if (response.ok) {
       
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

const addBookWrite = document.querySelector('.addBook_write')
const addBookLoad = document.querySelector('.addBook_load')

radioLoad.addEventListener('click', () => {
  console.log('загрузить книгу из файла')
  addBookWrite.classList.add('hidden')
  addBookLoad.classList.remove('hidden')
})

radioWrite.addEventListener('click', () => {
  console.log('написать книгу самому')
  addBookWrite.classList.remove('hidden')
  addBookLoad.classList.add('hidden')
})


