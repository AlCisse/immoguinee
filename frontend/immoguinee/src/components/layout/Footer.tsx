export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ImmoGuinée</h3>
            <p className="text-gray-400">
              Votre plateforme immobilière de confiance en Guinée
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="/properties" className="text-gray-400 hover:text-white">
                  Propriétés
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">
                  À propos
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="/properties?type=sale" className="text-gray-400 hover:text-white">
                  Acheter
                </a>
              </li>
              <li>
                <a href="/properties?type=rent" className="text-gray-400 hover:text-white">
                  Louer
                </a>
              </li>
              <li>
                <a href="/sell" className="text-gray-400 hover:text-white">
                  Vendre
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Conakry, Guinée</li>
              <li>+224 XXX XXX XXX</li>
              <li>contact@immoguinee.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ImmoGuinée. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
