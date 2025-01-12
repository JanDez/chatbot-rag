import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserInteractions } from '../types/chat'
import { ChatItem } from '../components/admin/ChatItem'
import { StatCard } from '../components/admin/StatCard'

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)

  const { data: allInteractions } = useQuery<UserInteractions[]>({
    queryKey: ['interactions'],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:8000/api/interactions')
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    }
  })

  const { data: userInteractions } = useQuery<UserInteractions>({
    queryKey: ['interactions', selectedEmail],
    queryFn: async () => {
      if (!selectedEmail) return null; // Prevent fetching if no email is selected
      const response = await fetch(`http://127.0.0.1:8000/api/interactions/${selectedEmail}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: !!selectedEmail
  })

  const { data: searchResults } = useQuery<UserInteractions[]>({
    queryKey: ['searchInteractions', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return []; // Prevent fetching if no search term
      const response = await fetch(`http://127.0.0.1:8000/api/interactions/search?user_name=${searchTerm}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: !!searchTerm
  });

  const interactionsToDisplay = searchTerm ? searchResults : allInteractions;

  const stats = {
    totalConversations: allInteractions?.length || 0,
    activeUsers: allInteractions?.filter(i => 
      new Date(i.interactions[0].timestamp).getMonth() === new Date().getMonth()
    ).length || 0,
    avgResponseTime: '1.2s',
    userSatisfaction: '98%'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 bg-gray-900 min-h-screen p-4">
          <h1 className="text-xl font-bold text-white mb-8">Promtior Chat Admin</h1>
          <nav className="space-y-4">
            <a href="#" className="flex items-center space-x-2 text-white/80 hover:text-white">
              <MessageCircle size={20} />
              <span>Overview</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Conversations"
              value={stats.totalConversations.toString()}
              icon={MessageCircle}
              change="+20.1% from last month"
            />
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Chat Activity</h3>
              <div className="flex space-x-4">
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="bg-gray-800 border-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter size={18} />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {interactionsToDisplay?.map((interaction) => (
                <ChatItem
                  key={interaction.user_email}
                  interaction={interaction}
                  onClick={() => setSelectedEmail(interaction.user_email)}
                />
              ))}
            </div>

            {userInteractions && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-foreground">Interactions for {userInteractions.user_email}</h4>
                <div className="space-y-2">
                  {userInteractions.interactions.map((interaction, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-muted-foreground">User: {interaction.user_message}</p>
                      <p className="text-muted-foreground">Bot: {interaction.bot_response}</p>
                      <span className="text-sm text-gray-500">{new Date(interaction.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}