import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code2, TrendingUp, Activity } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { name: 'JavaScript', icon: '⚡', usage: 95, color: 'text-yellow-400' },
  { name: 'Python', icon: '🐍', usage: 90, color: 'text-blue-400' },
  { name: 'Java', icon: '☕', usage: 85, color: 'text-orange-400' },
  { name: 'C++', icon: '⚙️', usage: 80, color: 'text-purple-400' },
  { name: 'C', icon: '🔧', usage: 75, color: 'text-gray-400' },
  { name: 'HTML', icon: '🌐', usage: 95, color: 'text-red-400' },
  { name: 'CSS', icon: '🎨', usage: 90, color: 'text-blue-400' },
];

export const LanguageStats = () => {
  return (
    <Card className="bg-card border-border shadow-card">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Supported Languages</h3>
          <Badge variant="secondary" className="ml-auto">
            {SUPPORTED_LANGUAGES.length} Languages
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div key={lang.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.icon}</span>
                  <span className="text-sm font-medium text-foreground">{lang.name}</span>
                </div>
                <span className={`text-xs ${lang.color}`}>{lang.usage}%</span>
              </div>
              <Progress value={lang.usage} className="h-1" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-primary">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </div>
              <p className="text-2xl font-bold text-foreground">24/7</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-success">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-foreground">99.9%</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-accent">
                <Code2 className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis</span>
              </div>
              <p className="text-2xl font-bold text-foreground">Real-time</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};