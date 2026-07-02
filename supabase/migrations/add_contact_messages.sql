-- ============================================================
-- Table des messages envoyés depuis le formulaire de contact
-- À exécuter dans Supabase → SQL Editor
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom         TEXT NOT NULL,
  prenom      TEXT,
  paroisse    TEXT,
  email       TEXT NOT NULL,
  sujet       TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- N'importe qui (y compris un visiteur non connecté) peut envoyer un message
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Seul l'admin général peut consulter / gérer les messages
CREATE POLICY "Admin general can view contact messages" ON public.contact_messages
  FOR SELECT USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Admin general can update contact messages" ON public.contact_messages
  FOR UPDATE USING (public.is_admin_general(auth.uid()));

CREATE POLICY "Admin general can delete contact messages" ON public.contact_messages
  FOR DELETE USING (public.is_admin_general(auth.uid()));

-- Active les mises à jour en temps réel pour la notification instantanée côté admin
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
