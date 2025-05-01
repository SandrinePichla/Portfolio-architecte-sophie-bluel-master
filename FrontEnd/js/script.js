// Je sélectionne l'élément où on va afficher les projets => dans la class gallery
const gallery = document.querySelector(".gallery");

// Fonction pour récupérer les travaux depuis l'API
// Fonction async pour attendre que les operations soient terminees
async function getWorks() {
  // fonction try ... catch pour voir s'il y a des erreurs ; fetch envoi une requete à l'url de l'API
  // await attend la reponse de l'api avant de continuer
  // la reponse sera en format .json dans la constante works
    try {
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();
  
      //  TEST : Affiche les données dans la console
      console.log("Tous les travaux sont récupérés :", works);
  
      // (Tu peux laisser le reste du code pour afficher après)
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
    } catch (error) {
      console.error("Afficher un message d'erreur lors du chargement des travaux :", error);
    }
  }

// Appel de la fonction
getWorks();

