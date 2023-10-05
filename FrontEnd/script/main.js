const SectionWork = document.getElementsByClassName("gallery")
const SectionFilter = document.getElementById("category-filter")
const modal = document.getElementById("modal")
const modalHeader = document.getElementsByClassName("modal_header")[0]
const modalContent = document.getElementById('modal_content')
const overlay = document.getElementsByClassName("overlay")[0]
const modalEnd = document.getElementsByClassName("modal_end")[0]
const modalH2 = document.getElementById('modal_h2')
const submit = document.getElementsByTagName('submit')
const modalFormBtn = document.getElementById("btn_modal")


overlay.addEventListener('click', () => {
        if(overlay.style.display === 'block'){
            closeModal()
        }
    })

 async function openModal(){
    overlay.style.display = 'block'
    modalContent.innerHTML = ''
    modalEnd.innerHTML = ''

    const btnAjout = document.createElement('button')
    btnAjout.type = 'submit'
    btnAjout.id = 'btn_modal'
    btnAjout.className = 'btn_modal'
    btnAjout.innerHTML = 'Ajouter une photo'

    const pDelete = document.createElement('p')
    pDelete.className = 'delete'
    pDelete.innerHTML = 'Supprimer la galerie'

    modalH2.innerHTML = 'Galerie photo'
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
            }
            ).then(response => {
                if (response.status === 204) {
                    alert(`Le produit ${workId} a bien été supprimé`)
                    // On récupere dans notre DOM l'article et le figure dont notre workId est égal a celui supprimé puis on le remove
                    const articleDelete = document.querySelector(`article i[data-id="${workId}"]`).closest('article');
                    const figureDelete = document.querySelector(`figure figcaption[id="${workId}"]`).closest('figure');

                    if (article) {
                        console.log('Article trouvé :', articleDelete);
                        articleDelete.remove()
                        figureDelete.remove()
                        // Vous pouvez maintenant manipuler ou supprimer l'article trouvé
                    } else {
                        console.log(`Aucun article avec data-id="${workId}" n'a été trouvé.`);
                    }
                    
                } else {
                    // Gérer les erreurs
                    console.log('Une erreur s est produite')
                }
            })
            
        })

        img.src = works[i].imageUrl
        edit.innerHTML = 'éditer'

        modalContent.appendChild(article)
        article.appendChild(img)
        article.appendChild(trashIcon)
        article.appendChild(edit)
        modalEnd.appendChild(btnAjout)
        modalEnd.appendChild(pDelete)

        btnAjout.addEventListener('click', () => {
            modalEnd.removeChild(btnAjout)
            modalEnd.removeChild(pDelete)
            modalForm()
        })
    }
}




const modalClose= document.getElementsByClassName("modal-close")[0].addEventListener("click", closeModal)


async function modalForm(){
    //const modalH2 = document.getElementsById("modal_h2")
    files = 0
    modalH2.innerHTML = "Ajout photo"
    modalContent.innerHTML = ''
    modalEnd.innerHTML = ''

    // Construction de la fleche
    const modal_arrow = document.createElement('i')
    modal_arrow.className = 'fa-solid fa-arrow-left'
    modal_arrow.addEventListener('click', () => {
        modalHeader.removeChild(modal_arrow);
        modalEnd.removeChild(btnValider)
        openModal()
    })

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
    modalHeader.appendChild(modal_arrow)
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
    console.log(btnValider)
    console.log(document.getElementsByClassName('btn-filter')[0])
    btnValider.addEventListener('click', (e) => {
    e.preventDefault()
    const alerte = []
    
        if(titreInput.value.length < 5){
           alerte.push('Le titre est trop court ou est vide')
        }  
         if(files === undefined || files == 0){
            alerte.push('Vous devez renseigner une image')
        }
        
        else{
            addWork(titreInput, listSelect, files)}
            for (let i = 0; alerte.length > i; i++){
                alert(alerte[i])
            }
        })
        }
    
        function addWork(titreInput, listSelect, files) {
            const title = titreInput.value;
            const category = listSelect.value;
            let imageFile = null;
            
            if (files && files.length > 0) {
                imageFile = files[0];
            }
        
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append('image', imageFile);
        
            
            fetch('http://localhost:5678/api/works', {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            .then(response => {
                if (response.status === 201) {
                    console.log("Travail ajouté avec.");
                    alert(`Le produit ${title} a bien été ajouté`)
                    SectionWork[0].innerHTML = ""
                    getWorks("Tous")
                    
                } else {
                    console.error("Erreur lors de l'ajout", response.status);
                }
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
        }

async function closeModal(){
    
    modal.style.display = 'none';
    overlay.style.display = 'none'
    
}

//On retourne une réponse de l'API contenant tous les travaux
async function getWorks(categoryName){
    const reponse = await fetch('http://localhost:5678/api/works')
    const works = await reponse.json()
    if(categoryName === "Tous"){
    for (let i = 0; i < works.length; i++) {    
            // On crée chacun de nos élements
            let figure = document.createElement('figure')
            let image = document.createElement('img')
            let figcaption = document.createElement('figcaption')

            //On leur attribue une valeur par rapport a la réponse
            image.src = works[i].imageUrl
            image.alt = works[i].title
            figcaption.innerText = works[i].title
            figcaption.setAttribute('id', works[i].id);

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


