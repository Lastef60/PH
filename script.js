document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    projets: document.querySelectorAll('input[name="projet"]'),
    salaries: document.querySelectorAll('input[name="salaries"]'),
    communaute: document.getElementById("communaute_commune"),
    age: document.querySelectorAll('input[name="age"]'),
    apport: document.querySelectorAll('input[name="apport"]'),
    statut: document.getElementById("statut"),
    indemnisations: document.querySelectorAll('input[name="indemnise"]'),
    francTravailRow: document.getElementById("franc_travail"),
    aidesList: document.getElementById("aidesList"),
    totalAides: document.getElementById("totalAides"),
    messageAideRow: document.getElementById("message-aide"),
    explicationAide: document.getElementById("explication-aide"),
    transmissionRow: document.getElementById("transmission")  // Nouvelle référence à la ligne de transmission
  };

  let aides = [];

  function ajouterAide(nom, montant) {
    aides.push({ nom, montant });
  }

  function mettreAJourAffichage() {
    elements.aidesList.innerHTML = "";
    let total = aides.reduce((sum, aide) => sum + aide.montant, 0);

    aides.forEach(({ nom, montant }) => {
      const aideElement = document.createElement("div");
      aideElement.textContent = `${nom}: ${montant}€`;
      elements.aidesList.appendChild(aideElement);
    });

    elements.totalAides.textContent = `${total}€`;
  }

  function afficherMessageAide(texte) {
    elements.explicationAide.innerHTML = texte;
    elements.messageAideRow.style.display = "table-row";
  }

  function cacherMessageAide() {
    elements.explicationAide.innerHTML = "";
    elements.messageAideRow.style.display = "none";
  }

  function verifierAides() {
    aides = [];
    cacherMessageAide();

    const projet = document.querySelector('input[name="projet"]:checked')?.value;
    const nbSal = document.querySelector('input[name="salaries"]:checked')?.value;
    const communauteValue = elements.communaute.value;
    const jeune = document.querySelector('input[name="age"]:checked')?.value === "18-29";
    const petitApport = document.querySelector('input[name="apport"]:checked')?.value === "0-10000";
    const enQPV = document.querySelector('input[name="phq"]:checked')?.value === "oui";
    const estIndemnise = document.querySelector('input[name="indemnise"]:checked')?.value === "oui";
    const inscritFT24 = document.querySelector('input[name="franc_travail"]:checked')?.value === "oui";
    const transmission = document.querySelector('input[name="transmission"]:checked')?.value; // Nouvelle variable pour la transmission

    let montantIOS = 0,
      montantBPI = 0;

    // Vérification pour afficher la question "Transmission" si projet = "reprise"
    if (projet === "reprise") {
      elements.transmissionRow.style.display = "table-row";  // Affichage de la question de transmission
    } else {
      elements.transmissionRow.style.display = "none";  // Masquer la question de transmission si ce n'est pas une reprise
    }

      // Masquer la question indemnisation si le porteur de projet est en QPV
  if (enQPV) {
    document.getElementById("indemnise").style.display = "none";
  } else {
    document.getElementById("indemnise").style.display = "table-row";
  }

    if (projet === "creation") {
      const montantCreation = {
        "0-3": { ios: 5500, bpi: 2500 },
        "4-10": { ios: 10000, bpi: 5000 },
        "11+": { ios: 16700, bpi: 8300 }
      };

      if (montantCreation[nbSal]) {
        montantIOS = montantCreation[nbSal].ios;
        montantBPI = montantCreation[nbSal].bpi;
      }
    } else if (projet === "reprise") {
      const montantReprise = {
        "0-3": { ios: 4000, bpi: 4000 },
        "4-10": { ios: 7500, bpi: 7500 },
        "11+": { ios: 12500, bpi: 12500 }
      };

      if (montantReprise[nbSal]) {
        montantIOS = montantReprise[nbSal].ios;
        montantBPI = montantReprise[nbSal].bpi;
      }

      // Ajout de l'aide de transmission si la réponse est "oui"
      if (transmission === "oui") {
        const montantTransmission = 0.5 * (montantIOS + montantBPI);
        ajouterAide("Transmission", montantTransmission);
      }
    }

    if (projet === "croissance") {
      elements.aidesList.innerHTML = "<strong>Merci de contacter Initiative Oise Sud au 03.44.24.05.63 ou nogentsuroise@initiative-oise.fr</strong>";
      elements.totalAides.textContent = "N/A";
      return;
    }

    ajouterAide("PH IOS", montantIOS);
    ajouterAide("PH BPI", montantBPI);

    if (communauteValue === "CCAC") {
      ajouterAide("Solicitation Bonification CCAC", 0.7 * (montantIOS + montantBPI));
    }

    if (jeune) {
      document.getElementById("montant-apport").style.display = "table-row";
      if (petitApport) ajouterAide("Fonds Jeune", 4000);
    } else {
      document.getElementById("montant-apport").style.display = "none";
    }

    if (enQPV) {
      ajouterAide("PH BPI Quartier", 7000);
      afficherMessageAide(
        "Pour bénéficier de ce prêt, la caution personnelle et solidaire sur le prêt bancaire ne doit pas excéder 50% frais et accessoires inclus"
      );
    } else if (elements.statut.value === "ft") {
      document.getElementById("indemnise").style.display = "table-row";
      elements.francTravailRow.style.display = estIndemnise ? "none" : "table-row";
      if (estIndemnise || inscritFT24) {
        ajouterAide("PH BPI Solidaire", 7000);
        afficherMessageAide(
          "Pour bénéficier de ce prêt, la caution personnelle et solidaire sur le prêt bancaire ne doit pas excéder 50% frais et accessoires inclus"
        );
      }
    } else {
      document.getElementById("indemnise").style.display = "none";
      elements.francTravailRow.style.display = "none";
    }

    mettreAJourAffichage();
  }

  elements.statut.addEventListener("change", () => {
    document.getElementById("indemnise").style.display = elements.statut.value === "ft" ? "table-row" : "none";
    elements.francTravailRow.style.display = "none";
  });

  document.querySelectorAll("input, select").forEach((el) => el.addEventListener("change", verifierAides));

  elements.francTravailRow.style.display = "none";
  verifierAides();
});
