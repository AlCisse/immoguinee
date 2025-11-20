import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { messageService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatRelativeTime } from '../utils/format'
import toast from 'react-hot-toast'

function Conversation() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversation()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversation = async () => {
    try {
      const response = await messageService.getConversation(userId)
      const data = response.data
      setMessages(data.messages || data || [])
      setOtherUser(data.user || null)

      // Marquer comme lu
      data.messages?.forEach(async (msg) => {
        if (!msg.read_at && msg.sender_id !== user.id) {
          await messageService.markAsRead(msg.id)
        }
      })
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error('Erreur lors du chargement de la conversation')
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const response = await messageService.send({
        receiver_id: userId,
        content: newMessage,
      })
      setMessages((prev) => [...prev, response.data.message || response.data])
      setNewMessage('')
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/messages" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {otherUser?.first_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <div className="font-medium">
              {otherUser?.first_name} {otherUser?.last_name}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="card p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender_id === user.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === user.id ? 'text-primary-200' : 'text-gray-500'
                    }`}
                  >
                    {formatRelativeTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucun message. Commencez la conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="btn-primary px-4 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Conversation
