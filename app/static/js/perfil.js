
const csrf = document.cookie.split('=')[1]

function get_csrf(){
    token = document.cookie.split('=')[1]
    return token
}

const button = document.querySelector('button')

button.addEventListener('click',()=>{

    var input = document.querySelector("input[name='file']").files

    let files = new FileReader

    files.onload = (load)=>{
        var data = {    
            csrfmiddlewaretoken: get_csrf(),
            username:'vini',
            binary: load.target.result,
        }

        fetch('http://localhost:8000/img/', {
            method:'POST',
            headers: {'X-CSRFToken':get_csrf()},            
            body: JSON.stringify(data),
        })
    }

    files.readAsDataURL(input[0])

})