import Layout from "@/components/Layout";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Qu'est-ce que l'Église Évangélique du Congo ?",
    r: "L'Église Évangélique du Congo est une communauté chrétienne dédiée à la proclamation de l'Évangile et à l'accompagnement spirituel des croyants. Elle œuvre à travers des cultes, des enseignements bibliques, des actions sociales et des événements spirituels.",
  },
  {
    q: "Quels sont les horaires des cultes ?",
    r: "Les cultes ont lieu chaque dimanche à 9h30. Des cultes d'intercessions sont également organisés les lundi à partir de 15h.",
  },
  {
    q: "Comment devenir membre de l'église ?",
    r: "Pour devenir membre, vous pouvez participer aux réunions d'accueil organisées chaque premier dimanche du mois après le culte. Un parcours d'intégration vous sera proposé. Après cette étape d'intégration, vous témoignerez pour devenir membre confirmé de l'EEC.",
  },
  {
    q: "Comment faire un don à l'église ?",
    r: "Vous pouvez faire un don lors des cultes ou par virement bancaire ou par dépôt mobile money au numéro : +242 06 123 45 67. Pour plus d'informations, veuillez contacter le secrétariat de l'église.",
  },
  {
    q: "Comment participer aux activités de l'église ?",
    r: "Chaque département organise des activités auxquelles vous pouvez participer. Consultez l'agenda sur notre site ou informez-vous directement auprès du responsable du département.",
  },
];

const FAQItem = ({ q, r }: { q: string; r: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-card hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed text-sm border-t border-border bg-muted/10">
          {r}
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  return (
    <Layout>
      {/* ── BANNER ── */}
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Contact</h1>
          <p className="text-primary-foreground/70 mt-2">
            Notre équipe est à votre disposition pour vous répondre dans les meilleurs délais.
          </p>
        </div>
      </div>

      {/* ── SECRÉTARIAT ── */}
      <section className="py-12 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Image placeholder */}
            <div className="rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
              <img
                src="/images/images/secretariat.jpg"
                alt="Secrétariat Permanent"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-muted-foreground text-sm absolute">Secrétariat Permanent</span>
            </div>

            {/* Text */}
            <div>
               <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Secrétariat Permanent de l'ÉEC
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                N'hésitez pas à nous contacter pour toute question ou information complémentaire.
                Notre équipe est à votre disposition pour vous répondre dans les meilleurs délais.
              </p>
               <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Adresse</h5>
                    <p className="text-muted-foreground text-sm">
                      Rue Alfred Fourneau, Centre Ville<br />Brazzaville, Congo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Téléphone</h5>
                    <p className="text-muted-foreground text-sm">+242 12 345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Email</h5>
                    <p className="text-muted-foreground text-sm">dscom@eeccg.net</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Horaires d'ouverture</h5>
                    <p className="text-muted-foreground text-sm">
                      Lundi - Vendredi : 9h - 17h<br />Samedi : 9h - 12h
                    </p>
                  </div>
                </div>
              </div>
              <br/>
              <h6 className="font-semibold text-foreground mb-1">Communication et Information :</h6>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nous diffusons les informations importantes concernant la vie de l'EEC : événements,
                décisions, projets, etc. Nous sommes votre point de contact pour toute question
                relative à l'EEC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Info */}
            <div>
              {/* <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Nous Contacter
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                N'hésitez pas à nous contacter pour toute question ou information complémentaire.
                Notre équipe est à votre disposition pour vous répondre dans les meilleurs délais.
              </p> */}

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Département Communication </h5>
                    <p className="text-muted-foreground text-sm">+242 12 345 6789</p>
                    <p className="text-muted-foreground text-sm">dscom@eeccg.net</p>                  
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Service des Ressources Humaines</h5>
                    <p className="text-muted-foreground text-sm">+242 12 345 6789</p>
                    <p className="text-muted-foreground text-sm">dshr@eeccg.net</p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Téléphone</h5>
                    <p className="text-muted-foreground text-sm">dscom@eeccg.net</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Téléphone</h5>
                    <p className="text-muted-foreground text-sm">
                      Lundi - Vendredi : 9h - 17h<br />Samedi : 9h - 12h
                    </p>
                  </div>
                </div> */}
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-8">
                <h4 className="font-semibold text-foreground mb-3">Suivez-nous</h4>
                <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="h-4 w-4" />, href: "https://web.facebook.com/eeccongo" },
                    { icon: <Twitter className="h-4 w-4" />, href: "#" },
                    { icon: <Instagram className="h-4 w-4" />, href: "#" },
                    { icon: <Youtube className="h-4 w-4" />, href: "https://www.youtube.com/@salasambilaTv/videos" },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-card rounded-xl shadow-md border border-border p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Envoyez-nous un message
              </h3>
              <form action="https://formspree.io/f/mgvavzlg" method="POST" className="space-y-4">
                <input type="hidden" name="_next" value="https://divinal.github.io/church-portal-interaction/confirmation.html" />
                <input type="hidden" name="_replyto" value="divinmister@gmail.com" />
                <input type="hidden" name="_subject" value="Nouveau message depuis le site" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">Nom</label>
                    <input
                      type="text"
                      name="Nom"
                      placeholder="Votre nom"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">Prénom</label>
                    <input
                      type="text"
                      name="Prenom"
                      placeholder="Votre prénom"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">Paroisse</label>
                    <input
                      type="text"
                      name="Paroisse"
                      placeholder="Votre paroisse"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      name="Email"
                      placeholder="Votre email"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">Sujet</label>
                  <input
                    type="text"
                    name="Sujet"
                    placeholder="Sujet de votre message"
                    required
                    className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    name="Message"
                    placeholder="Votre message"
                    rows={5}
                    required
                    className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1 accent-primary"
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    J'accepte la{" "}
                    <Link to="/politique-confidentialite" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="py-12 bg-cream">
        <div className="container">
          <h2 className="font-display text-2xl font-semibold text-foreground text-center mb-8">
            Notre Localisation
          </h2>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm" style={{ aspectRatio: "21/9" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63766.12143091266!2d15.215246487411002!3d-4.267248392549331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a33e2e9f0fc4b%3A0x4231a680a779ef0!2sBrazzaville%2C%20Congo!5e0!3m2!1sfr!2sfr!4v1651335760560!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation EEC"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-foreground text-center mb-8">
            Questions Fréquentes
          </h2>
          <div className="space-y-3">
            {faqs.map((item) => (
              <FAQItem key={item.q} q={item.q} r={item.r} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Voir toutes les FAQ
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default ContactPage;