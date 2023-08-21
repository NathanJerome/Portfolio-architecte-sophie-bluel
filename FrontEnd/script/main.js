const SectionWork = document.getElementsByClassName("gallery")
const SectionFilter = document.getElementById("category-filter")
const btn = document.getElementsByClassName("btn-filter")

//On retourne une réponser de l'API contenant tous les travaux
async function getWorks(){
    const reponse = await fetch('http://localhost:5678/api/works')
    const works = await reponse.json()

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

async function getCategory(){
    const reponse = await fetch('http://localhost:5678/api/categories')
    const category = await reponse.json()

    for (let i = 0; i < category.length; i++) {
        let newButton = document.createElement('button')
        newButton.classList.add('btn-filter')
        
        console.log(category[i].name)
        
        newButton.innerText= category[i].name
        console.log(newButton)
        SectionFilter.appendChild(newButton)
    }
}

getWorks()
getCategory()
console.log(btn)

