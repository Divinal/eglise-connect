-- ============================================================
-- MIGRATION EEC v2 — Système hiérarchique complet
-- À exécuter dans Supabase → SQL Editor
-- ============================================================

-- ============================================================
-- ÉTAPE 1 : Enrichir la table paroisses
-- ============================================================
ALTER TABLE public.paroisses
  ADD COLUMN IF NOT EXISTS date_creation     DATE,
  ADD COLUMN IF NOT EXISTS pasteur_responsable TEXT,
  ADD COLUMN IF NOT EXISTS ville             TEXT,
  ADD COLUMN IF NOT EXISTS departement       TEXT,
  ADD COLUMN IF NOT EXISTS quartier          TEXT,
  ADD COLUMN IF NOT EXISTS rue               TEXT,
  ADD COLUMN IF NOT EXISTS telephone         TEXT,
  ADD COLUMN IF NOT EXISTS email             TEXT;

-- ============================================================
-- ÉTAPE 2 : Enrichir la table consistoires
-- ============================================================
ALTER TABLE public.consistoires
  ADD COLUMN IF NOT EXISTS ville             TEXT,
  ADD COLUMN IF NOT EXISTS responsable       TEXT,
  ADD COLUMN IF NOT EXISTS telephone         TEXT,
  ADD COLUMN IF NOT EXISTS email             TEXT,
  ADD COLUMN IF NOT EXISTS is_active         BOOLEAN DEFAULT true;

-- ============================================================
-- ÉTAPE 3 : Enrichir la table membres (champs manquants)
-- ============================================================
ALTER TABLE public.membres
  ADD COLUMN IF NOT EXISTS is_active         BOOLEAN DEFAULT true;

-- ============================================================
-- ÉTAPE 4 : Table de blocage des accès (admin général → coordinateurs/secrétaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.access_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_by  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.access_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage blocks" ON public.access_blocks
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Users can view their own block" ON public.access_blocks
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- ÉTAPE 5 : Fonction pour vérifier si un user est bloqué
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_blocked(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.access_blocks WHERE user_id = _user_id
  )
$$;

-- ============================================================
-- ÉTAPE 6 : Corriger les policies RLS — Consistoires
-- ============================================================
DROP POLICY IF EXISTS "Coordinateur can update their consistoire" ON public.consistoires;

CREATE POLICY "Coordinateur can update their consistoire" ON public.consistoires
  FOR UPDATE USING (
    public.has_role_for_scope(auth.uid(), 'coordinateur_consistoire', id)
    AND NOT public.is_blocked(auth.uid())
  );

-- ============================================================
-- ÉTAPE 7 : Corriger les policies RLS — Paroisses
-- ============================================================
DROP POLICY IF EXISTS "Coordinateur can manage paroisses of their consistoire" ON public.paroisses;
DROP POLICY IF EXISTS "Secretaire can manage their paroisse" ON public.paroisses;

-- Le coordinateur gère toutes les paroisses de son consistoire
CREATE POLICY "Coordinateur can manage paroisses of their consistoire" ON public.paroisses
  FOR ALL USING (
    public.has_role_for_scope(auth.uid(), 'coordinateur_consistoire', consistoire_id)
    AND NOT public.is_blocked(auth.uid())
  );

-- Le secrétaire peut mettre à jour sa propre paroisse uniquement
CREATE POLICY "Secretaire can update their paroisse" ON public.paroisses
  FOR UPDATE USING (
    public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', id)
    AND NOT public.is_blocked(auth.uid())
  );

-- ============================================================
-- ÉTAPE 8 : Corriger les policies RLS — Membres
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage all membres" ON public.membres;
DROP POLICY IF EXISTS "Role holders can view membres details" ON public.membres;
DROP POLICY IF EXISTS "Public can view basic membre info" ON public.membres;

-- Admin général : tout
CREATE POLICY "Admin can manage all membres" ON public.membres
  FOR ALL USING (public.is_admin_general(auth.uid()));

-- Coordinateur : membres des entités de son consistoire
CREATE POLICY "Coordinateur can manage membres in their scope" ON public.membres
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND (
          -- membre d'une entité directement liée au consistoire
          membres.entity_id = ur.scope_id
          OR
          -- membre d'une paroisse appartenant au consistoire
          EXISTS (
            SELECT 1 FROM public.paroisses p
            WHERE p.id = membres.entity_id
              AND p.consistoire_id = ur.scope_id
          )
        )
    )
  );

-- Secrétaire : membres de sa paroisse uniquement
CREATE POLICY "Secretaire can manage membres of their paroisse" ON public.membres
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', membres.entity_id)
  );

-- Utilisateurs authentifiés avec un rôle : lecture des données complètes
CREATE POLICY "Role holders can view membres details" ON public.membres
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
  );

-- Public : lecture de base (via la vue membres_public)
CREATE POLICY "Public can view basic membre info" ON public.membres
  FOR SELECT USING (true);

-- ============================================================
-- ÉTAPE 9 : Corriger les policies RLS — Bureaux
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage bureaux" ON public.bureaux;

CREATE POLICY "Admin can manage bureaux" ON public.bureaux
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Coordinateur can manage bureaux in their scope" ON public.bureaux
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND (
          bureaux.entity_id = ur.scope_id
          OR EXISTS (
            SELECT 1 FROM public.paroisses p
            WHERE p.id = bureaux.entity_id AND p.consistoire_id = ur.scope_id
          )
        )
    )
  );

CREATE POLICY "Secretaire can manage bureaux of their paroisse" ON public.bureaux
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', bureaux.entity_id)
  );

-- ============================================================
-- ÉTAPE 10 : Corriger les policies RLS — Organes
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage organes" ON public.organes;

CREATE POLICY "Admin can manage organes" ON public.organes
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Coordinateur can manage organes in their scope" ON public.organes
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND (
          organes.entity_id = ur.scope_id
          OR EXISTS (
            SELECT 1 FROM public.paroisses p
            WHERE p.id = organes.entity_id AND p.consistoire_id = ur.scope_id
          )
        )
    )
  );

CREATE POLICY "Secretaire can manage organes of their paroisse" ON public.organes
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', organes.entity_id)
  );

-- ============================================================
-- ÉTAPE 11 : Corriger les policies RLS — Commissions
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage commissions" ON public.commissions;

CREATE POLICY "Admin can manage commissions" ON public.commissions
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Coordinateur can manage commissions in their scope" ON public.commissions
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND (
          commissions.entity_id = ur.scope_id
          OR EXISTS (
            SELECT 1 FROM public.paroisses p
            WHERE p.id = commissions.entity_id AND p.consistoire_id = ur.scope_id
          )
        )
    )
  );

-- ============================================================
-- ÉTAPE 12 : Corriger les policies RLS — Conseils
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage conseils" ON public.conseils;

CREATE POLICY "Admin can manage conseils" ON public.conseils
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Coordinateur can manage conseils in their scope" ON public.conseils
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND (
          conseils.entity_id = ur.scope_id
          OR EXISTS (
            SELECT 1 FROM public.paroisses p
            WHERE p.id = conseils.entity_id AND p.consistoire_id = ur.scope_id
          )
        )
    )
  );

CREATE POLICY "Secretaire can manage conseils of their paroisse" ON public.conseils
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', conseils.entity_id)
  );

-- ============================================================
-- ÉTAPE 13 : Corriger les policies RLS — Groupes chantants
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage groupes" ON public.groupes_chantants;
DROP POLICY IF EXISTS "Secretaire can manage groupes of their paroisse" ON public.groupes_chantants;

CREATE POLICY "Admin can manage groupes" ON public.groupes_chantants
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Coordinateur can manage groupes in their consistoire" ON public.groupes_chantants
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.paroisses p ON p.consistoire_id = ur.scope_id
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND p.id = groupes_chantants.paroisse_id
    )
  );

CREATE POLICY "Secretaire can manage groupes of their paroisse" ON public.groupes_chantants
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', paroisse_id)
  );

-- ============================================================
-- ÉTAPE 14 : Corriger les policies RLS — Annexes
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage annexes" ON public.annexes;
DROP POLICY IF EXISTS "Secretaire can manage annexes of their paroisse" ON public.annexes;

CREATE POLICY "Admin can manage annexes" ON public.annexes
  FOR ALL USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Coordinateur can manage annexes in their consistoire" ON public.annexes
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.paroisses p ON p.consistoire_id = ur.scope_id
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND p.id = annexes.paroisse_id
    )
  );

CREATE POLICY "Secretaire can manage annexes of their paroisse" ON public.annexes
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', paroisse_id)
  );

-- ============================================================
-- ÉTAPE 15 : Policies RLS — Annonces (coordinateur + secrétaire)
-- ============================================================
DROP POLICY IF EXISTS "Scoped users can manage their announcements" ON public.announcements;

CREATE POLICY "Coordinateur can manage announcements in their scope" ON public.announcements
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
        AND ur.scope_id = announcements.entity_id
    )
  );

CREATE POLICY "Secretaire can manage announcements of their paroisse" ON public.announcements
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', announcements.entity_id)
  );

-- ============================================================
-- ÉTAPE 16 : Policies RLS — user_roles (coordinateur peut créer secrétaires)
-- ============================================================
DROP POLICY IF EXISTS "Admin can manage roles" ON public.user_roles;

-- Admin général : tout
CREATE POLICY "Admin can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin_general(auth.uid()));

-- Coordinateur : peut créer/supprimer des secrétaires de sa propre portée
CREATE POLICY "Coordinateur can manage secretaires in their scope" ON public.user_roles
  FOR ALL USING (
    NOT public.is_blocked(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
    )
    AND user_roles.role = 'secretaire_paroissial'
    AND EXISTS (
      SELECT 1 FROM public.paroisses p
      JOIN public.user_roles ur ON ur.scope_id = p.consistoire_id
      WHERE p.id = user_roles.scope_id
        AND ur.user_id = auth.uid()
        AND ur.role = 'coordinateur_consistoire'
    )
  );

-- ============================================================
-- ÉTAPE 17 : Fonction utilitaire — obtenir le scope d'un user
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_scope(_user_id UUID)
RETURNS TABLE(role app_role, scope_type TEXT, scope_id UUID)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role, scope_type, scope_id
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================
SELECT
  'Paroisses columns'  AS check_name,
  COUNT(*)::TEXT       AS result
FROM information_schema.columns
WHERE table_name = 'paroisses'
  AND table_schema = 'public'

UNION ALL

SELECT
  'Consistoires columns',
  COUNT(*)::TEXT
FROM information_schema.columns
WHERE table_name = 'consistoires'
  AND table_schema = 'public'

UNION ALL

SELECT
  'access_blocks table',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'access_blocks' AND table_schema = 'public'
  ) THEN 'OK' ELSE 'MANQUANT' END

UNION ALL

SELECT
  'Policies actives (total)',
  COUNT(*)::TEXT
FROM pg_policies
WHERE schemaname = 'public';
