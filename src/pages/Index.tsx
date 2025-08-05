import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyDJLeQ0jVM7VtKI4dM4JjNgRR-wY92vNog';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const LANGUAGES = [
  'JavaScript',
  'Python', 
  'Java',
  'C++',
  'HTML',
  'CSS'
];

const Index = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const promptText = `Check this ${language} code for errors and explain any problems in simple, beginner-friendly language:\n\n${code}`;
      
      const result = await model.generateContent(promptText);
      const response = await result.response;
      setResult(response.text());
      toast.success('Code checked!');
    } catch (error) {
      toast.error('Error checking code');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const promptText = `Generate simple ${language} code for: ${prompt}. Make it beginner-friendly with comments.`;
      
      const result = await model.generateContent(promptText);
      const response = await result.response;
      setCode(response.text().replace(/```[\w]*\n?/g, '').replace(/```/g, ''));
      toast.success('Code generated!');
    } catch (error) {
      toast.error('Error generating code');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Simple Code Helper</h1>
          <p className="text-muted-foreground">Check your code for errors or generate new code with AI</p>
        </div>

        {/* Language Selection */}
        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium">Language:</label>
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
        </Card>

        {/* Code Input */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Code</h2>
              <Badge variant="secondary">Input</Badge>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="min-h-64 font-mono text-sm"
            />
            <Button 
              onClick={checkCode} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Checking...' : 'Check for Errors'}
            </Button>
          </div>
        </Card>

        {/* AI Code Generator */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generate Code</h2>
              <Badge variant="outline">AI Generator</Badge>
            </div>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what code you want (e.g., 'a function to add two numbers')"
            />
            <Button 
              onClick={generateCode} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Generate Code'}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Results</h2>
                <Badge variant="destructive">Analysis</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;