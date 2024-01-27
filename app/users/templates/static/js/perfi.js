const csrf = document.cookie.split('=')[1]
const username = document.querySelector("input[name='username']").value
const add_bio = document.querySelector("#add_bio")

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
    })
})

function get_csrf(){
    token = document.cookie.split('=')[1]
    return token
}

const photo = document.querySelector('#photo_perfil')

photo.addEventListener('click', ()=>{
    document.querySelector('.popup').classList.add('click')
    console.log('oi')
})

document.querySelector('.popup input[type="file"]').addEventListener('change',()=>{
    let fr = new FileReader

    fr.onload = (load) =>{
        src = load.target.result
        document.querySelector('.popup img').src = src
    }

    fr.readAsDataURL(document.querySelector('.popup form input[type="file"]').files[0])
})

document.querySelector('.popup form').addEventListener('submit', (event)=>{
    event.preventDefault()

    let fr = new FileReader

    fr.onload = (load) =>{
        var data = {
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
        })
    }

    fr.readAsDataURL(document.querySelector('.popup form input[type="file"]').files[0])

})

