document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    projets: document.querySelectorAll('input[name="projet"]'),
    salaries: document.querySelectorAll('input[name="salaries"]'),
    transmission: document.querySelectorAll('input[name="transmission"]'),
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
    const estTransmission = document.querySelector('input[name="transmission"]:checked')?.value === "oui";
    const communauteValue = elements.communaute.value;
    const jeune = document.querySelector('input[name="age"]:checked')?.value === "18-29";
    const petitApport = document.querySelector('input[name="apport"]:checked')?.value === "0-10000";
    const enQPV = document.querySelector('input[name="phq"]:checked')?.value === "oui";
    const estIndemnise = document.querySelector('input[name="indemnise"]:checked')?.value === "oui";
    const inscritFT24 = document.querySelector('input[name="franc_travail"]:checked')?.value === "oui";

    let montantIOS = 0, montantBPI = 0;

    if (projet) {
      if (projet === "reprise") {
        document.getElementById("transmission").style.display = "table-row";
        montantIOS = [4000, 7500, 12500][["0-3", "4-10", ">10"].indexOf(nbSal)] || 0;
      } else if (projet === "croissance") {
        elements.aidesList.innerHTML = "<strong>Contacter Initiative Oise Sud</strong>";
        elements.totalAides.textContent = "N/A";
        return;
      } else {
        montantIOS = [5500, 10000, 16700][["0-3", "4-10", ">10"].indexOf(nbSal)] || 0;
      }
      montantBPI = montantIOS;
      ajouterAide("PH IOS", montantIOS);
      ajouterAide("BPI", montantBPI);

      if (estTransmission) {
        ajouterAide("Fonds Prêt Transmission", montantIOS * 0.5);
      }
    }

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
      ajouterAide("Prêt Honneur BPI Quartier", 7000);
      afficherMessageAide("Pour beneficier de ce prêt, la caution personnelle et solidaire sur le prêt bancaire ne doit pas exceder 50% fais et accesoires inclus");
    } else if (elements.statut.value === "ft") {
      document.getElementById("indemnise").style.display = "table-row";
      elements.francTravailRow.style.display = estIndemnise ? "none" : "table-row";
      if (estIndemnise || inscritFT24) {
        ajouterAide("PHS", 7000);
        afficherMessageAide("Pour beneficier de ce prêt, la caution personnelle et solidaire sur le prêt bancaire ne doit pas exceder 50% fais et accesoires inclus");
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

  document.querySelectorAll("input, select").forEach(el => el.addEventListener("change", verifierAides));

  elements.francTravailRow.style.display = "none";
  verifierAides();
});
