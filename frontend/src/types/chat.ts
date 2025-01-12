interface Interaction {
    timestamp: string
    user_message: string
    bot_response: string
  }
  
  interface UserInteractions {
    user_email: string
    user_name: string
    interactions: Interaction[]
  }
  
  export type { Interaction, UserInteractions }