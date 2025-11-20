import { Link } from 'react-router-dom'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

function About() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Sécurité garantie',
      description:
        'Toutes les transactions sont sécurisées avec vérification des documents et des identités.',
    },
    {
      icon: DocumentTextIcon,
      title: 'Contrats numériques',
      description:
        'Signez vos contrats en ligne avec notre système de signature électronique certifié.',
    },
    {
      icon: UserGroupIcon,
      title: 'Agents certifiés',
      description:
        'Notre réseau d\'agents immobiliers est vérifié et certifié pour vous garantir un service de qualité.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Couverture nationale',
      description:
        'Présent dans toutes les grandes villes de Guinée pour vous accompagner partout.',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos d'Immo Guinée</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            La plateforme immobilière de référence en Guinée, dédiée à simplifier
            vos transactions immobilières en toute sécurité.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre mission</h2>
              <p className="text-gray-600 mb-4">
                Immo Guinée a été créé avec une mission claire : révolutionner le marché
                immobilier guinéen en apportant transparence, sécurité et simplicité
                à chaque transaction.
              </p>
              <p className="text-gray-600 mb-4">
                Nous croyons que l'achat, la vente ou la location d'un bien immobilier
                devrait être une expérience simple et sécurisée. C'est pourquoi nous
                avons développé une plateforme moderne avec des contrats numériques
                et des signatures électroniques.
              </p>
              <p className="text-gray-600">
                Notre équipe travaille sans relâche pour vous offrir les meilleurs
                outils et services pour réaliser vos projets immobiliers.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary-600">1000+</div>
                  <div className="text-gray-600">Propriétés</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600">500+</div>
                  <div className="text-gray-600">Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600">50+</div>
                  <div className="text-gray-600">Agents</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600">8</div>
                  <div className="text-gray-600">Villes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Pourquoi nous choisir?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à commencer?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à Immo Guinée
            pour leurs projets immobiliers.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn-primary">
              Créer un compte
            </Link>
            <Link to="/properties" className="btn-outline">
              Voir les propriétés
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
