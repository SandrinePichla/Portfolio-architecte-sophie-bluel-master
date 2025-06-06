// = GESTION DE LA PAGE DE CONNEXION =

// == 1 == resetLoginForm Fonction qui réinitialise les champs si necessaire:
 function resetLoginForm() {
  const form = document.getElementById("login-form");
  if (form) {
    form.reset();
  }
}

// == 2 == Le FORMULAIRE
document.getElementById('login-form').addEventListener('submit', async function (event) {  
  event.preventDefault(); 

  const email = document.getElementById('email').value; // on récupère les infos saisies
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');


  const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+$/;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  // == 3 == Vérification des champs
  if (!emailRegex.test(email)) {
    errorMessage.textContent = "L'adresse email n'est pas valide.";
    errorMessage.style.display = 'block';
    return;
  }

  if (!passwordRegex.test(password)) {
    errorMessage.textContent = "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 6 caractères minimum.";
    errorMessage.style.display = 'block';
    return;
  }

  // == 5 == envoi à l'API
   try {  
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email, password }) 
    });

    const data = await response.json();

    if (response.ok) {
       
      localStorage.setItem('token', data.token); 
      window.location.href = 'index.html'; 
    } else {
      
      errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe.'; 
      errorMessage.style.display = 'block';
    }
  } catch (error) { 
    console.error('Erreur lors de la connexion :', error);
    errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    errorMessage.style.display = 'block';
  }
});