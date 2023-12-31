const form = document.querySelector('form');
const p = document.getElementById("error-p")
const a = document.getElementById("login-a")
const h2 = document.getElementById("my-projets")
const banner = document.getElementById("edit_mode")
const changeI = document.getElementById("intro-i")
// A modifier (Changer ID / Bouton)
const myProject = document.getElementsByClassName("fa-regular fa-pen-to-square")[0]

if (sessionStorage.getItem("token")){
    //alert('Vous êtes connecté')
    changeI.style.display = 'block'
    
    a.innerText = "logout"

    const iconElement = document.createElement("i");
    iconElement.className = "fa-regular fa-pen-to-square";
    
    const iconText = document.createElement("span")
    iconText.className = "text-icon";
    iconText.innerText = "modifier"


    h2.appendChild(iconElement)
    iconElement.appendChild(iconText)

    h2.addEventListener("click", openModal)
    banner.style.display = "flex"

    a.addEventListener("click", function(event){
        sessionStorage.removeItem("token")
        
    })
}
else{
    console.log("Not connected")
}
// Quand on submit
form.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // On teste si nos champs sont vide ou non
   if(email === '' || password == ''){
        console.log('Le mot de passe ou l email est vide')
   }
   else{
    console.log('Tout est bon')
    const response = {
        email: email,
        password: password,
    };

    console.log(response)

    const responseJson = JSON.stringify(response)

    console.log(responseJson)

    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: responseJson
    })
    .then(response => {
        if (response.status === 200) {
            console.log("L'API a répondu avec le code 200 OK");
            p.innerHTML = 'Connexion'
            p.classList.add("green")
            
            return response.json();
            
            
        } else {
            console.log("L'API a répondu avec le code ", response.status);
            if(response.status === 404){
                if(p.classList.contains("green")){
                    p.classList.remove("green")
                }
                p.innerHTML = "L'utilsateur n'a pas été trouvé"
            }
        }
    }) 
    .then(result => { 
        
        if (result.token) {
            console.log(result.token);
            sessionStorage.setItem("token", result.token);

            setTimeout(() => {
            window.location.href = "index.html";},"1000");
        }
    })
  
    .catch(error => {
        console.error("Error:", error);
    });


   }

});