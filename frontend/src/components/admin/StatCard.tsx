import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string
    value: string
    icon: LucideIcon
    change: string
  }
  
  export function StatCard({ title, value, icon: Icon, change }: StatCardProps) {
    return (
      <div className="bg-gray-900/50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-muted-foreground">{title}</h4>
          <Icon className="text-primary" size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-green-500">{change}</p>
        </div>
      </div>
    )
  }