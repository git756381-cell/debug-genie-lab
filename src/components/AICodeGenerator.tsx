import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];

const SAMPLE_PROMPTS = [
  "Create a function to calculate the factorial of a number",
  "Build a simple todo list with add, remove, and complete functionality",
  "Generate a responsive navbar component with dropdown menu",
  "Create a binary search algorithm implementation",
  "Build a class for managing a bank account with deposit and withdraw methods",
  "Generate CSS animations for a loading spinner",
  "Create a REST API endpoint for user authentication"
];

interface AICodeGeneratorProps {
  onGenerateCode: (prompt: string, language: string) => void;
  isGenerating: boolean;
  generatedCode: string | null;
}

export const AICodeGenerator = ({ onGenerateCode, isGenerating, generatedCode }: AICodeGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description of what you want to code');
      return;
    }
    onGenerateCode(prompt, language);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success('Generated code copied to clipboard');
    }
  };

  const handleDownload = () => {
    if (generatedCode) {
      const fileExtensions: { [key: string]: string } = {
        javascript: 'js',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        html: 'html',
        css: 'css'
      };
      
      const blob = new Blob([generatedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-code.${fileExtensions[language] || 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Code downloaded successfully');
    }
  };

  const handleSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  return (
    <Card className="bg-card border-border shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">AI Code Generator</h2>
            <Badge variant="secondary" className="bg-gradient-primary text-white border-none">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {/* Sample Prompts */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Quick Start Examples:</h3>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.slice(0, 4).map((samplePrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSamplePrompt(samplePrompt)}
                  className="text-xs border-muted hover:bg-muted"
                >
                  {samplePrompt.slice(0, 40)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Describe what you want to code:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24 resize-none"
              placeholder="E.g., Create a function that sorts an array of numbers in ascending order..."
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-primary text-white border-none shadow-glow"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>

          {/* Generated Code */}
          {(generatedCode || isGenerating) && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Generated Code:</h3>
                  {generatedCode && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="border-muted hover:bg-muted"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="border-muted hover:bg-muted"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  )}
                </div>

                {isGenerating ? (
                  <div className="bg-code-bg border border-code-border rounded-lg p-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground">AI is crafting your code...</p>
                      </div>
                    </div>
                  </div>
                ) : generatedCode ? (
                  <div className="bg-code-bg border border-code-border rounded-lg p-4">
                    <pre className="text-sm text-foreground overflow-x-auto font-mono whitespace-pre-wrap">
                      {generatedCode}
                    </pre>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};