export function getSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    // Simple sentiment analysis (replace with your actual logic)
    if (message.toLowerCase().includes('thank') || message.toLowerCase().includes('good')) return 'positive'
    if (message.toLowerCase().includes('bad') || message.toLowerCase().includes('error')) return 'negative'
    return 'neutral'
  }