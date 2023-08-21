const SectionWork = document.getElementsByClassName("gallery")
const SectionFilter = document.getElementById("category-filter")
console.log(SectionWork )

//On retourne une réponser de l'API contenant tous les travaux
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