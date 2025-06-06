// Affichage des projets (galerie principale)  
// Fonction	getWorks()
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filter-bar"); 
 
// == 1 == getworks pour récupérer les travaux depuis l'API 
async function getWorks() {
    
      try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json(); 
         
        gallery.innerHTML = ""; 
    
        // je génère mes projets
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
          const uniqueCategories = []; 
          works.forEach(work => {
            const categoryName = work.category.name; 
            if (!uniqueCategories.includes(categoryName)) {
              uniqueCategories.push(categoryName); 
            }
          });
          
          filtersContainer.innerHTML = "";
          
          // -- Création des boutons de filtre ---

          // Création du bouton tous = affichage par defaut de tous les projets
          const allButton = document.createElement("button"); 
          allButton.className = "filter-btn active"; 
          allButton.dataset.category = "Tous"; 
          allButton.textContent = "Tous"; 
          filtersContainer.appendChild(allButton); 

          // puis on crée un bouton pour chaque catégorie, comme pour le bouton "tous" :
          uniqueCategories.forEach(category => {
            const button = document.createElement("button");
            button.className = "filter-btn";
            button.dataset.category = category; 
            button.textContent = category; 
            filtersContainer.appendChild(button);
          });
          
          //-- GESTION DES FILTRES -- 
          const allButtons = document.querySelectorAll(".filter-btn");  
          
          allButtons.forEach(button => {
            button.addEventListener("click", () => { 
              const selectedCategory = button.dataset.category; // on repere la categorie cliquée              
              allButtons.forEach(btn => btn.classList.remove("active"));             
              button.classList.add("active");

              // --- Affichage filtré ---
              // boutons "tous" => on les affiche tous (ternaire)
              const filteredWorks = selectedCategory === "Tous"
                ? works
              // sinon .filter pour garder la bonne catégorie
                : works.filter(work => work.category.name === selectedCategory);
             
              gallery.innerHTML = "";

              // Pour chaque projet filtré , on recrée les balises = getworks
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
      
      } catch (error) {
        console.error("Afficher un message d'erreur lors du chargement des travaux :", error);
        }      
    } 

// Appel de la fonction getWorks
getWorks(); 

// == 2 == GESTION DU MODE ADMIN =
  // Adaptation Page accueil => administrateur : 
const token = localStorage.getItem('token');   
const bandeau = document.querySelector('.bandeau'); 
const logoutBtn = document.querySelector('.lougout-page');
const loginLink = document.querySelector('.login-page');
const buttonModal = document.querySelector('.button-modal');                                  
  
  if (token) {    
    if (bandeau) bandeau.style.display = 'flex';    
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'none';  
    if (buttonModal) buttonModal.style.display = 'flex';
    if(filtersContainer) filtersContainer.style.display = 'none' ; 


    // == 3 ==  logoutBtn Fonction de déconnexion
    logoutBtn.addEventListener('click', () => {     
      localStorage.removeItem('token');
      window.location.reload();
    });
  } else {    
    if (bandeau) bandeau.style.display = 'none';    
    if (logoutBtn) logoutBtn.style.display = 'none';  
    if (loginLink) loginLink.style.display = 'inline-block'; 
    if (buttonModal) buttonModal.style.display = 'none'; 
  };

//= MODALE UNIQUE AVEC DEUX VUES  =
// open-modal => clique sur bouton "modifier"
const openModalBtn = document.getElementById('open-modal');
// bloc modal 
const modal = document.getElementById('modal');
//close-modal => croix sur la modal
const closeModalBtn = document.getElementById('close-modal');

// == 4 == openModalBtn - clique sur "modifier"
if (openModalBtn && modal) {
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';

    // loadGallery OUVERTURE FENETRE PRINCIPALE
    document.getElementById("modal-gallery-view").style.display = "block";
    document.getElementById("modal-photo").classList.add('hidden');

    loadGallery();
});
}
// == 5 == closeModalBtn 
if (closeModalBtn && modal) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'; 
  });
 }
    
// == 6 == displayModalGallery => Afficher les projets dans la modale
function displayModalGallery(works) {
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = "";


  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

//  icone poubelle
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can delete-icon";

// clic corbeille
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

// == 7 == loadGallery Charger les projets depuis l'API et les afficher
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
      loadGallery();
      getWorks(); 
    } else {
      console.error("Échec de la suppression :", response.status);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// DEUXIEME VUE => AJOUT DE PHOTOS :
const openSecondModalBtn = document.querySelector('#add-photo');
const modalPhoto = document.querySelector('#modal-photo');
const closePhotoModal = modalPhoto.querySelector('#close-photo-modal');

// == 9 == openSecondModalBtn - On écoute le click sur le bouton "Ajouter une photo"
openSecondModalBtn.addEventListener('click', () => {
  document.getElementById("modal-gallery-view").style.display = "none";
  modalPhoto.classList.remove('hidden');
  loadCategories();
});

// == 10 == resetAddPhotoForm() FONCTION REINITIALISATION AJOUT PHOTO
function resetAddPhotoForm() {
  titleInput.value = '';   
  categorySelect.selectedIndex = 0;  
  fileInput.value = ''; 
  previewImage.src = '';  
  previewImage.style.display = 'none';
  uploadLabel.style.display = ''; 
}

const backToGalleryBtn = document.getElementById('back-to-gallery');
const titleInput = document.getElementById('title');
// == 11 == backToGalleryBtn 
  backToGalleryBtn.addEventListener('click', () => {    
    document.getElementById("modal-gallery-view").style.display = "block"; 
    modalPhoto.classList.add('hidden'); 

    resetAddPhotoForm()

    loadGallery();
  });

// == 12 == closePhotoModal On écoute le clique sur la croix
closePhotoModal.addEventListener('click', () => {
  modal.style.display = 'none'; 

  resetAddPhotoForm() 
});

// Fermer la modale quand on clique EN DEHORS de la fenêtre modale
modal.addEventListener('click', (event) => {
  // == 13 == clic sur le fond de la modale : 
  if (event.target === modal) {
    modal.style.display = 'none'    
    modalPhoto.classList.add('hidden');
    document.getElementById("modal-gallery-view").style.display = "block";
  
    resetAddPhotoForm()
  }
});

const fileInput = document.getElementById("file-input");
const previewImage = document.getElementById("image-preview");
const uploadLabel = document.getElementById("upload-label");
// == 14 == Affiche l'aperçu de l'image choisie
fileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // Affiche l’image dans l’aperçu
      previewImage.setAttribute("src", this.result);
      previewImage.style.display = "block";      
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

// Validation du formulaire
const validateBtn = document.querySelector(".btn-validate");
// == 15 == click bouton validation
validateBtn.addEventListener("click", async (e) => {
  e.preventDefault(); 

  // On récupère les éléments du formulaire :
  const imageInput = document.getElementById("file-input");
  const titleInput = document.getElementById("title"); 
  const categorySelect = document.getElementById("category");
  
  // On récupère les valeurs saisies :
  const file = imageInput.files[0]; 
  const title = titleInput.value.trim(); 
  const category = categorySelect.value; 

  if (!file || !title || !category) { 
    alert("Merci de remplir tous les champs !");
    return; 
  }
  //-- FormData 
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
      },
      body: formData, // le formData contient tout le contenu de la requête
    });

// Si l'envoi du formulaire est OK 
    if (response.ok) {
      alert("Projet ajouté avec succès !");  

       resetAddPhotoForm() 

       // Retour à la galerie
       modalPhoto.classList.add('hidden'); 
       document.getElementById("modal-gallery-view").style.display = "block";

       loadGallery(); 

       getWorks();

     } else {
       alert("Erreur lors de l’ajout du projet.");
     }
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue.");
  }
});

// == 16 == loadCategories() remonte les catégories dans le menu déroulant de la 2ème modale
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

// == 17 == Vérifie si tous les chmaps sont remplis = active bouton validation
const checkFormFields = () => {
  const validateBtn = document.querySelector(".btn-validate");
  const fileFilled = fileInput.files.length > 0; 
  const titleFilled = titleInput.value.trim() !== ""; 
  const categoryFilled = categorySelect.value !== ""; 

  if (fileFilled && titleFilled && categoryFilled) {
    validateBtn.style.backgroundColor = "#1D6154"; // si tout est OK chgt couleur du bouton
  } else {
    validateBtn.style.backgroundColor = "";
  }
};
// écoute des évenemnts => recharge checkFormFields
fileInput.addEventListener("change", checkFormFields);
titleInput.addEventListener("input", checkFormFields);
categorySelect.addEventListener("change", checkFormFields); 
