const new_post = document.querySelector("#new_post")
const username = document.querySelector("input[name='username']").value
const bio = document.querySelector("#bio")
let d = new Date
const time = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`

async function get_post(){
    const resp = await fetch('/center/',{
        method:'GET',
        headers:{
            'Content-Type':'text/html; mode=get_post_perfil',
        }
    })

    const data = await resp.json()
    return data
}

async function delete_post(data={},n=''){
    const req = await fetch('/center/',{
        method:'DELETE',
        headers:{
            'Content-Type':'form-data; mode=delete_post',
            'X-CSRFToken':get_cookie(),
        },
        body:JSON.stringify({
            'username':get_cookie(1),
            'binary':data.binary[n],
            'date':data.date[n],
            'comments':data.comments[n],
        })
    })
    const resp = req.json()
    return resp
}

function generate_post(data={}){
    tam = data.binary.length
    let post_content = document.querySelector('#post_content')
    post_content.innerHTML = ''

    for(let n = 0; n < tam; n++){
        let content = document.createElement('div')
        content.setAttribute('class','content')
        let img = document.createElement("img")
        img.src = data.binary[n]
        img.alt = ''
        let date = document.createElement('p')
        date.innerHTML = `<span class="fa fa-calendar"></span>${data.date[n]}`
        content.appendChild(img)
        content.appendChild(date)
        post_content.appendChild(content)

        content.onclick = () =>{
            let confirm = prompt('do you want delete your photograph?\n0)YES\n1)NO\n:')
            if (confirm && Number(confirm).toFixed(0) == 0 && confirm.indexOf(' ') == -1){
                delete_post(data,n)
                .then(data=>generate_post(data))
            }
        }
    }
}

get_post().then(data=>generate_post(data))

bio.addEventListener('click', ()=>{
    value = prompt('new bio')

    if (value == ' ' || value == ''){

    }
    else{
        fetch('/center/', {
            method:'post',
            headers:{
                'Content-Type':'form-data; mode=bio_perfil',
                'X-CSRFToken':get_cookie()
            },
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

function get_cookie(mode=0){
    let tokens = document.cookie.split('; ')
    for(let token in tokens){
        resp = tokens[token].split('=')
        switch (mode){
            case 0:
                if(resp[0] == 'csrftoken'){
                    return resp[1]
                }
                else{}
                break
            case 1:
                if(resp[0] == 'name'){
                    return resp[1]
                }
                else{}
                break
            default: 
                console.log('get_cookie:. mode not found')
                break
        }
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
            csrfmiddlewaretoken: get_cookie(),
            username:username,
            binary: load.target.result,
        }
        
        fetch('/center/', {
            method:'POST',
            headers: {
                'Content-Type':'form-data; mode=photo_perfil',
                'X-CSRFToken':get_cookie()
            },            
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
            csrfmiddlewaretoken: get_cookie(),
            username:username,
            binary: load.target.result,
            date:time,
            comments:'',
        }

        fetch('/center/',{
            method:'POST',
            headers:{
                'Content-Type':'form-data; mode=img_post',
                'X-CSRFToken':get_cookie()
            },
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