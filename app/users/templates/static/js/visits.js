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