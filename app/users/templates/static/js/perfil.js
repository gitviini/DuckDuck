const csrf = document.cookie.split('=')[1]
const new_post = document.querySelector("#new_post")
const username = document.querySelector("input[name='username']").value
const bio = document.querySelector("#bio")
let d = new Date
const time = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`

async function get_post(){
    const resp = await fetch('/img')

    const data = resp.json()
    return data
}

function generate_post(data={}){

    tam = data.binary.length

    let space = document.querySelector("#post_content")

    for(let n = 0; n < tam; n++){
        let div = document.createElement('div')
        div.setAttribute('class','content')
        let img = document.createElement("img")
        img.src = data.binary[n]
        img.alt = ''
        let date = document.createElement('p')
        date.innerHTML = `<span class="fa fa-calendar"></span>${data.date[n]}`
        div.appendChild(img)
        div.appendChild(date)
        space.appendChild(div)
    }
}

get_post().then(data=>generate_post(data))

bio.addEventListener('click', ()=>{
    value = prompt('new bio')

    if (value == ' ' || value == ''){

    }
    else{
        fetch(window.location.href, {
            method:'post',
            headers:{'X-CSRFToken':get_csrf()},
            body: JSON.stringify({
                'bio':value
            })
        }).then(resp=>{
            if(resp.ok){
                window.location.reload()
            }
        }).catch(error=>console.log('ERROR:.'+error))
    }
})

function get_csrf(){
    let tokens = document.cookie.split('; ')
    for(token in tokens){
        resp = tokens[token].split('=')
        if(resp[0] == 'csrftoken'){
            return resp[1]
        }
        else{}
    }
} 

document.querySelector('.popup input[type="file"]').onchange = ()=>{
    let fr = new FileReader

    fr.onload = (load) =>{
        src = load.target.result
        document.querySelector('.popup img').src = src
    }

    fr.readAsDataURL(document.querySelector('.popup form input[type="file"]').files[0])
}

document.querySelector('.popup form').onsubmit = (event)=>{
    event.preventDefault()

    let fr = new FileReader

    fr.onload = (load) =>{
        let data = {
            csrfmiddlewaretoken: get_csrf(),
            username:username,
            binary: load.target.result,
        }
        
        fetch('http://localhost:8000/img/', {
            method:'POST',
            headers: {'X-CSRFToken':get_csrf()},            
            body: JSON.stringify(data),
        }).then(resp=>{
            if (resp.status == 200){
                window.location.reload()
            }
            else{
                console.log('error')
            }
        })
    }

    fr.readAsDataURL(document.querySelector('.popup form input[type="file"]').files[0])

}

const file = document.querySelector('#new_file')
file.onchange = () => {
    let fr = new FileReader

    fr.readAsDataURL(file.files[0])

    fr.onload = (load) => {
        let data = {
            csrfmiddlewaretoken: get_csrf(),
            username:username,
            binary: load.target.result,
            date:time,
        }

        fetch('/get_feed',{
            method:'POST',
            headers:{'X-CSRFToken':get_csrf()},
            body:JSON.stringify(data),
        })
        .then(resp=>{
            if(resp.status == 200){
                window.location.reload()
            }
            else{
                console.log('ERROR:. new post')
            }
        })
    }
}