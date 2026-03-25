ALTER TABLE groupes_chantants
  -- Renommer les colonnes tronquées
  RENAME COLUMN nombre_hommes_actifs TO nombre_hommes;

ALTER TABLE groupes_chantants
  RENAME COLUMN nombre_femmes_actives TO nombre_femmes;

-- Supprimer les colonnes actifs/refroidis séparées 
-- (on garde juste total, hommes, femmes)
-- Ajouter les membres du bureau
ALTER TABLE groupes_chantants
  ADD COLUMN IF NOT EXISTS total_membres int4 DEFAULT 0,
  ADD COLUMN IF NOT EXISTS resp1_nom text,
  ADD COLUMN IF NOT EXISTS resp1_fonction text,
  ADD COLUMN IF NOT EXISTS resp1_telephone text,
  ADD COLUMN IF NOT EXISTS resp2_nom text,
  ADD COLUMN IF NOT EXISTS resp2_fonction text,
  ADD COLUMN IF NOT EXISTS resp2_telephone text,
  ADD COLUMN IF NOT EXISTS secretaire_nom text,
  ADD COLUMN IF NOT EXISTS secretaire_telephone text,
  ADD COLUMN IF NOT EXISTS tresoriere_nom text,
  ADD COLUMN IF NOT EXISTS tresoriere_telephone text;

  -- TABLE ANNEXES (mêmes champs que groupe avec effectifs)
ALTER TABLE annexes
  ADD COLUMN IF NOT EXISTS total_membres int4 DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nombre_hommes int4 DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nombre_femmes int4 DEFAULT 0,
  ADD COLUMN IF NOT EXISTS resp1_nom text,
  ADD COLUMN IF NOT EXISTS resp1_telephone text,
  ADD COLUMN IF NOT EXISTS resp2_nom text,
  ADD COLUMN IF NOT EXISTS resp2_telephone text,
  ADD COLUMN IF NOT EXISTS secretaire_nom text,
  ADD COLUMN IF NOT EXISTS secretaire_telephone text,
  ADD COLUMN IF NOT EXISTS tresoriere_nom text,
  ADD COLUMN IF NOT EXISTS tresoriere_telephone text;

-- Supprimer la colonne inutile
ALTER TABLE conseils DROP COLUMN IF EXISTS description;

-- Ajouter les colonnes manquantes
ALTER TABLE conseils
  ADD COLUMN IF NOT EXISTS prenom text,
  ADD COLUMN IF NOT EXISTS fonction text CHECK (fonction IN ('Conseillé titulaire', 'Suppléant')),
  ADD COLUMN IF NOT EXISTS telephone text,
  ADD COLUMN IF NOT EXISTS adresse text;

  -- Supprimer la colonne inutile
ALTER TABLE organes DROP COLUMN IF EXISTS description;

-- Ajouter les colonnes manquantes
ALTER TABLE organes
  ADD COLUMN IF NOT EXISTS nom_personne text,
  ADD COLUMN IF NOT EXISTS prenom_personne text,
  ADD COLUMN IF NOT EXISTS fonction text,
  ADD COLUMN IF NOT EXISTS telephone text,
  ADD COLUMN IF NOT EXISTS adresse text;
