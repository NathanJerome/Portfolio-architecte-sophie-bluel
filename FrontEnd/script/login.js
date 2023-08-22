const form = document.querySelector('form');
const p = document.getElementById("error-p")

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
                    p.classList.remove("green"
                    )
                }
                p.innerHTML = "L'utilsateur n'a pas été trouvé"
            }
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });


   }

});