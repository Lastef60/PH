document.addEventListener("DOMContentLoaded", function () {
  const projets = document.querySelectorAll('input[name="projet"]');
  const salaries = document.querySelectorAll('input[name="salaries"]');
  const transmission = document.querySelectorAll('input[name="transmission"]');
  const communaute = document.getElementById("communaute_commune");
  const age = document.querySelectorAll('input[name="age"]');
  const apport = document.querySelectorAll('input[name="apport"]');
  const statut = document.getElementById("statut");
  const indemnisations = document.querySelectorAll('input[name="indemnise"]');
  const francTravailRow = document.getElementById("franc_travail"); // Ligne de la case "Inscrit à France Travail ?"
  
  const aidesList = document.getElementById("aidesList");
  const totalAides = document.getElementById("totalAides");

  let aides = [];

  function ajouterAide(nom, montant) {
    aides.push({ nom, montant });
    mettreAJourAffichage();
  }

  function mettreAJourAffichage() {
    let total = 0;
    aidesList.innerHTML = "";
    aides.forEach(aide => {
      total += aide.montant;
      const aideElement = document.createElement("div");
      aideElement.textContent = `${aide.nom}: ${aide.montant}€`;
      aidesList.appendChild(aideElement);
    });
    totalAides.textContent = `${total}€`;
  }

  function verifierAides() {
    aides = [];
    let projet = document.querySelector('input[name="projet"]:checked')?.value;
    let nbSal = document.querySelector('input[name="salaries"]:checked')?.value;
    let estTransmission = document.querySelector('input[name="transmission"]:checked')?.value === "oui";
    let communauteValue = communaute.value;
    let jeune = document.querySelector('input[name="age"]:checked')?.value === "18-29";
    let petitApport = document.querySelector('input[name="apport"]:checked')?.value === "0-10000";
    let enQPV = document.querySelector('input[name="phq"]:checked')?.value === "oui";
    let estIndemnise = document.querySelector('input[name="indemnise"]:checked')?.value === "oui";
    let inscritFT24 = document.querySelector('input[name="franc_travail"]:checked')?.value === "oui";

    let montantIOS = 0;
    let montantBPI = 0;

    if (projet && nbSal) {
      if (projet === "creation") {
        montantIOS = nbSal === "0-3" ? 5500 : nbSal === "4-10" ? 10000 : 16700;
        montantBPI = nbSal === "0-3" ? 2500 : nbSal === "4-10" ? 5000 : 8300;
      } else if (projet === "reprise") {
        montantIOS = nbSal === "0-3" ? 4000 : nbSal === "4-10" ? 7500 : 12500;
        montantBPI = montantIOS;
        document.getElementById("transmission").style.display = "table-row";
        if (estTransmission) {
          ajouterAide("Fonds Prêt Transmission", montantIOS * 0.5);
        }
      } else if (projet === "developpement") {
        montantIOS = nbSal === "0-3" ? 5500 : nbSal === "4-10" ? 10000 : 16700;
        montantBPI = nbSal === "0-3" ? 2500 : nbSal === "4-10" ? 5000 : 8300;
      }

      ajouterAide("PH IOS", montantIOS);
      ajouterAide("BPI", montantBPI);
    }

    // Ajout de "Solicitation Bonification CCAC" si CCAC est sélectionné
    if (communauteValue === "CCAC") {
      let montantCCAC = 0.7 * (montantIOS + montantBPI);
      ajouterAide("Solicitation Bonification CCAC", montantCCAC);
    }

    // Affichage du Fonds Jeune
    if (jeune) {
      document.getElementById("montant-apport").style.display = "table-row";
      if (petitApport) {
        ajouterAide("Fonds Jeune", 4000);
      }
    } else {
      document.getElementById("montant-apport").style.display = "none";
    }

    // Vérification si le Prêt Quartier est sélectionné
    if (enQPV) {
      ajouterAide("Prêt Honneur BPI Quartier", 7000);
    } else {
      // Si Prêt Quartier n'est pas sélectionné, ajouter le PHS
      if (statut.value === "ft") {
        document.getElementById("indemnise").style.display = "table-row"; // Afficher "Êtes-vous indemnisé ?"

        if (estIndemnise) {
          francTravailRow.style.display = "none"; // Cacher "Inscrit à France Travail"
          ajouterAide("PHS", 7000);
        } else {
          francTravailRow.style.display = "table-row"; // Afficher "Inscrit à France Travail depuis plus de 24 mois ?" uniquement si indemnisé = NON
          if (inscritFT24) {
            ajouterAide("PHS", 7000);
          }
        }
      } else {
        document.getElementById("indemnise").style.display = "none";
        francTravailRow.style.display = "none";
      }
    }

    // Vérification spéciale : cacher la ligne "Inscrit à France Travail ?" si "Indemnisé" n'est pas coché
    if (statut.value !== "ft" || estIndemnise) {
      francTravailRow.style.display = "none";
    }

    mettreAJourAffichage();
  }

  // Gestion du changement de statut pour afficher les bonnes cases
  statut.addEventListener("change", function () {
    if (statut.value === "ft") {
      // Afficher "Êtes-vous indemnisé ?"
      document.getElementById("indemnise").style.display = "table-row";
      francTravailRow.style.display = "none"; // Cacher "Inscrit à France Travail"

      // Si "Indemnisé" est coché NON, afficher la case "Inscrit à France Travail"
      if (document.querySelector('input[name="indemnise"]:checked')?.value === "non") {
        francTravailRow.style.display = "table-row"; // Afficher la case
      }
    } else {
      // Masquer les sections liées à France Travail
      document.getElementById("indemnise").style.display = "none";
      francTravailRow.style.display = "none";
    }
  });

  // Écouter le changement sur tous les éléments du formulaire
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("change", verifierAides);
  });

  // Masquer la ligne "Inscrit à France Travail ?" au chargement
  francTravailRow.style.display = "none";
});
