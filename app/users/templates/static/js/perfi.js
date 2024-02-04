const csrf = document.cookie.split('=')[1]
const new_post = document.querySelector("#new_post")
const username = document.querySelector("input[name='username']").value
const add_bio = document.querySelector("#add_bio")
let d = new Date
const time = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`

add_bio.addEventListener('click', ()=>{
    value = prompt('new bio')

    fetch(window.location.href, {
        method:'post',
        headers:{'X-CSRFToken':get_csrf()},
        body: JSON.stringify({
            'bio':value
        })
    }).then(resp=>{
        console.log(resp.status)
    }).catch(error=>console.log('ERROR:.'+error))
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