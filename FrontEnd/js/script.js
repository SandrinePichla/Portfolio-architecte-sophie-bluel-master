// Sélectionner l'élément où on va afficher les projets
const gallery = document.querySelector(".gallery");

// Fonction pour récupérer les travaux depuis l'API
async function getWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();
  
      // 🧪 TEST : Affiche les données dans la console
      console.log("Travaux récupérés :", works);
  
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
      console.error("Erreur lors du chargement des travaux :", error);
    }
  }

// Appel de la fonction
getWorks();