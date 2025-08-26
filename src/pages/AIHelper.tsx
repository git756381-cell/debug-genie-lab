import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Send, Copy, Loader2, Bot, User } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCL_uHx19r8a25YTSZ9drRlDQKEMIreMH4');

const LANGUAGES = [
  'JavaScript', 'Python', 'Java', 'C++', 'C', 'PHP', 'HTML', 'CSS', 'TypeScript', 'Go'
];

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIHelper = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const askAI = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are an expert ${language} programming assistant. 
        The user has asked: "${question}"
        
        Please provide:
        1. A clear explanation
        2. Code examples if relevant (properly formatted)
        3. Best practices if applicable
        4. Common pitfalls to avoid
        
        Make your response beginner-friendly but comprehensive.
        Format code blocks with proper syntax highlighting indicators.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.text(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      toast.success('Response generated!');
    } catch (error: any) {
      console.error('AI Helper error:', error);
      if (error.message?.includes('overloaded')) {
        toast.error('AI service is busy. Please try again in a moment.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const formatContent = (content: string) => {
    // Split content into code blocks and regular text
    const parts = content.split(/```(\w+)?\n?([\s\S]*?)```/);
    
    return parts.map((part, index) => {
      if (index % 3 === 2) {
        // This is code content
        return (
          <div key={index} className="relative">
            <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-sm">
              <code>{part}</code>
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(part)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      } else if (index % 3 === 0) {
        // This is regular text
        return <div key={index} className="whitespace-pre-wrap">{part}</div>;
      }
      return null;
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Code Assistant</h1>
              <p className="text-sm text-muted-foreground">Ask anything about programming</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Preferred Language:</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="min-h-96">
            <CardHeader>
              <CardTitle>Chat with AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me anything about programming! I'm here to help.</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {message.type === 'assistant' ? (
                          formatContent(message.content)
                        ) : (
                          <div>{message.content}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me about coding concepts, debugging, best practices, algorithms, or request code examples..."
                  className="min-h-20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      askAI();
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Tip: Press Ctrl+Enter to send
                  </div>
                  <Button 
                    onClick={askAI}
                    disabled={isLoading || !question.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Ask AI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'How do I create a loop in ' + language + '?',
                  'Best practices for error handling',
                  'How to optimize code performance?',
                  'Explain object-oriented concepts',
                  'Database connection examples',
                  'API integration patterns'
                ].map((quickQuestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-3"
                    onClick={() => setQuestion(quickQuestion)}
                  >
                    {quickQuestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIHelper;