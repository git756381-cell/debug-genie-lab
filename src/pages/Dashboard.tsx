import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  MessageCircleQuestion, 
  Code, 
  BookOpen, 
  User, 
  LogOut,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const features = [
    {
      title: 'Error Detection',
      description: 'Paste your code and get instant error analysis with solutions',
      icon: Bug,
      path: '/error-detection',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      badge: 'Debug'
    },
    {
      title: 'AI Code Helper',
      description: 'Ask questions and get code solutions from AI',
      icon: MessageCircleQuestion,
      path: '/ai-helper',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      badge: 'AI Powered'
    },
    {
      title: 'Code Editor',
      description: 'Multi-language code editor with live results',
      icon: Code,
      path: '/code-editor',
      color: 'text-success',
      bgColor: 'bg-success/10',
      badge: 'Editor'
    },
    {
      title: 'Study Notes',
      description: 'Access programming tutorials and documentation',
      icon: BookOpen,
      path: '/notes',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      badge: 'Learn'
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AskIt CodeLab</h1>
              <p className="text-sm text-muted-foreground">Professional Coding Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Welcome, {user.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Intelligent Development Environment</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Choose Your Coding Adventure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your programming skills with our AI-powered tools and comprehensive learning resources.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.path}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-glow hover:-translate-y-1 border-2 hover:border-primary/20"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Target className="h-4 w-4" />
                      <span>Click to access</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-8 shadow-glow">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Code?</h3>
              <p className="text-primary-foreground/80">
                Join thousands of developers improving their skills with AI assistance
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm opacity-80">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-80">AI Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm opacity-80">Learning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;