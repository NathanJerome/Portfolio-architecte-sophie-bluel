async function getWorks(){
    const reponse = await fetch('http://localhost:5678/api/works')
    const works = await reponse.json()

    for (let i = 0; i < works.length; i++) {
        console.log(works[i].title)
    }
    
    console.log(works) 
}
    