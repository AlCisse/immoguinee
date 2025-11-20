import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { messageService } from '../services/api'
import { formatRelativeTime } from '../utils/format'

function Messages() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await messageService.getConversations()
      setConversations(response.data.conversations || response.data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      {conversations.length > 0 ? (
        <div className="card divide-y">
          {conversations.map((conversation) => (
            <Link
              key={conversation.user_id}
              to={`/messages/${conversation.user_id}`}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-medium">
                  {conversation.user?.first_name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 truncate">
                    {conversation.user?.first_name} {conversation.user?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(conversation.last_message?.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.last_message?.content}
                </p>
              </div>
              {conversation.unread_count > 0 && (
                <div className="ml-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{conversation.unread_count}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucune conversation</p>
          <Link to="/properties" className="btn-primary">
            Parcourir les propriétés
          </Link>
        </div>
      )}
    </div>
  )
}

export default Messages
