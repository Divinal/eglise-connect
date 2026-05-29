import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ArrowLeft, User, Trash2, Lock, Unlock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string; user_id: string; role: string;
  scope_type: string | null; scope_id: string | null;
  created_at: string; email?: string; full_name?: string; is_blocked?: boolean;
}
interface Consistoire { id: string; name: string; }
interface Paroisse { id: string; name: string; consistoire_id: string; }
interface EntiteSimple { id: string; name: string; }

const ROLES = [
  { value: "coordinateur_consistoire",    label: "Coordinateur de Consistoire" },
  { value: "secretaire_paroissial",       label: "Secrétaire Paroissial" },
  { value: "admin_departement",           label: "Admin Département" },
  { value: "admin_diaspora",              label: "Admin Diaspora" },
  { value: "admin_champs_mission",        label: "Admin Champs de Mission" },
  { value: "admin_champs_evangelisation", label: "Admin Champs d'Évangélisation" },
  { value: "admin_pastorale",             label: "Admin Pastorale" },
  { value: "admin_upb",                   label: "Admin UPB" },
  { value: "admin_ifpn",                  label: "Admin IFPN" },
  { value: "admin_sueco",                 label: "Admin SUECO" },
];
const ROLE_COLORS: Record<string,string> = {
  admin_general:              "bg-red-100 text-red-700 border-red-200",
  admin_departement:          "bg-blue-100 text-blue-700 border-blue-200",
  coordinateur_consistoire:   "bg-green-100 text-green-700 border-green-200",
  secretaire_paroissial:      "bg-amber-100 text-amber-700 border-amber-200",
  admin_diaspora:             "bg-violet-100 text-violet-700 border-violet-200",
  admin_champs_mission:       "bg-emerald-100 text-emerald-700 border-emerald-200",
  admin_champs_evangelisation:"bg-orange-100 text-orange-700 border-orange-200",
  admin_pastorale:            "bg-pink-100 text-pink-700 border-pink-200",
  admin_upb:                  "bg-cyan-100 text-cyan-700 border-cyan-200",
  admin_ifpn:                 "bg-indigo-100 text-indigo-700 border-indigo-200",
  admin_sueco:                "bg-lime-100 text-lime-700 border-lime-200",
};
const ROLE_LABELS: Record<string,string> = {
  admin_general:              "Admin Général",
  admin_departement:          "Admin Département",
  coordinateur_consistoire:   "Coordinateur Consistoire",
  secretaire_paroissial:      "Secrétaire Paroissial",
  admin_diaspora:             "Admin Diaspora",
  admin_champs_mission:       "Admin Champs Mission",
  admin_champs_evangelisation:"Admin Champs Évang.",
  admin_pastorale:            "Admin Pastorale",
  admin_upb:                  "Admin UPB",
  admin_ifpn:                 "Admin IFPN",
  admin_sueco:                "Admin SUECO",
};

const AdminUsersPage = () => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [consistoires, setConsistoires] = useState<Consistoire[]>([]);
  const [paroisses, setParoisses] = useState<Paroisse[]>([]);
  const [departementsList, setDepartementsList] = useState<EntiteSimple[]>([]);
  const [diasporaList, setDiasporaList] = useState<EntiteSimple[]>([]);
  const [champsMissionList, setChampsMissionList] = useState<EntiteSimple[]>([]);
  const [champsEvangelisationList, setChampsEvangelisationList] = useState<EntiteSimple[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newScopeId, setNewScopeId] = useState("");

  useEffect(() => { if (!loading && !isAdminGeneral) navigate("/admin"); }, [loading, isAdminGeneral]);

  const fetchData = async () => {
    setFetching(true);
    const [rolesRes, conRes, parRes, deptRes, diaRes, cmRes, ceRes] = await Promise.all([
      supabase.from("user_roles").select("id,user_id,role,scope_type,scope_id,created_at").order("created_at",{ascending:false}),
      supabase.from("consistoires").select("id,name").order("name"),
      supabase.from("paroisses").select("id,name,consistoire_id").order("name"),
      supabase.from("departments").select("id,name").order("name"),
      (supabase as any).from("diaspora").select("id,name").order("name"),
      (supabase as any).from("champs_mission").select("id,name").order("name"),
      (supabase as any).from("champs_evangelisation").select("id,name").order("name"),
    ]);
    const blocksRes = await (supabase as any).from("access_blocks").select("user_id");
    const blockedIds = new Set((blocksRes.data||[]).map((b:any)=>b.user_id));
    const rr = rolesRes.data||[];
    const userIds = [...new Set(rr.map((r:any)=>r.user_id))];
    const {data:profiles} = await supabase.from("profiles").select("user_id,email,full_name").in("user_id",userIds);
    const pm:Record<string,any>={};
    (profiles||[]).forEach((p:any)=>{pm[p.user_id]=p;});
    setUserRoles(rr.map((r:any)=>({...r,email:pm[r.user_id]?.email,full_name:pm[r.user_id]?.full_name,is_blocked:blockedIds.has(r.user_id)})));
    setConsistoires(conRes.data||[]);
    setParoisses(parRes.data||[]);
    setDepartementsList(deptRes.data||[]);
    setDiasporaList(diaRes.data||[]);
    setChampsMissionList(cmRes.data||[]);
    setChampsEvangelisationList(ceRes.data||[]);
    setFetching(false);
  };
  useEffect(()=>{fetchData();},[]);

  const toggleBlock = async (ur: UserRole) => {
    if (ur.is_blocked) {
      const {error} = await (supabase as any).from("access_blocks").delete().eq("user_id",ur.user_id);
      if (error) { toast({title:"Erreur",description:error.message,variant:"destructive"}); return; }
      toast({title:"Accès débloqué"});
    } else {
      const {data:{user}} = await supabase.auth.getUser();
      const {error} = await (supabase as any).from("access_blocks").insert({user_id:ur.user_id,blocked_by:user?.id});
      if (error) { toast({title:"Erreur",description:error.message,variant:"destructive"}); return; }
      toast({title:"Accès bloqué"});
    }
    fetchData();
  };

  const deleteRole = async (id:string) => {
    await supabase.from("user_roles").delete().eq("id",id);
    toast({title:"Rôle supprimé"}); fetchData();
  };

  const assignRole = async () => {
    if(!newEmail||!newRole){toast({title:"Email et rôle requis",variant:"destructive"});return;}
    const {data:profile} = await supabase.from("profiles").select("user_id").eq("email",newEmail).maybeSingle();
    if(!profile){toast({title:"Utilisateur introuvable",description:"L'utilisateur doit créer son compte d'abord.",variant:"destructive"});return;}
    const scopeType =
      newRole === "coordinateur_consistoire"    ? "consistoire" :
      newRole === "secretaire_paroissial"       ? "paroisse" :
      newRole === "admin_departement"           ? "departement" :
      newRole === "admin_diaspora"              ? "diaspora" :
      newRole === "admin_champs_mission"        ? "champs_mission" :
      newRole === "admin_champs_evangelisation" ? "champs_evangelisation" :
      null;
    const {error} = await supabase.from("user_roles").insert({
      user_id: profile.user_id,
      role: newRole as "coordinateur_consistoire"|"secretaire_paroissial"|"admin_departement"|"admin_general",
      scope_type: scopeType,
      scope_id: newScopeId||null,
    });
    if(error){toast({title:"Erreur",description:error.message,variant:"destructive"});return;}
    toast({title:"Rôle attribué !"});
    setShowForm(false);setNewEmail("");setNewRole("");setNewScopeId("");fetchData();
  };

  const getScopeName = (ur:UserRole) => {
    if(!ur.scope_id) return "Global";
    const c=consistoires.find(x=>x.id===ur.scope_id); if(c) return c.name;
    const p=paroisses.find(x=>x.id===ur.scope_id); if(p) return p.name;
    const dept=departementsList.find(x=>x.id===ur.scope_id); if(dept) return dept.name;
    const d=diasporaList.find(x=>x.id===ur.scope_id); if(d) return d.name;
    const cm=champsMissionList.find(x=>x.id===ur.scope_id); if(cm) return cm.name;
    const ce=champsEvangelisationList.find(x=>x.id===ur.scope_id); if(ce) return ce.name;
    return ur.scope_id.slice(0,8)+"…";
  };

  const scopeOptions: EntiteSimple[] =
    newRole === "coordinateur_consistoire"    ? consistoires :
    newRole === "secretaire_paroissial"       ? paroisses :
    newRole === "admin_departement"           ? departementsList :
    newRole === "admin_diaspora"              ? diasporaList :
    newRole === "admin_champs_mission"        ? champsMissionList :
    newRole === "admin_champs_evangelisation" ? champsEvangelisationList :
    [];

  const scopeLabel =
    newRole === "coordinateur_consistoire"    ? "Consistoire" :
    newRole === "secretaire_paroissial"       ? "Paroisse" :
    newRole === "admin_departement"           ? "Département" :
    newRole === "admin_diaspora"              ? "Diaspora" :
    newRole === "admin_champs_mission"        ? "Champ de Mission" :
    newRole === "admin_champs_evangelisation" ? "Champ d'Évangélisation" :
    "Portée";

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={()=>navigate("/admin")} className="text-primary-foreground hover:bg-primary-foreground/10"><ArrowLeft className="h-5 w-5"/></Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl text-primary-foreground">Gestion des utilisateurs</h1>
            <p className="text-primary-foreground/70 text-sm mt-0.5">Rôles, accès et blocages</p>
          </div>
          <Button onClick={()=>setShowForm(!showForm)} className="gap-2 bg-gold text-navy-dark hover:bg-gold-dark"><Plus className="h-4 w-4"/>Attribuer un rôle</Button>
        </div>
      </div>
      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container">
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6 max-w-xl shadow-sm">
              <h2 className="font-semibold text-foreground mb-4">Attribuer un rôle</h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Email de l'utilisateur *</Label>
                  <Input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="utilisateur@email.com"/>
                  <p className="text-xs text-muted-foreground">L'utilisateur doit avoir créé son compte via la page de connexion.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Rôle *</Label>
                  <Select value={newRole} onValueChange={v=>{setNewRole(v);setNewScopeId("");}}>
                    <SelectTrigger><SelectValue placeholder="Choisir un rôle…"/></SelectTrigger>
                    <SelectContent>{ROLES.map(r=><SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {scopeOptions.length>0&&(
                  <div className="space-y-1.5">
                    <Label>{scopeLabel} *</Label>
                    <Select value={newScopeId} onValueChange={setNewScopeId}>
                      <SelectTrigger><SelectValue placeholder="Choisir…"/></SelectTrigger>
                      <SelectContent>{scopeOptions.map((o:any)=><SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button onClick={assignRole} className="gap-1.5"><Shield className="h-3.5 w-3.5"/>Attribuer</Button>
                  <Button variant="outline" onClick={()=>{setShowForm(false);setNewEmail("");setNewRole("");setNewScopeId("");}}>Annuler</Button>
                </div>
              </div>
            </div>
          )}
          {fetching ? (
            <p className="text-center text-muted-foreground py-16">Chargement…</p>
          ) : userRoles.length===0 ? (
            <div className="text-center py-16"><Shield className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3"/><p className="text-muted-foreground">Aucun rôle attribué.</p></div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Utilisateur</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Rôle</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Portée</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Statut</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {userRoles.map(ur=>(
                    <tr key={ur.id} className={`hover:bg-muted/20 transition-colors ${ur.is_blocked?"opacity-50":""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-4 w-4 text-primary"/></div>
                          <div><p className="font-medium text-foreground">{ur.full_name||"—"}</p><p className="text-xs text-muted-foreground">{ur.email||ur.user_id.slice(0,12)+"…"}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[ur.role]||"bg-gray-100 text-gray-700"}`}>{ROLE_LABELS[ur.role]||ur.role}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{getScopeName(ur)}</td>
                      <td className="px-5 py-4">{ur.is_blocked?<span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Bloqué</span>:<span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Actif</span>}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          {ur.role!=="admin_general"&&(
                            <Button variant="ghost" size="icon" onClick={()=>toggleBlock(ur)} className="h-8 w-8" title={ur.is_blocked?"Débloquer":"Bloquer"}>
                              {ur.is_blocked?<Unlock className="h-4 w-4 text-green-600"/>:<Lock className="h-4 w-4 text-amber-600"/>}
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={()=>deleteRole(ur.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};
export default AdminUsersPage;
