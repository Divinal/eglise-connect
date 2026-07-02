// Ordre hiérarchique standard des fonctions de bureau au sein de l'EEC.
// Les entrées les plus spécifiques doivent précéder les plus génériques
// (ex: "vice-président" avant "président" ferait un mauvais matching sinon).
const ROLE_ORDER = [
  "président fondateur",
  "président d'honneur",
  "président",
  "1er vice-président",
  "premier vice-président",
  "2e vice-président",
  "deuxième vice-président",
  "vice-président",
  "secrétaire général adjoint",
  "secrétaire général",
  "secrétaire adjoint",
  "secrétaire",
  "trésorier général adjoint",
  "trésorier général",
  "trésorier adjoint",
  "trésorier",
  "commissaire aux comptes",
  "conseiller",
  "assesseur",
  "censeur",
  "porte-parole",
  "chargé",
  "responsable",
  "membre",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const NORMALIZED_ROLE_ORDER = ROLE_ORDER.map(normalize);

export function roleRank(fonction: string | null | undefined): number {
  if (!fonction) return NORMALIZED_ROLE_ORDER.length + 1;
  const f = normalize(fonction);
  const idx = NORMALIZED_ROLE_ORDER.findIndex((k) => f.includes(k));
  return idx === -1 ? NORMALIZED_ROLE_ORDER.length : idx;
}

export function sortByResponsabilite<T extends { fonction?: string | null; nom?: string | null }>(
  membres: T[]
): T[] {
  return [...membres].sort((a, b) => {
    const ra = roleRank(a.fonction);
    const rb = roleRank(b.fonction);
    if (ra !== rb) return ra - rb;
    return (a.nom || "").localeCompare(b.nom || "");
  });
}
