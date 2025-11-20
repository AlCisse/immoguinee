import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { contractService, signatureService } from '../services/api'
import { formatDate, formatPrice } from '../utils/format'
import toast from 'react-hot-toast'

function ContractDetail() {
  const { id } = useParams()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  useEffect(() => {
    loadContract()
  }, [id])

  const loadContract = async () => {
    try {
      const response = await contractService.getById(id)
      setContract(response.data.contract || response.data)
    } catch (error) {
      console.error('Error loading contract:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestOTP = async () => {
    try {
      await signatureService.requestOTP(id)
      setOtpSent(true)
      toast.success('Code OTP envoyé par SMS')
    } catch (error) {
      toast.error("Erreur lors de l'envoi du code")
    }
  }

  const handleSign = async () => {
    if (!otp) {
      toast.error('Veuillez entrer le code OTP')
      return
    }

    setSigning(true)
    try {
      const signature = contract.signatures?.find((s) => !s.signed_at)
      if (signature) {
        await signatureService.sign(id, signature.id, { otp })
        toast.success('Contrat signé avec succès!')
        loadContract()
      }
    } catch (error) {
      toast.error('Code OTP invalide')
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  if (!contract) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Contrat non trouvé</p>
        <Link to="/contracts" className="btn-primary mt-4">
          Retour aux contrats
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/contracts" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Retour aux contrats
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Contrat #{contract.id}</h1>
          <span className={`badge ${
            contract.status === 'completed' ? 'bg-green-100 text-green-800' :
            contract.status === 'signed' ? 'bg-blue-100 text-blue-800' :
            contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {contract.status === 'completed' ? 'Complété' :
             contract.status === 'signed' ? 'Signé' :
             contract.status === 'pending' ? 'En attente' : 'Brouillon'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{contract.type === 'sale' ? 'Vente' : 'Location'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Montant</p>
            <p className="font-medium text-primary-600">{formatPrice(contract.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de création</p>
            <p className="font-medium">{formatDate(contract.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Propriété</p>
            <p className="font-medium">{contract.property?.title || '-'}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="border-t pt-4">
          <h2 className="font-semibold mb-4">Signatures</h2>
          {contract.signatures?.map((signature) => (
            <div key={signature.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {signature.signed_at ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <div className="w-5 h-5 border-2 rounded-full mr-2" />
                )}
                <span>{signature.user?.first_name} {signature.user?.last_name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {signature.signed_at ? formatDate(signature.signed_at) : 'En attente'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions de signature */}
      {contract.status === 'pending' && (
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Signer le contrat</h2>
          {!otpSent ? (
            <button onClick={handleRequestOTP} className="btn-primary w-full">
              Recevoir le code de signature
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input"
                  placeholder="Entrez le code reçu par SMS"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleSign}
                disabled={signing}
                className="btn-green w-full disabled:opacity-50"
              >
                {signing ? 'Signature...' : 'Signer le contrat'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContractDetail
