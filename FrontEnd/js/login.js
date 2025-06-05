// = GESTION DE LA PAGE DE CONNEXION =

// == 1 == resetLoginForm Fonction qui réinitialise les champs si necessaire:
 function resetLoginForm() {
  const form = document.getElementById("login-form");
  if (form) {
    form.reset();
  }
}

// == 2 == on ecoute le bouton "se connecter"", fonction asynchrone => continue de lire le code
document.getElementById('login-form').addEventListener('submit', async function (event) {  
  event.preventDefault(); // on empêche le rechargement de la page

  const email = document.getElementById('email').value; // on récupère les infos tapées
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // == 3 == REGEX

 // REGEX pour l'email
  const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+$/;

  // REGEX pour un mot de passe : 1 majuscule, 1 minuscule, 1 chiffre, min 6 caractères
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  // == 4 == Vérification des champs
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

  // == 5 ==  Fetch POST envoi login + MDP à l'API
   try {  // try - catch
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST', // requête POST => envoi à l'API
      headers: { 'Content-Type': 'application/json' }, // envoi données au format JSON
      body: JSON.stringify({ email, password }) // transformation des données au format JSON
    });

    const data = await response.json(); // on attend la réponse et on la lit

    if (response.ok) {
      // Si la connexion a réussi,  
      localStorage.setItem('token', data.token); // on stocke le token dans le navigateur
      window.location.href = 'index.html'; // on redirige vers la page d'accueil
    } else {
      // Sinon = mauvais identifiants
      errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe.'; // Afficher le message d'erreur global, ne pas orienter vers le type d'erreur
      errorMessage.style.display = 'block';
    }
  } catch (error) { // si erreur înatendue => message type
    console.error('Erreur lors de la connexion :', error);
    errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    errorMessage.style.display = 'block';
  }
});