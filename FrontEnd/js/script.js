// Affichage des projets (galerie principale)  
// Fonction	getWorks()
const gallery = document.querySelector(".gallery");
// Je selectionne ma filter-bar
const filtersContainer = document.querySelector(".filter-bar"); 
 
// == 1 == getworks pour récupérer les travaux depuis l'API => async pour attendre que les operations soient terminees
async function getWorks() {
    // fonction try ... catch
    // await attend la reponse de l'api avant de continuer
    // Je récupère les projets depuis l’API :
      try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json(); // conversion en JSON
                          
        // je vide la galerie des anciens travaux   
        gallery.innerHTML = ""; 
    
        // je génère mes projets et je les raccroche aux dossiers parents
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

        // Je génère des catégories uniques
          const uniqueCategories = []; // création d'un tableau vide pour stocker les catégories
          works.forEach(work => {
            const categoryName = work.category.name; // Pour chaque projet, on va chercher le nom de la catégorie
            if (!uniqueCategories.includes(categoryName)) {
              uniqueCategories.push(categoryName); // Si cette catégorie n’est pas encore dans notre tableau, on l’ajoute.
            }
          });

          // On nettoie la gallerie
          filtersContainer.innerHTML = "";
          
          // -- Création des boutons de filtre ---
          // Création du bouton tous = affichage par defaut de tous les projets
          const allButton = document.createElement("button"); // on crée le bouton HTML
          allButton.className = "filter-btn active"; // classe + active = selectionné
          allButton.dataset.category = "Tous"; // on stocke la catégorie dans le html du bouton (non-visible)
          allButton.textContent = "Tous"; // on note le nom de la catégorie sur le bouton (visible)
          filtersContainer.appendChild(allButton); // on le raccroche au dossier parent 

          // puis on crée un bouton pour chaque catégorie, comme pour le bouton "tous" :
          uniqueCategories.forEach(category => {
            const button = document.createElement("button");
            button.className = "filter-btn";
            button.dataset.category = category; // on stocke le nom de la catégorie (non-visible)
            button.textContent = category; //on note le nom de la catégorie sur le bouton (visible)
            filtersContainer.appendChild(button);
          });

          // je récupère tous les boutons qui ont la classe filter-btn
          const allButtons = document.querySelectorAll(".filter-btn");

          //-- GESTION DES FILTRES --          
          // j'ecoute le click sur chaque bouton
          allButtons.forEach(button => {
            button.addEventListener("click", () => { 
              const selectedCategory = button.dataset.category; // on repere la categorie cliquée
              // on enleve la classe active pour tous les boutons
              allButtons.forEach(btn => btn.classList.remove("active"));
              // on ajoute la classe active sur celui qu'on a cliqué
              button.classList.add("active");

              // --- Affichage filtré ---
              // boutons "tous" => on les affiche tous (ternaire)
              const filteredWorks = selectedCategory === "Tous"
                ? works
              // sinon .filter pour garder la bonne catégorie
                : works.filter(work => work.category.name === selectedCategory);

              // on vide la gallery
              gallery.innerHTML = "";

              // Pour chaque projet filtré , on recrée les balises et on les ajoute dans la galerie comme dans getWorks
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

        // == 2 == Fonction displayModalGallery - Affichage les photos dans la modale
        displayModalGallery(works);

      // et si on a un problème, un message d'erreur s'affiche :
      } catch (error) {
        console.error("Afficher un message d'erreur lors du chargement des travaux :", error);
      }      
    } 
// Appel de la fonction getWorks
getWorks(); 

// == 2 == GESTION DU MODE ADMIN =
  const token = localStorage.getItem('token'); //Stockage du token  

  const bandeau = document.querySelector('.bandeau');
  const buttonModal = document.querySelector('.button-modal');  
  const logoutBtn = document.querySelector('.lougout-page');
  const loginLink = document.querySelector('.login-page');                                 
  
  if (token) {
    // Si le token est bien sotcké => on affiche les éléments du mode admin et efface "login"
    if (bandeau) bandeau.style.display = 'flex';
    if (buttonModal) buttonModal.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'none';    // login caché
    if(filtersContainer) filtersContainer.style.display = 'none' ; // barre filtre cachée


    // == 3 ==  logoutBtn Fonction de déconnexion
    logoutBtn.addEventListener('click', () => {
      // si on veut sz déloguer on éfface le token lorsqu'on clique sur le bouton logout et on recharge la page d'accueil
      localStorage.removeItem('token');
      window.location.reload();
    });
  } else {
    // Si on n'est pas logué => page d'accueil normale => on masque les éléments admin et affiche "login"
    if (bandeau) bandeau.style.display = 'none';  // Bandeau caché
    if (buttonModal) buttonModal.style.display = 'none';  // Bouton ouverture modale caché
    if (logoutBtn) logoutBtn.style.display = 'none';  // Bouton logout caché
    if (loginLink) loginLink.style.display = 'inline-block'; // bouton login visible
  };

//= MODALE UNIQUE AVEC DEUX VUES  =
// open-modal => clique sur bouton "modifier"
const openModalBtn = document.getElementById('open-modal');
// bloc modal 
const modal = document.getElementById('modal');
//close-modal => croix sur la modal
const closeModalBtn = document.getElementById('close-modal');

// == 4 == openModalBtn - Ouverture de la modale si on clique sur "modifier" et si modale existe
if (openModalBtn && modal) {
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex'; // modale vue 1 visible

    // loadGallery OUVERTURE FENETRE PRINCIPALE
    document.getElementById("modal-gallery-view").style.display = "block";
    document.getElementById("modal-photo").classList.add('hidden'); // partie vue 2 cachée

    loadGallery();
});
}
// == 5 == closeModalBtn - Fermeture de la modale si on clique sur la X et si la modale existe
if (closeModalBtn && modal) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Modale vue 1 cachée
  });
 }
    
// == 6 == displayModalGallery => Afficher les projets dans la modale
function displayModalGallery(works) {
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = ""; // On vide d'abord

// On crée les éléments : 
  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

//  On crée l'icone poubelle
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can delete-icon";

// J'écoute le clic sur la corbeille + windows.confirm
    deleteIcon.addEventListener("click", () => {
      const confirmed = window.confirm("Supprimer ce projet ?");
      if (confirmed) {
        deleteWork(work.id);
      }
    });

    figure.appendChild(img);
    figure.appendChild(deleteIcon);
    modalGallery.appendChild(figure);
  });
}

// == 7 == Fonction loadGallery Charger les projets depuis l'API et les afficher
async function loadGallery() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    displayModalGallery(works);
  } catch (error) {
    console.error("Erreur lors du chargement des travaux :", error);
  }
}

// == 8 == deleteWork - Supprime un projet via l'API en fonction de son ID
async function deleteWork(workId) {
  try {
    const token = localStorage.getItem("token"); // On récupère le token
// Requête vers l'URL qui contient l'ID à supp
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}` // envoi le token dans l'en-tête
      }
    });

    if (response.ok) {      
      loadGallery(); // Mise à jour immédiate de la galerie
      getWorks(); // mise à jour des projets
    } else {
      console.error("Échec de la suppression :", response.status);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// DEUXIEME VUE => AJOUT DE PHOTOS :
const openSecondModalBtn = document.querySelector('#add-photo'); // bouton "Ajouter une photo" => ouverture de la 2ème vue
const modalPhoto = document.querySelector('#modal-photo');
const closePhotoModal = modalPhoto.querySelector('#close-photo-modal');

// == 9 == openSecondModalBtn - On écoute le click sur le bouton "Ajouter une photo"
openSecondModalBtn.addEventListener('click', () => {
  document.getElementById("modal-gallery-view").style.display = "none";
  modalPhoto.classList.remove('hidden');
  loadCategories(); //  on appelle la fonction ici à chaque ouverture
});

// == 10 == resetAddPhotoForm() FONCTION REINITIALISATION AJOUT PHOTO
function resetAddPhotoForm() {
  titleInput.value = '';    // 1. Vider les champs texte
  categorySelect.selectedIndex = 0;  
  fileInput.value = '';  // 2. Réinitialiser l'input fichier
  previewImage.src = '';  // 3. Masquer la prévisualisation d’image
  previewImage.style.display = 'none';
  uploadLabel.style.display = '';  // 5 Réaffiche le "label"
}

// Flèche retour vers la première vue
const backToGalleryBtn = document.getElementById('back-to-gallery');
const titleInput = document.getElementById('title');
// == 11 == backToGalleryBtn - On écoute le clique sur la flèche retour
  backToGalleryBtn.addEventListener('click', () => {
    // 1. Afficher la vue galerie, cacher la vue "Ajout photo" :
    document.getElementById("modal-gallery-view").style.display = "block"; // on affiche la galerie
    modalPhoto.classList.add('hidden'); //  on masque la modale d'ajout de photo 

    resetAddPhotoForm() // On réinitialise le formulaire d'ajout de photos

    loadGallery();     //  on recharge les projets dans la modale si besoin
  });

// == 12 == closePhotoModal On écoute le clique sur la croix
closePhotoModal.addEventListener('click', () => {
  modal.style.display = 'none'; // on ferme toute la modale

  resetAddPhotoForm() // On réinitialise le formulaire d'ajout de photos
});

// Fermer la modale quand on clique EN DEHORS de la fenêtre modale
modal.addEventListener('click', (event) => {
  // == 13 == clic sur le fond de la modale : 
  if (event.target === modal) {
    modal.style.display = 'none'// Modale vue  fermée

    // Réinitialise les champs si on venait de la vue "ajout photo"
    modalPhoto.classList.add('hidden');
    document.getElementById("modal-gallery-view").style.display = "block";

    // Réinitialise les champs
    resetAddPhotoForm()
  }
});

// Prévisualisation de l'image uploadée
const fileInput = document.getElementById("file-input");
const previewImage = document.getElementById("image-preview");
const uploadLabel = document.getElementById("upload-label");
// == 14 == Affiche l'aperçu de l'image choisie
fileInput.addEventListener("change", function () {
  const file = this.files[0];
// fileReader affiche l'image si l'image est sélectionnée 
  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // Affiche l’image dans l’aperçu
      previewImage.setAttribute("src", this.result);
      previewImage.style.display = "block";

      // Masque l’icône et le texte =  cache le label
      uploadLabel.style.display = "none";
    });

    reader.readAsDataURL(file); // readAsDataURL lit le contenu du fichier
  } else {
    // Réinitialisation si aucun fichier sélectionné
    previewImage.style.display = "none";
    previewImage.setAttribute("src", "");
    uploadLabel.style.display = "block";
  }
});

// Validation de l'image uploadée 
const validateBtn = document.querySelector(".btn-validate");
// == 15 == on écoute le click sur le bouton validation
validateBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // empêche le comportement par défaut de la page

  // On récupère les éléments du formulaire :
  const imageInput = document.getElementById("file-input"); //champ où est uploadée l’image
  const titleInput = document.getElementById("title"); // champ texte du titre
  const categorySelect = document.getElementById("category"); // menu déroulant des catégories
  
  // On récupère les valeurs saisies :
  const file = imageInput.files[0];  // le fichier image sélectionné
  const title = titleInput.value.trim(); // le titre saisi .trim() = enlève les espaces
  const category = categorySelect.value; //  l'ID de la catégorie

  if (!file || !title || !category) { // Si l’un des trois champs est vide => alerte
    alert("Merci de remplir tous les champs !");
    return; // fin de l'éxecution
  }
  // FormData => envoi du formulaire
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  const token = localStorage.getItem("token"); // vérifie qu'on stocke le token
// Appel à l'API pour envoi des données POST
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, // envoi le token dans l'en-tête
      },
      body: formData, // le contenu de la requête contient tout le formData (image, titre, catégorie)
    });
// Si l'envoi du formulaire est OK 
    if (response.ok) {
      alert("Projet ajouté avec succès !");  

       resetAddPhotoForm() // On réinitialise le formulaire d'ajout de photos

       // Retour à la galerie
       modalPhoto.classList.add('hidden'); // masque la 2ème vue
       document.getElementById("modal-gallery-view").style.display = "block";

       loadGallery();  // recharge la galerie dans la modale

       getWorks(); // Recharge la galerie principale après ajout

     } else {
       alert("Erreur lors de l’ajout du projet.");
     }
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue.");
  }
});

// == 16 == Fonction loadCategories() remonte les catégories dans le menu déroulant de la 2ème modale
const categorySelect = document.getElementById("category");

async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    // Réinitialise le contenu 
    categorySelect.innerHTML = '<option value=""></option>';

    // Ajoute dynamiquement chaque catégorie
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);      
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
    categorySelect.innerHTML = '<option value="">Erreur de chargement</option>';
  }
}

const checkFormFields = () => {
  const submitBtn = document.querySelector(".btn-validate");
  const fileFilled = fileInput.files.length > 0;
  const titleFilled = titleInput.value.trim() !== "";
  const categoryFilled = categorySelect.value !== "";

  if (fileFilled && titleFilled && categoryFilled) {
    submitBtn.style.backgroundColor = "#1D6154";
  } else {
    submitBtn.style.backgroundColor = "";
  }
};


fileInput.addEventListener("change", checkFormFields);
titleInput.addEventListener("input", checkFormFields);
categorySelect.addEventListener("change", checkFormFields);
