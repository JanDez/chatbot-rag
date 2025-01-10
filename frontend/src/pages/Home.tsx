import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Rocket, Target, Users, Zap, MessageCircle, Menu, ArrowRight } from 'lucide-react'
import { ChatWindow } from '../components/ChatWindow'
import { useUserStore } from '../store/userStore'

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { userData } = useUserStore()

  const handleChatClick = () => {
    console.log('Chat bubble clicked');
    if (!userData) {
      console.log('No user data, opening chat');
      setIsChatOpen(true);
    } else {
      console.log('User data exists, opening chat');
      setIsChatOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logoipsum-placeholder.svg"
              alt="Promtior Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-foreground text-xl font-semibold">Promtior</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Case Studies', 'About Us', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
          <nav className="container mx-auto px-4 py-4">
            {['Home', 'Services', 'Case Studies', 'About Us', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="block py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
            <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground to-muted-foreground/50 bg-clip-text text-transparent">
              Accelerate your GenAI adoption
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl">
              We boost operational efficiency in businesses with customized GenAI solutions, from
              discovery and development to implementation.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 to-blue-500/40 rounded-full blur-2xl animate-pulse delay-700" />
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <h2 className="text-muted-foreground text-center mb-12">Trusted by Industry Leaders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {[...Array(6)].map((_, i) => (
            <img
              key={i}
              src="/logoipsum-companies.svg"
              alt={`Client Logo ${i + 1}`}
              width={120}
              height={40}
              className="h-8 w-auto opacity-50 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Comprehensive GenAI Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From strategy to implementation, we help businesses harness the power of Generative AI
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI Strategy Consulting",
              description: "Define your AI roadmap and identify high-impact opportunities"
            },
            {
              icon: Rocket,
              title: "Custom AI Development",
              description: "Build and deploy tailored AI solutions for your specific needs"
            },
            {
              icon: Users,
              title: "AI Implementation",
              description: "Seamlessly integrate AI solutions into your existing workflows"
            }
          ].map((service, i) => (
            <Card 
              key={i} 
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-8">
                <service.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-b from-background to-background/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why Choose Promtior?
          </h2>
          <p className="text-muted-foreground text-lg">
            We combine deep technical expertise with business acumen to deliver results
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              icon: Target,
              title: "Expertise",
              description: "Deep understanding of GenAI technologies and their applications"
            },
            {
              icon: Zap,
              title: "Speed",
              description: "Rapid development and deployment of AI solutions"
            },
            {
              icon: Users,
              title: "Support",
              description: "Dedicated team for ongoing maintenance and optimization"
            }
          ].map((feature, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <a href="/" className="flex items-center gap-2 mb-6">
                <img
                  src="/logoipsum-placeholder.svg"
                  alt="Promtior Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-foreground text-lg font-semibold">Promtior</span>
              </a>
              <p className="text-muted-foreground">
                Accelerating business transformation through GenAI innovation
              </p>
            </div>
            {['Solutions', 'Company', 'Resources'].map((section) => (
              <div key={section}>
                <h3 className="text-foreground font-semibold mb-6">{section}</h3>
                <ul className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <li key={i}>
                      <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {section} Link {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} Promtior. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 z-50"
        onClick={handleChatClick}
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat Window */}
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}