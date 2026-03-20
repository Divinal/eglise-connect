
-- ========================================
-- 1. ENUM pour les rôles
-- ========================================
CREATE TYPE public.app_role AS ENUM ('admin_general', 'admin_departement', 'coordinateur_consistoire', 'secretaire_paroissial');

-- ========================================
-- 2. Table des profils utilisateurs
-- ========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 3. Table des rôles utilisateurs
-- ========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  scope_type TEXT, -- 'departement', 'institution', 'consistoire', 'paroisse', 'annexe'
  scope_id UUID, -- ID de l'entité gérée
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, scope_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction security definer pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_role_for_scope(_user_id UUID, _role app_role, _scope_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role AND scope_id = _scope_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_general(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin_general'
  )
$$;

CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL USING (public.is_admin_general(auth.uid()));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- ========================================
-- 4. Départements
-- ========================================
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments are viewable by everyone" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admin can manage departments" ON public.departments FOR ALL USING (public.is_admin_general(auth.uid()));

-- ========================================
-- 5. Institutions
-- ========================================
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Institutions are viewable by everyone" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Admin can manage institutions" ON public.institutions FOR ALL USING (public.is_admin_general(auth.uid()));

-- ========================================
-- 6. Consistoires
-- ========================================
CREATE TABLE public.consistoires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consistoires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Consistoires are viewable by everyone" ON public.consistoires FOR SELECT USING (true);
CREATE POLICY "Admin can manage consistoires" ON public.consistoires FOR ALL USING (public.is_admin_general(auth.uid()));
CREATE POLICY "Coordinateur can update their consistoire" ON public.consistoires FOR UPDATE USING (public.has_role_for_scope(auth.uid(), 'coordinateur_consistoire', id));

-- ========================================
-- 7. Paroisses
-- ========================================
CREATE TABLE public.paroisses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consistoire_id UUID REFERENCES public.consistoires(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(consistoire_id, slug)
);

ALTER TABLE public.paroisses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Paroisses are viewable by everyone" ON public.paroisses FOR SELECT USING (true);
CREATE POLICY "Admin can manage paroisses" ON public.paroisses FOR ALL USING (public.is_admin_general(auth.uid()));
CREATE POLICY "Coordinateur can manage paroisses of their consistoire" ON public.paroisses FOR ALL USING (public.has_role_for_scope(auth.uid(), 'coordinateur_consistoire', consistoire_id));

-- ========================================
-- 8. Annexes
-- ========================================
CREATE TABLE public.annexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paroisse_id UUID REFERENCES public.paroisses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.annexes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Annexes are viewable by everyone" ON public.annexes FOR SELECT USING (true);
CREATE POLICY "Admin can manage annexes" ON public.annexes FOR ALL USING (public.is_admin_general(auth.uid()));
CREATE POLICY "Secretaire can manage annexes of their paroisse" ON public.annexes FOR ALL USING (public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', paroisse_id));

-- ========================================
-- 9. Bureaux (pour consistoires, paroisses, annexes, institutions)
-- ========================================
CREATE TABLE public.bureaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'consistoire', 'paroisse', 'annexe', 'institution', 'synode'
  entity_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Bureau',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bureaux ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bureaux are viewable by everyone" ON public.bureaux FOR SELECT USING (true);
CREATE POLICY "Admin can manage bureaux" ON public.bureaux FOR ALL USING (public.is_admin_general(auth.uid()));

-- ========================================
-- 10. Membres (bureaux, conseils, organes, commissions, groupes)
-- ========================================
CREATE TABLE public.membres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'bureau', 'conseil', 'organe', 'commission', 'groupe_chantant'
  entity_id UUID NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE,
  paroisse_bapteme TEXT,
  date_bapteme DATE,
  fonction TEXT,
  telephone TEXT,
  adresse TEXT,
  statut TEXT DEFAULT 'actif', -- 'actif', 'refroidi'
  genre TEXT, -- 'homme', 'femme'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.membres ENABLE ROW LEVEL SECURITY;

-- Vue publique (nom et prénom seulement)
CREATE VIEW public.membres_public
WITH (security_invoker = on) AS
  SELECT id, entity_type, entity_id, nom, prenom, fonction
  FROM public.membres;

-- Les admins voient tout
CREATE POLICY "Admin can manage all membres" ON public.membres FOR ALL USING (public.is_admin_general(auth.uid()));
-- Les utilisateurs authentifiés avec un rôle voient les détails
CREATE POLICY "Role holders can view membres details" ON public.membres FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
);
-- Accès public limité via la vue
CREATE POLICY "Public can view basic membre info" ON public.membres FOR SELECT USING (true);

-- ========================================
-- 11. Organes
-- ========================================
CREATE TABLE public.organes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'consistoire', 'paroisse'
  entity_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organes are viewable by everyone" ON public.organes FOR SELECT USING (true);
CREATE POLICY "Admin can manage organes" ON public.organes FOR ALL USING (public.is_admin_general(auth.uid()));

-- ========================================
-- 12. Commissions
-- ========================================
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'consistoire', 'paroisse'
  entity_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Commissions are viewable by everyone" ON public.commissions FOR SELECT USING (true);
CREATE POLICY "Admin can manage commissions" ON public.commissions FOR ALL USING (public.is_admin_general(auth.uid()));

-- ========================================
-- 13. Conseils (synodal, consistorial, paroissial)
-- ========================================
CREATE TABLE public.conseils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'synode', 'consistoire', 'paroisse'
  entity_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conseils ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conseils are viewable by everyone" ON public.conseils FOR SELECT USING (true);
CREATE POLICY "Admin can manage conseils" ON public.conseils FOR ALL USING (public.is_admin_general(auth.uid()));

-- ========================================
-- 14. Groupes chantants (paroisses uniquement)
-- ========================================
CREATE TABLE public.groupes_chantants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paroisse_id UUID REFERENCES public.paroisses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  nombre_hommes_actifs INT DEFAULT 0,
  nombre_femmes_actives INT DEFAULT 0,
  nombre_hommes_refroidis INT DEFAULT 0,
  nombre_femmes_refroidies INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.groupes_chantants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Groupes are viewable by everyone" ON public.groupes_chantants FOR SELECT USING (true);
CREATE POLICY "Admin can manage groupes" ON public.groupes_chantants FOR ALL USING (public.is_admin_general(auth.uid()));
CREATE POLICY "Secretaire can manage groupes of their paroisse" ON public.groupes_chantants FOR ALL USING (public.has_role_for_scope(auth.uid(), 'secretaire_paroissial', paroisse_id));

-- ========================================
-- 15. Annonces / Actualités
-- ========================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'departement', 'institution', 'consistoire', 'paroisse', 'synode'
  entity_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admin can manage all announcements" ON public.announcements FOR ALL USING (public.is_admin_general(auth.uid()));
CREATE POLICY "Scoped users can manage their announcements" ON public.announcements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND scope_id = entity_id
  )
);

-- ========================================
-- 16. Trigger pour updated_at
-- ========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consistoires_updated_at BEFORE UPDATE ON public.consistoires FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_paroisses_updated_at BEFORE UPDATE ON public.paroisses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_annexes_updated_at BEFORE UPDATE ON public.annexes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bureaux_updated_at BEFORE UPDATE ON public.bureaux FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_membres_updated_at BEFORE UPDATE ON public.membres FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organes_updated_at BEFORE UPDATE ON public.organes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conseils_updated_at BEFORE UPDATE ON public.conseils FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_groupes_updated_at BEFORE UPDATE ON public.groupes_chantants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 17. Trigger pour créer un profil automatiquement
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 18. Données initiales des départements
-- ========================================
INSERT INTO public.departments (name, slug) VALUES
  ('DGEP', 'dgep'),
  ('Santé', 'sante'),
  ('Jeunesse', 'jeunesse'),
  ('Musique', 'musique'),
  ('Évangélisation', 'evangelisation'),
  ('Femmes et Famille', 'femmes-famille'),
  ('Éducation-Chrétienne', 'education-chretienne'),
  ('Aumônerie-Générale', 'aumonerie'),
  ('Communication', 'communication');

-- ========================================
-- 19. Données initiales des institutions
-- ========================================
INSERT INTO public.institutions (name, slug) VALUES
  ('Synode', 'synode'),
  ('Conseil Synodal', 'conseil-synodal'),
  ('Bureau Synodal', 'bureau-synodal'),
  ('Consistoires', 'consistoires');