try{
    const view = document.querySelector('.view')
    const new_post = documentq.querySelector("#new_post")
    const url = document.querySelector('input[name="url"]')
    const exit = document.querySelector('.exit span')
    const photo = document.querySelector('#photo_perfil')

    photo.addEventListener('click', ()=>{
        view.classList.toggle('show')
        console.log(view.classList.item)
    })

    exit.addEventListener('click',()=>{
        view.classList.toggle('show')
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
            data = load.target.result
            
            fetch('http://localhost:8000/img/', {
                method:'POST',
                headers: {'X-CSRFToken':get_csrf()},            
                body: JSON.stringify(data),
            })
        }

        fr.readAsDataURL(document.querySelector('.popup form input[type="file"]').files[0])

    })
}
catch{
    console.log('error:. modals')
}