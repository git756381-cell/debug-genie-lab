import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Play, Upload, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'c', label: 'C', extension: 'c' },
  { value: 'html', label: 'HTML', extension: 'html' },
  { value: 'css', label: 'CSS', extension: 'css' },
];

const SAMPLE_CODE = {
  javascript: `function calculateSum(a, b) {
    // Missing return statement
    a + b;
}

let result = calculateSum(5, 3);
console.log(result); // Will print undefined`,
  python: `def calculate_sum(a, b):
    # Missing return statement
    a + b

result = calculate_sum(5, 3)
print(result)  # Will print None`,
  java: `public class Calculator {
    public static int calculateSum(int a, int b) {
        // Missing return statement
        a + b;
    }
    
    public static void main(String[] args) {
        int result = calculateSum(5, 3);
        System.out.println(result);
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int calculateSum(int a, int b) {
    // Missing return statement
    a + b;
}

int main() {
    int result = calculateSum(5, 3);
    cout << result << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int calculateSum(int a, int b) {
    // Missing return statement
    a + b;
}

int main() {
    int result = calculateSum(5, 3);
    printf("%d\\n", result);
    return 0;
}`,
  html: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a paragraph</p>
    <!-- Missing closing tag for div -->
    <div>
        <p>Content inside div
</body>
</html>`,
  css: `.container {
    width: 100%;
    height: 100vh;
    background-color: blue;
    /* Missing semicolon */
    color: white
    padding: 20px;
    
    /* Invalid property */
    text-shadow: 2px 2px;
}`
};

interface CodeEditorProps {
  onAnalyze: (code: string, language: string) => void;
  isAnalyzing: boolean;
}

export const CodeEditor = ({ onAnalyze, isAnalyzing }: CodeEditorProps) => {
  const [code, setCode] = useState(SAMPLE_CODE.javascript);
  const [language, setLanguage] = useState('javascript');

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(SAMPLE_CODE[newLanguage as keyof typeof SAMPLE_CODE]);
  };

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }
    onAnalyze(code, language);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="bg-code-bg border-code-border shadow-code">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-foreground">Code Editor</h2>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              Debug Mode
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40 bg-muted border-code-border">
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
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-96 font-mono text-sm bg-gradient-code border-code-border text-foreground resize-none focus:ring-primary/50"
              placeholder="Enter your code here..."
            />
            <div className="absolute top-2 right-2 opacity-70 text-xs text-muted-foreground">
              Lines: {code.split('\n').length}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".js,.py,.java,.cpp,.c,.html,.css,.txt"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="border-code-border hover:bg-muted"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-code-border hover:bg-muted"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};