const feed = document.querySelector('#feed_content')
const posts = document.querySelectorAll("#middle .content")
const modal = document.querySelector('#right')

document.querySelector("#perfil").onclick = ()=> window.location.href = `/${get_cookie(1)}/`


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

function add_comments(data={},n=0){
    console.log(data)
    modal.classList.add('click')
    let modal_comments = document.querySelector('#modal_body .comments')
    modal_comments.innerHTML = ''
    let img = document.querySelector("#modal_body img")
    img.src = data.binary[n]
    document.querySelector('#modal_body .date').innerHTML = `<span class="fa fa-calendar"></span>${data.date[n]} @${data.auth[n]}`
    data.comments[n].forEach(element=>{
        let modal_comment = document.createElement('p')
        modal_comment.setAttribute('class','comment')
        modal_comment.innerText = element
        if (element != '' || element != ''){
            modal_comments.appendChild(modal_comment)
        }
    })
}

async function call(){
    const resp = await fetch('/center/', {
        method:'GET',
        headers:{
            'Content-Type':'text/html; mode=get_post_feed',
        },
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
    const resp = await fetch('/center/',
    {
        method:'post',
        headers:{
            'Content-Type':'form-data; mode=comment_post',
            'X-CSRFToken':get_cookie(),
        },
        body:JSON.stringify(data)
    })
    const respdata = await resp.json()
    return respdata
}

function generate_feed(data={}){
    try{
        feed.innerHTML = ''
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
                add_comments(data,n)
                document.querySelector("#message button").onclick = () =>{
                    let message = document.querySelector('#send_message').value
                    if (message != '' && message != ' ' && message != '<empty string>' && message != null && message.indexOf('&') == -1){
                        post_comment(data.auth[n],data.binary[n],data.date[n],`@${get_cookie(1)} ${message}&&`)
                        .then(data=>{
                            if (data) {
                                generate_feed(data)
                                add_comments(data,n)
                            }   
                        })
                        }
                    }
                }

            let effect = ''
        
            content.onmouseover = () =>{
                let i = 0
                let tam = comments.children.length
                console.log(tam)
                effect = setInterval(() => {
                    if (i < tam){
                        comments.style.top = `-${50*(i)}px`
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