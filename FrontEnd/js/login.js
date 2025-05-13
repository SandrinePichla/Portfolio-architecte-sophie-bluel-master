// 
document.getElementById('login-form').addEventListener('submit', async function (event) {
  // on ecoute le bouton envoi, fonction asynchrone pour attendre toutes les réponses
  event.preventDefault(); // on empêche le rechargement de la page

  const email = document.getElementById('email').value; // on récupère les infos tapées
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  try {  // try - catch
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST', // requête POST => envoi à l'API
      headers: { 'Content-Type': 'application/json' }, // envoi données au format JSON
      body: JSON.stringify({ email, password }) // transformation des données au format JSON
    });

    const data = await response.json(); // on attend la réponse et on la lit

    if (response.ok) {
      // Si la connexion a réussi,  
      localStorage.setItem('token', data.token); // on stocke le token dans le navigateur et
      window.location.href = 'index.html'; // on redirige vers la page d'accueil
    } else {
      // Sinon = mauvais identifiants
      errorMessage.textContent = 'Identifiant ou mot de passe incorrect.'; // Afficher le message d'erreur global, ne pas orienter vers le type d'erreur
      errorMessage.style.display = 'block';
    }
  } catch (error) { // si erreur înatendue => message type
    console.error('Erreur lors de la connexion :', error);
    errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    errorMessage.style.display = 'block';
  }
});