// = GESTION AFFICHAGE DES PROJETS =
// 1 : Je sélectionne l'élément où on va afficher les projets => dans la class gallery
const gallery = document.querySelector(".gallery");

// 2 : Je selectionne ma filter-bar
const filtersContainer = document.querySelector(".filter-bar"); 

// 1 : Fonction pour récupérer les travaux depuis l'API
// Fonction async pour attendre que les operations soient terminees
async function getWorks() {
    // fonction try ... catch pour voir s'il y a des erreurs ; fetch envoi une requete à l'url de l'API
    // await attend la reponse de l'api avant de continuer
    // la reponse sera en format .json dans la constante works
      try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
            
        
        
        // je vide la galerie des anciens travaux   
        gallery.innerHTML = ""; 
    
        // je créer mes nouveaux élements et je les raccroche aux dossiers parents
        works.forEach(work => {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          img.src = work.imageUrl;
          img.alt = work.title;
    
          const figcaption = document.createElement("figcaption");
          figcaption.innerText = work.title;
    
          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
        });

// -- 2 : PARTIE FILTRAGE Récupération des catégories uniques ---
    const uniqueCategories = []; // création d'un tableau vide pour stocker les catégories
    works.forEach(work => {
      const categoryName = work.category.name; // Pour chaque projet, on va chercher le nom de la catégorie
      if (!uniqueCategories.includes(categoryName)) {
        uniqueCategories.push(categoryName); // Si cette catégorie n’est pas encore dans notre tableau, on l’ajoute.
      }
    });

    // -- Création des boutons de filtre ---
    // On ajoute le bouton tous = affichage par defaut de tous les projets
    const allButton = document.createElement("button"); // on crée le bouton HTML
    allButton.className = "filter-btn active"; // classe + active = selectionné
    allButton.dataset.category = "Tous"; // on note le nom de la catégorie dans le bouton
    allButton.textContent = "Tous";
    filtersContainer.appendChild(allButton); // on le raccroche au dossier parent 

    // puis on crée un bouton pour chaque catégorie, comme pour le bouton "tous" :
    uniqueCategories.forEach(category => {
      const button = document.createElement("button");
      button.className = "filter-btn";
      button.dataset.category = category; // on enregistre le nom de la catégorie
      button.textContent = category;
      filtersContainer.appendChild(button);
    });

    // je récupère tous les boutons qui ont la classe filter-btn
    const allButtons = document.querySelectorAll(".filter-btn");

    // -- Gestion des filtres ---
    // -- j'ecoute le click sur chaque bouton
    allButtons.forEach(button => {
      button.addEventListener("click", () => {
        const selectedCategory = button.dataset.category; // on repere la categorie cliquée
        // on enleve la classe active pour tous les boutons
        allButtons.forEach(btn => btn.classList.remove("active"));
        // on ajoute la classe active sur celui qu'on a cliqué
        button.classList.add("active");

        // --- Affichage filtré ---
        // on vide la gallery
        gallery.innerHTML = "";

        // si on a cliqué sur tous, on les affiche tous
        const filteredWorks = selectedCategory === "Tous"
          ? works
        // sinon on utilise .filter pour garder la bonne catégorie
          : works.filter(work => work.category.name === selectedCategory);

        // comme dans 1 : pour chaque projet filtré , on recré les balises et on les ajoute dans la galerie
        filteredWorks.forEach(work => {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          img.src = work.imageUrl;
          img.alt = work.title;

          const caption = document.createElement("figcaption");
          caption.innerText = work.title;

          figure.appendChild(img);
          figure.appendChild(caption);
          gallery.appendChild(figure);
        });
      });
    });

    // 3 Affichage de la galerie de photos dans la modale, comme pour les projets :
    function displayModalGallery(works) {
      const modalGallery = document.getElementById("modal-gallery");
      modalGallery.innerHTML = ""; // je vide la galerie avant d'ajouter les photos

      works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // Je crée l'icône de suppression = poubelle
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-solid fa-trash-can delete-icon";

        // J'écoute le click sur la poubelle
        deleteIcon.addEventListener("click", () => {
          deleteWork(work.id); // fonction à écrire ensuite


        });

        figure.appendChild(img);
        figure.appendChild(deleteIcon);
        modalGallery.appendChild(figure);
      });
    }

    // 3 Modale Affichage des photos dans la modale
        displayModalGallery(works);

    // et si on a un problème, un message d'erreur s'affiche :
      } catch (error) {
        console.error("Afficher un message d'erreur lors du chargement des travaux :", error);
      }      
    }
  
  // Appel de la fonction getWorks
  getWorks();


// = GESTION DU MODE ADMIN =
  const token = localStorage.getItem('token');

  const bandeau = document.querySelector('.bandeau');
  const buttonModal = document.querySelector('.button-modal');  
  const logoutBtn = document.querySelector('a[href="index.html"]');
  const loginLink = document.querySelector('a[href="login.html"]');

  if (token) {
    // Si le token est bien sotcké => on affiche les éléments du mode admin et efface "login"
    if (bandeau) bandeau.style.display = 'flex';
    if (buttonModal) buttonModal.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'none';

    // Fonction de déconnexion
    logoutBtn.addEventListener('click', () => {
      // si on veut sz déloguer on éfface le token lorsqu'on clique sur le bouton logout et on recharge la page d'accueil
      localStorage.removeItem('token');
      window.location.reload();
    });
  } else {
    // Si on n'est pas logué => page d'accueil normale => on masque les éléments admin et affiche "login"
    if (bandeau) bandeau.style.display = 'none';
    if (buttonModal) buttonModal.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline-block';
  };

// = GESTION DE LA MODALE =
// open-modal => bouton modifier
const openModalBtn = document.getElementById('open-modal');
//close-modal => croix sur la modal
const closeModalBtn = document.getElementById('close-modal');
// bloc modal 
const modal = document.getElementById('modal');

// Ouverture de la modale si on clique sur "modifier" et si modale existe
if (openModalBtn && modal) {
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

// Fermeture de la modale si on clique sur la X et si la modale existe
if (closeModalBtn && modal) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
 }
