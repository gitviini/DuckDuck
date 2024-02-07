const feed = document.querySelector('#feed_content')
const posts = document.querySelectorAll("#middle .content")
const modal = document.querySelector('#right')

document.querySelector("#perfil").onclick = ()=> window.location.href = '/perfil'

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
            case 1:
                if(resp[0] == 'name'){
                    return resp[1]
                }
                else{}
        }
    }
} 

async function call(){
    const resp = await fetch('http://localhost:8000/get_feed/', {
        method:'GET',
        headers:{'X-CSRFToken':get_cookie()},
    })
    const data = await resp.json()
    return data
}

async function post_comment(auth='',binary='',date='',reply=''){
    data = {
        'username':auth,
        'binary':binary,
        'date':date,
        'comments':reply,
    }
    fetch('/get_feed/',
    {
        method:'post',
        headers:{'X-CSRFToken':get_cookie()},
        body:JSON.stringify(data)
    }).then(resp=>{
        if(resp.status == 200){
            window.location.reload()
        }
    })
}

function generate_feed(data={}){
    try{
        tam = data.auth.length
        for(let n = 0; n < tam; n++){
            let content = document.createElement('div')
            content.setAttribute('class','content')
            let img = document.createElement('img')
            img.src = data.binary[n]
            img.alt = data.auth[n]
            let date = document.createElement('p')
            date.setAttribute('class','date')
            date.innerHTML = `<span class='fa fa-calendar'></span>${data.date[n]} @${data.auth[n]}`
            content.appendChild(img)
            content.appendChild(date)
            feed.appendChild(content)
            let comments_container = document.createElement('div')
            comments_container.innerHTML = `<p class="button"><span class="fa fa-comments"></span>comments</p>`
            comments_container.setAttribute('class','comments_container')
            let comments = document.createElement('div')
            comments.setAttribute('class','comments')
            data.comments[n].forEach(element => {
                let comment = document.createElement('p')  
                comment.setAttribute('class','comment')
                comment.innerText = element
                if (element != ''){
                    comments.appendChild(comment)
                }
            })
            comments_container.appendChild(comments)
            content.appendChild(comments_container)
            content.onclick = () =>{
                modal.classList.add('click')
                let modal_comments = document.querySelector('#modal_body .comments')
                let img = document.querySelector("#modal_body img")
                img.src = data.binary[n]
                document.querySelector('#modal_body .date').innerHTML = `<span class="fa fa-calendar"></span>${data.date[n]} @${data.auth[n]}`
                data.comments[n].forEach(element=>{
                    let modal_comment = document.createElement('p')
                    modal_comment.setAttribute('class','comment')
                    modal_comment.innerText = element
                    if (element != ''){
                        modal_comments.appendChild(modal_comment)
                    }
                })
                document.querySelector("#message button").onclick = () =>{
                    let message = document.querySelector('#send_message').value
                    if (message != '' && message != ' ' && message != '<empty string>' && message != null && message.indexOf('&') == -1){
                        post_comment(data.auth[n],data.binary[n],data.date[n],`@${get_cookie(1)} ${message}&&`)
                    }
                }
            }

            let effect = ''
        
            content.onmouseover = () =>{
                let i = 0
                effect = setInterval(() => {
                    let tam = comments.children.length
                    if (i < tam){
                        console.log(i)
                        comments.style.top = `-${49*(i)}px`
                        i++
                    }
                    else{
                        i = 0
                    }
                    console.log(i)
                    
                }, 1000)
            }
            content.onmouseout = () =>{
                clearInterval(effect)
            }
        }
    }
    catch{
        error=>console.log(error)
    }
}

call().then(data=>generate_feed(data))

document.querySelector("#exit").onclick = () =>{
    modal.classList.remove('click')
}