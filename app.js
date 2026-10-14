// Finance Vauto — catalogue alimenté par l'API publique de l'application.
// Une seule source de données : les véhicules publiés dans l'app apparaissent ici.
const API = "https://vehicle-share-25.emergent.host/api/public/vehicles";
const TEL = "+14188007579";
const TEL_AFFICHE = "+1 418-800-7579";

const fmt = n => {
  const v = Number(n);
  if (!isFinite(v) || v <= 0) return null;
  return v.toLocaleString("fr-CA") + " $";
};
const prixVente = v => fmt(v.prix_vente);
const prixJour = v => fmt(v.daily_rate);

async function chargerVehicules() {
  const r = await fetch(API);
  if (!r.ok) throw new Error("API " + r.status);
  const d = await r.json();
  const items = Array.isArray(d) ? d : (d.items || d.vehicles || []);
  return items.filter(v => v.actif !== false);
}

function carteVehicule(v) {
  const pv = prixVente(v);
  const pj = prixJour(v);
  const photo = (v.photos && v.photos[0]) || "";
  const prixZone = pv
    ? `<div><div class="prix-vente"><small>Prix de vente</small>${pv}</div></div>
       <div><div class="prix-jour"><small>ou location</small>${pj ? pj + " /jour" : ""}</div></div>`
    : `<div></div><div><div class="prix-jour"><small>Location</small>${pj ? pj + " /jour" : "Sur demande"}</div></div>`;
  return `<article class="carte">
    <a class="photo" href="vehicule.html?slug=${encodeURIComponent(v.slug)}">
      ${photo ? `<img src="${photo}" alt="${v.marque} ${v.modele} ${v.annee}" loading="lazy">` : ""}
      <span class="badge annee">${v.annee}</span>
      ${v.transmission ? `<span class="badge trans">${v.transmission}</span>` : ""}
      ${pv ? `<span class="badge vente">À vendre</span>` : ""}
    </a>
    <div class="corps">
      <div class="marque">${v.marque || ""}</div>
      <div class="modele">${v.modele || ""}</div>
      <div class="ville">📍 ${v.public_location_label || v.ville || ""}</div>
      <div class="specs">
        ${v.places ? `<span>👥 ${v.places} places</span>` : ""}
        ${v.transmission ? `<span>⚙️ ${v.transmission}</span>` : ""}
        ${v.carburant ? `<span>⛽ ${v.carburant}</span>` : ""}
      </div>
      <div class="prixzone">${prixZone}</div>
      <a class="btn voir" href="vehicule.html?slug=${encodeURIComponent(v.slug)}">Voir le véhicule</a>
    </div>
  </article>`;
}

function messageErreur(zone) {
  zone.innerHTML = `<div class="message">Inventaire momentanément indisponible.<br>Appelez-nous au <a href="tel:${TEL}"><b>${TEL_AFFICHE}</b></a> — on vous aide tout de suite.</div>`;
}
