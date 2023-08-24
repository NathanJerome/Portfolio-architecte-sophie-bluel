const SectionWork = document.getElementsByClassName("gallery")
const SectionFilter = document.getElementById("category-filter")
const modal = document.getElementById("modal")
const modalContent = document.getElementById('modal_content')
const overlay = document.getElementsByClassName("overlay")[0]
const modalEnd = document.getElementsByClassName("modal_end")[0]



const modalFormBtn = document.getElementById("btn_modal")

 async function openModal(){
    
    modalContent.innerHTML = ''

    modal.style.display = 'block';
    overlay.style.opacity = 1

    const reponse = await fetch('http://localhost:5678/api/works')
    const works = await reponse.json()

    for (let i = 0; i < works.length; i++) {
        let article = document.createElement('article')
        let img = document.createElement('img')
        let edit = document.createElement('p')
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash-can';
        trashIcon.setAttribute('data-id', works[i].id );

        //Event declenchant une fonction anonyme afin de supprimer un travail via l'API
        trashIcon.addEventListener('click', (event) =>{
            event.preventDefault();
            
            const workId = trashIcon.getAttribute('data-id')
            fetch('http://localhost:5678/api/works/'+ workId, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                }
            }).then(response => {
                if (response.status === 200) {
                    alert(`Le produit ${workId} a bien été supprimé`)
                } else {
                    // Gérer les erreurs
                }
            })
            
        })

        img.src = works[i].imageUrl
        edit.innerHTML = 'éditer'

        modalContent.appendChild(article)
        article.appendChild(img)
        article.appendChild(trashIcon)
        article.appendChild(edit)
    }
}




const modalClose= document.getElementsByClassName("modal-close")[0].addEventListener("click", closeModal)
modalFormBtn.addEventListener('click', modalForm)

async function modalForm(){
    //const modalH2 = document.getElementsById("modal_h2")
    //modalH2.innerHTML = "Ajout photo"
    modalContent.innerHTML = ''
    modalEnd.innerHTML = ''

    //h2
    const divImg = document.createElement("div")
    divImg.classList.add('div_img')
    const iconImg = document.createElement("i")
    iconImg.className = 'fa-regular fa-image'

    const divPhoto = document.createElement('div')
    divPhoto.classList.add('btn-photo')
    const labelPhoto = document.createElement("p")
    labelPhoto.classList.add('label_photo')
    labelPhoto.innerHTML = "+Ajouter photo"
    const btnPhoto = document.createElement("input")
    
    btnPhoto.type = 'file'
    btnPhoto.accept = 'image/png, image/jpeg';
    const pImg = document.createElement("p")
    pImg.innerHTML =".jpg .png : 4mo max"

    const form = document.createElement("form")
    form.id = 'form-modal'

    const labeltitre = document.createElement("label")
    labeltitre.textContent = 'Titre'
    const titreInput = document.createElement('input')
    titreInput.type='text'
    titreInput.name='title'
    titreInput.required= true;

    const labelCategories = document.createElement("label")
    labelCategories.textContent = 'Catégorie'
    const listSelect = document.createElement('select')
    listSelect.name = 'listItem';
    listSelect.required = true

    const btnValider = document.createElement('button')
    btnValider.classList.add('btn-filter')
    btnValider.type = 'submit'
    btnValider.innerHTML = 'Valider'

    const reponse = await fetch('http://localhost:5678/api/categories')
    const category = await reponse.json()

    for (let i = 0; i < category.length; i++) {
      const option = document.createElement('option');
      option.value = category[i].id; 
      option.textContent = category[i].name; 
      listSelect.appendChild(option)
    
    }

    btnPhoto.addEventListener('change', (e) =>{
        console.log('Nouveau')
        files = e.target.files

        if (files.length > 0) {
            const selectedFile = files[0]; //
            const preview = document.createElement('img')
            preview.classList.add('preview-img')
            preview.src = window.URL.createObjectURL(selectedFile)
            divImg.innerHTML = ''
            divImg.appendChild(preview)
        }
       
    })

    //Ajout
    modalContent.appendChild(divImg)
    divImg.appendChild(iconImg)
    divImg.appendChild(divPhoto)
    divPhoto.appendChild(labelPhoto)
    divPhoto.appendChild(btnPhoto)
    divImg.appendChild(pImg)

    modalContent.appendChild(form)
    form.appendChild(labeltitre)
    form.appendChild(titreInput)
    form.appendChild(labelCategories)
    form.appendChild(listSelect)

    modalEnd.appendChild(btnValider)
    btnValider.addEventListener('click', () => addWork(titreInput, listSelect, files))


}

function addWork(titreInput, listSelect, files){
    const title= titreInput.value;
    const category = listSelect.value;
    let imageFile = null;
    if (files && files.length > 0) {
        imageFile = files[0];
    }

    console.log(title + category)
    console.log(imageFile.name)

    const response = {
        title: title,
        categoryId: category,
        imageUrl: imageFile.name
    }

    const responseJson = JSON.stringify(response)
    console.log(`Bearer ${sessionStorage.getItem("token")}`)
    
    fetch('http://localhost:5678/api/works', {
        method: "POST",
        body: responseJson,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `BearerAuth ${sessionStorage.getItem("token")}`
        }
    }).then(response => {
        console.log(response)})
        console.log(responseJson)
}

async function closeModal(){
    
    modal.style.display = 'none';
    overlay.style.opacity = 0
    
}

//On retourne une réponse de l'API contenant tous les travaux
async function getWorks(categoryName){
    const reponse = await fetch('http://localhost:5678/api/works')
    const works = await reponse.json()
    if(categoryName === "Tous"){
    for (let i = 0; i < works.length; i++) {
        // console.log(works[i].title)
        //console.log(SectionWork[0])
            
            // On crée chacun de nos élements
            let figure = document.createElement('figure')
            let image = document.createElement('img')
            let figcaption = document.createElement('figcaption')

            //On leur attribue une valeur par rapport a la réponse
            image.src = works[i].imageUrl
            image.alt = works[i].title
            figcaption.innerText = works[i].title

            //On les place dans les bonnes balise
            SectionWork[0].appendChild(figure)
            figure.appendChild(image)
            figure.appendChild(figcaption)
        }
    }
    else{
        const filter = works.filter(work => work.category.name === categoryName)
        console.log(filter)

        for (let i = 0; i < filter.length; i++) {
            let figure = document.createElement('figure')
            let image = document.createElement('img')
            let figcaption = document.createElement('figcaption')

            //On leur attribue une valeur par rapport a la réponse
            image.src = filter[i].imageUrl
            image.alt = filter[i].title
            figcaption.innerText = filter[i].title

            //On les place dans les bonnes balise
            SectionWork[0].appendChild(figure)
            figure.appendChild(image)
            figure.appendChild(figcaption)
        }
    }
    
    

    
}

async function getCategory(){
    const reponse = await fetch('http://localhost:5678/api/categories')
    const category = await reponse.json()
    

    for (let i = 0; i < category.length; i++) {
        let newButton = document.createElement('button')
        newButton.classList.add('btn-filter')
        
        //console.log(category[i].name)
        
        newButton.innerText= category[i].name
       // console.log(newButton)
        SectionFilter.appendChild(newButton)
        
    }

    const btn = document.getElementsByClassName("btn-filter")
    for(let i=0; i < btn.length; i++){
        btn[i].addEventListener("click", function() {
            btnFilter(btn[i])
        })
    }
}

getCategory()
getWorks("Tous")

//Filtre permettant de trier en fonction de notre choix
function btnFilter(category){
    alert('Vous avez cliqué sur un bouton')
    //console.log(category)
    const selected = document.querySelector('[selected=""]')
    selected.removeAttribute("selected")
    category.setAttribute("selected","")
    SectionWork[0].innerHTML = ""
    getWorks(category.innerText)


}

const submit = document.getElementsByTagName('submit')
