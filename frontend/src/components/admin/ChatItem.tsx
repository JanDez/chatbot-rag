import { UserInteractions } from '../../types/chat'
import { getSentiment } from '../../lib/sentiment'

interface ChatItemProps {
    interaction: UserInteractions
    onClick: () => void
}

export function ChatItem({ interaction, onClick }: ChatItemProps) {
    const lastInteraction = interaction.interactions[interaction.interactions.length - 1]
    const sentiment = getSentiment(lastInteraction.user_message)

    return (
        <div 
            onClick={onClick}
            className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors shadow-md"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <span className="text-foreground font-medium">{interaction.user_name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                        sentiment === 'positive' ? 'bg-green-500/20 text-green-500' :
                        sentiment === 'negative' ? 'bg-red-500/20 text-red-500' :
                        'bg-blue-500/20 text-blue-500'
                    }`}>
                        {sentiment}
                    </span>
                </div>
                <span className="text-sm text-muted-foreground">
                    {new Date(lastInteraction.timestamp).toLocaleString()}
                </span>
            </div>
            <div className="border-t border-gray-700 pt-2">
                <p className="text-muted-foreground font-semibold">User:</p>
                <p className="text-muted-foreground">{lastInteraction.user_message}</p>
                <p className="text-muted-foreground font-semibold mt-1">Bot:</p>
                <p className="text-muted-foreground">{lastInteraction.bot_response}</p>
            </div>
        </div>
    )
}