-- ============================================================
-- Ajout d'un ordre manuel pour les membres de bureau/conseil/organe
-- À exécuter dans Supabase → SQL Editor
-- ============================================================
ALTER TABLE public.membres ADD COLUMN IF NOT EXISTS ordre INTEGER;
