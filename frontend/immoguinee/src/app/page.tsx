import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slide-up leading-tight">
              Trouvez Votre Propriété Idéale en Guinée
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-50 animate-slide-up leading-relaxed max-w-2xl mx-auto">
              La plateforme immobilière de référence pour acheter, vendre ou louer en Guinée
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/properties">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-50 w-full sm:w-auto shadow-large hover:shadow-hover">
                  Parcourir les propriétés
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm">
                  Publier une annonce
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-neutral-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Pourquoi choisir ImmoGuinée ?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Une plateforme moderne et sécurisée pour tous vos besoins immobiliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-large transition-all duration-350 group card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-350">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Recherche Facile</h3>
              <p className="text-neutral-600 leading-relaxed">
                Trouvez rapidement la propriété qui vous convient grâce à nos filtres avancés et notre interface intuitive
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-large transition-all duration-350 group card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-350">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Sécurisé et Fiable</h3>
              <p className="text-neutral-600 leading-relaxed">
                Transactions sécurisées et propriétés vérifiées pour votre tranquillité d'esprit
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-large transition-all duration-350 group card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-350">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Experts Disponibles</h3>
              <p className="text-neutral-600 leading-relaxed">
                Notre équipe d'agents professionnels est là pour vous accompagner dans votre projet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-350">
                500+
              </div>
              <div className="text-neutral-600 font-medium">Propriétés</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-350">
                1000+
              </div>
              <div className="text-neutral-600 font-medium">Clients Satisfaits</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-350">
                50+
              </div>
              <div className="text-neutral-600 font-medium">Agents Experts</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl md:text-6xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-350">
                20+
              </div>
              <div className="text-neutral-600 font-medium">Villes Couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 md:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Prêt à trouver votre prochaine propriété ?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-primary-50 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers de Guinéens qui nous font confiance
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-50 shadow-large hover:shadow-hover">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
