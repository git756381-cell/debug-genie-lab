import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Code, Save, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { name: 'JavaScript', example: 'console.log("Hello, World!");' },
  { name: 'Python', example: 'print("Hello, World!")' },
  { name: 'Java', example: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { name: 'C++', example: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { name: 'C', example: '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { name: 'PHP', example: '<?php\necho "Hello, World!";\n?>' },
  { name: 'HTML', example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>' },
  { name: 'CSS', example: 'body {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}' }
];

const CodeEditor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    // Load example code when language changes
    const selectedLang = LANGUAGES.find(lang => lang.name === language);
    if (selectedLang && !code) {
      setCode(selectedLang.example);
    }
  }, [language, code]);

  const runCode = () => {
    setIsRunning(true);
    setOutput('');

    setTimeout(() => {
      let result = '';

      try {
        switch (language) {
          case 'JavaScript':
            // Simulate JavaScript execution
            if (code.includes('console.log')) {
              const matches = code.match(/console\.log\((.*?)\)/g);
              if (matches) {
                result = matches.map(match => {
                  const content = match.replace('console.log(', '').replace(')', '');
                  return eval(content);
                }).join('\n');
              }
            } else {
              result = 'Code executed successfully';
            }
            break;
            
          case 'Python':
            // Simulate Python execution
            if (code.includes('print(')) {
              const matches = code.match(/print\((.*?)\)/g);
              if (matches) {
                result = matches.map(match => {
                  const content = match.replace('print(', '').replace(')', '');
                  return content.replace(/['"]/g, '');
                }).join('\n');
              }
            } else {
              result = 'Python code executed successfully';
            }
            break;
            
          case 'HTML':
            result = 'HTML rendered successfully. View the preview in a browser.';
            break;
            
          case 'CSS':
            result = 'CSS styles applied successfully. Use with HTML to see effects.';
            break;
            
          default:
            result = `${language} code executed successfully.\nOutput would appear here in a real compiler environment.`;
        }
      } catch (error) {
        result = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
      }

      setOutput(result);
      setIsRunning(false);
      toast.success('Code executed!');
    }, 1000);
  };

  const saveCode = () => {
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    const project = {
      id: Date.now(),
      name: `${language} Project ${savedProjects.length + 1}`,
      language,
      code,
      timestamp: new Date().toISOString()
    };
    
    savedProjects.push(project);
    localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
    toast.success('Project saved!');
  };

  const downloadCode = () => {
    const extensions: { [key: string]: string } = {
      'JavaScript': 'js',
      'Python': 'py',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'PHP': 'php',
      'HTML': 'html',
      'CSS': 'css'
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
              <div className="p-2 bg-success/10 rounded-lg">
                <Code className="h-6 w-6 text-success" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Code Editor</h1>
                <p className="text-sm text-muted-foreground">Multi-language development environment</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={saveCode} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </div>
                  <div className="flex items-center gap-4">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.name} value={lang.name}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary">{language}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Write your ${language} code here...`}
                  className="min-h-96 font-mono text-sm bg-code-bg border-code-border text-foreground"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={runCode}
                    disabled={isRunning || !code.trim()}
                    className="gap-2 bg-gradient-primary"
                  >
                    <Play className="h-4 w-4" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const selectedLang = LANGUAGES.find(lang => lang.name === language);
                      if (selectedLang) {
                        setCode(selectedLang.example);
                        toast.success('Example loaded!');
                      }
                    }}
                  >
                    Load Example
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Output & Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-code-bg border border-code-border rounded-lg p-4 min-h-96">
                  {isRunning ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Executing code...</p>
                      </div>
                    </div>
                  ) : output ? (
                    <pre className="text-sm text-foreground whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Click "Run Code" to see the output here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Language Info */}
            <Card>
              <CardHeader>
                <CardTitle>Language Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {language === 'JavaScript' && (
                    <div>
                      <p><strong>JavaScript</strong> - Dynamic programming language for web development</p>
                      <p>Use console.log() for output</p>
                    </div>
                  )}
                  {language === 'Python' && (
                    <div>
                      <p><strong>Python</strong> - High-level programming language</p>
                      <p>Use print() for output</p>
                    </div>
                  )}
                  {language === 'Java' && (
                    <div>
                      <p><strong>Java</strong> - Object-oriented programming language</p>
                      <p>Use System.out.println() for output</p>
                    </div>
                  )}
                  {language === 'C++' && (
                    <div>
                      <p><strong>C++</strong> - General-purpose programming language</p>
                      <p>Use std::cout for output</p>
                    </div>
                  )}
                  {language === 'HTML' && (
                    <div>
                      <p><strong>HTML</strong> - Markup language for web pages</p>
                      <p>Structure content with tags</p>
                    </div>
                  )}
                  {language === 'CSS' && (
                    <div>
                      <p><strong>CSS</strong> - Style sheet language</p>
                      <p>Define styles for HTML elements</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeEditor;