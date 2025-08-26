import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bug, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use the environment variable for the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCL_uHx19r8a25YTSZ9drRlDQKEMIreMH4');

const LANGUAGES = [
  'JavaScript', 'Python', 'Java', 'C++', 'C', 'PHP', 'HTML', 'CSS', 'TypeScript', 'Go'
];

interface ErrorAnalysis {
  hasErrors: boolean;
  errors: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    solution?: string;
  }>;
  suggestions: string[];
  codeQuality: number;
}

const ErrorDetection = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ErrorAnalysis | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Analyze this ${language} code for errors, warnings, and improvements. 
        Provide a detailed JSON response with the following structure:
        {
          "hasErrors": boolean,
          "errors": [
            {
              "type": "error" | "warning" | "info",
              "message": "Description of the issue",
              "line": line_number_if_applicable,
              "solution": "How to fix this issue"
            }
          ],
          "suggestions": ["General improvement suggestions"],
          "codeQuality": score_out_of_10
        }
        
        Code to analyze:
        ${code}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let analysisText = response.text();
      
      // Clean up the response to extract JSON
      analysisText = analysisText.replace(/```json\s*|\s*```/g, '').trim();
      
      try {
        const parsedAnalysis = JSON.parse(analysisText);
        setAnalysis(parsedAnalysis);
        toast.success('Code analysis complete!');
      } catch (parseError) {
        // Fallback: create a simple analysis from the text response
        setAnalysis({
          hasErrors: analysisText.toLowerCase().includes('error'),
          errors: [{
            type: 'info',
            message: analysisText,
            solution: 'Review the analysis above for detailed feedback'
          }],
          suggestions: ['Consider following best practices for cleaner code'],
          codeQuality: 7
        });
        toast.success('Analysis complete (text format)');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      if (error.message?.includes('overloaded')) {
        toast.error('AI service is busy. Please try again in a moment.');
      } else {
        toast.error('Failed to analyze code. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info': return <Info className="h-5 w-5 text-primary" />;
      default: return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-destructive';
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
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Bug className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Error Detection Lab</h1>
              <p className="text-sm text-muted-foreground">AI-powered code analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Code Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
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
                
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here for error analysis..."
                  className="min-h-96 font-mono text-sm bg-code-bg border-code-border"
                />
                
                <Button 
                  onClick={analyzeCode}
                  disabled={isAnalyzing || !code.trim()}
                  className="w-full bg-gradient-primary"
                >
                  {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isAnalyzing ? 'Analyzing Code...' : 'Analyze for Errors'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results Section */}
          <div className="space-y-4">
            {isAnalyzing && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analyzing Your Code</h3>
                  <p className="text-muted-foreground">Our AI is examining your code for issues...</p>
                </CardContent>
              </Card>
            )}

            {!isAnalyzing && !analysis && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready for Analysis</h3>
                  <p className="text-muted-foreground">
                    Paste your code and click analyze to get detailed error detection and solutions.
                  </p>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="space-y-4">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Analysis Summary</span>
                      <Badge variant={analysis.hasErrors ? "destructive" : "default"}>
                        {analysis.hasErrors ? 'Issues Found' : 'All Good'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Code Quality Score:</span>
                      <span className={`font-bold text-lg ${getQualityColor(analysis.codeQuality)}`}>
                        {analysis.codeQuality}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysis.hasErrors ? (
                        <>
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <span className="text-destructive">Issues detected that need attention</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 text-success" />
                          <span className="text-success">No critical errors found</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Issues */}
                {analysis.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.errors.map((error, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-start gap-3">
                            {getErrorIcon(error.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{error.message}</span>
                                {error.line && (
                                  <Badge variant="outline" className="text-xs">
                                    Line {error.line}
                                  </Badge>
                                )}
                              </div>
                              {error.solution && (
                                <div className="text-sm text-muted-foreground">
                                  <strong>Solution:</strong> {error.solution}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorDetection;