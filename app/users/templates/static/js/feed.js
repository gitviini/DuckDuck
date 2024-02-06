const feed = document.querySelector('#feed_content')

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

async function post_comment(reply='',auth='',binary='',date=''){
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
        console.log(resp.status)
    })
}

function generate_feed(data={}){
    try{
        console.log(data['comments'])
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
            content.onclick = ()=>{
                let comment = prompt(`reply to @${data.auth[n]}:`)
                if (comment != '' && comment != ' ' && comment != '<empty string>' && comment != null && comment.indexOf('&&') == -1){
                    post_comment(comment+'&&',data.auth[n],data.binary[n],data.date[n])
                }
            }
        }
    }
    catch{
        error=>console.log(error)
    }
}

call().then(data=>generate_feed(data))