
const cl = console.log;

const inputForm = document.getElementById('inputForm')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userId = document.getElementById('userId')
const AddBtn = document.getElementById('AddBtn')
const UpdateBtn = document.getElementById('UpdateBtn')
const cardContainer = document.getElementById('cardContainer')
const spinner = document.getElementById('spinner')

let postArr = []

let BASE_URL = `https://jsonplaceholder.typicode.com`

function snackbar(msg , icon){
    swal.fire({
        title : msg ,
        icon : icon ,
        timer : 3000
    })
}

function createPosts(){
    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    let Post_Url = `${BASE_URL}/posts`

    xhr.open('GET',Post_Url)
    xhr.send(null)

    xhr.onload = function(){
        postArr = JSON.parse(xhr.response)
        // cl(postArr)

        createCards(postArr.reverse())
    }

    spinner.classList.add('d-none')
}
createPosts();

function createCards(arr){
    let result = ''

    arr.forEach(ele => {
        result += `
            <tr id = ${ele.id}>
                <td>${ele.userId}</td>
                <td>${ele.title}</td>
                <td>${ele.body}</td>
                <td><i type='button' class="fa-regular fa-pen-to-square fa-2x text-primary" onclick='OnEdit(this)'></i></td>
                <td><i type='button' class="fa-solid fa-trash fa-2x text-danger" onclick='onRemove(this)'></i></td>

            </tr>
        
        `
    });

    cardContainer.innerHTML = result

    spinner.classList.add('d-none')
}

function onSubmit(ele){
    spinner.classList.remove('d-none')

    ele.preventDefault();

    let Post_Url = `${BASE_URL}/posts`
    let newObj = {
        userId : userId.value ,
        title : title.value ,
        body : body.value
    }

    postArr.unshift(newObj)

    let xhr = new XMLHttpRequest()

    xhr.open('GET' , Post_Url)
    xhr.send(JSON.stringify(newObj))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let response = JSON.parse(xhr.response)

            let tr = document.createElement('tr')
            tr.className = 'table'

            tr.id = newObj.id

            tr.innerHTML = `
            <td>${newObj.userId}</td>
                <td>${newObj.title}</td>
                <td>${newObj.body}</td>
                <td><i type='button' class="fa-regular fa-pen-to-square fa-2x text-primary" onclick='OnEdit(this)'></i></td>
                <td><i type='button' class="fa-solid fa-trash fa-2x text-danger" onclick='onRemove(this)'></i></td>
                            
            `

            cardContainer.prepend(tr)
            inputForm.reset()

            snackbar(`The New Card ${response.id} is Added Successfully...!` , 'success')
        }
    }
    spinner.classList.add('d-none')
}

function OnEdit(ele){
    spinner.classList.remove('d-none')

    let EditId = ele.closest('tr').id;

    localStorage.setItem('EditId' , EditId)
    let EditId_Url = `${BASE_URL}/posts/${EditId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',EditId_Url)
    xhr.send(null);

    xhr.onload = function(){
        let EditObj = JSON.parse(xhr.response)

        inputForm.classList.remove("d-none");

        userId.value = EditObj.userId
        title.value = EditObj.title
        body.value = EditObj.body

      
        AddBtn.classList.add('d-none')
        UpdateBtn.classList.remove('d-none')

          inputForm.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    }
    spinner.classList.add('d-none')
}

function onUpdate(){
    spinner.classList.remove('d-none')

    let UpdateId = localStorage.getItem('EditId')


    let UpdateObj = {
        userId : userId.value ,
        title : title.value ,
        body : body.value ,
        id : UpdateId
    }

    let PUT_Url = `${BASE_URL}/Posts/${UpdateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PUT' , PUT_Url)
    xhr.send(JSON.stringify(UpdateObj))

    xhr.onload = function(){
        let tr = document.getElementById(UpdateId).children

        tr[0].innerHTML = UpdateObj.userId
        tr[1].innerHTML = UpdateObj.title
        tr[2].innerHTML = UpdateObj.body
        inputForm.reset()

        AddBtn.classList.remove('d-none')
        UpdateBtn.classList.add('d-none')

        


        snackbar(`The Posts Item ID ${UpdateId} Is Updated Successfully...!` , 'success')
    }
    spinner.classList.add('d-none')
}

function onRemove(ele){
    spinner.classList.remove('d-none')

    let RemoveId = ele.closest('tr').id


    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"

        }).then((result) => {
            if (result.isConfirmed){
                let Remove_Url = `${BASE_URL}/Posts/${RemoveId}`
                let xhr = new XMLHttpRequest()

                xhr.open('DELETE',Remove_Url)
                xhr.send(null)

                xhr.onload = function(){
                    ele.closest('tr').remove()

                    snackbar(`The Posts Item Id ${RemoveId} Is Updated Successfully...!` , 'success')

                }
            }
        })
        spinner.classList.add('d-none')
    }

inputForm.addEventListener('submit',onSubmit)
UpdateBtn.addEventListener('click',onUpdate)