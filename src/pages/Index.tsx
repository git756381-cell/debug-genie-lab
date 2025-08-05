import { useState } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { DebugResults, type AnalysisResult } from '@/components/DebugResults';
import { AICodeGenerator } from '@/components/AICodeGenerator';
import { LanguageStats } from '@/components/LanguageStats';
import { analyzeCode, generateCode } from '@/services/codeAnalysis';
import { toast } from 'sonner';

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleAnalyzeCode = async (code: string, language: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeCode(code, language);
      setAnalysisResult(result);
      
      if (result.hasErrors) {
        toast.error(`Found ${result.errors.length} issue(s) in your code`);
      } else {
        toast.success('No issues found! Your code looks great.');
      }
    } catch (error) {
      toast.error('Failed to analyze code. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCode = async (prompt: string, language: string) => {
    setIsGenerating(true);
    setGeneratedCode(null);
    
    try {
      const code = await generateCode(prompt, language);
      setGeneratedCode(code);
      toast.success('Code generated successfully!');
    } catch (error) {
      toast.error('Failed to generate code. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFixCode = (errorIndex: number) => {
    if (analysisResult && analysisResult.errors[errorIndex]) {
      const error = analysisResult.errors[errorIndex];
      toast.success(`Auto-fix suggestion: ${error.suggestion}`);
      // In a real app, this would apply the fix to the code
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-3xl" />
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Debug & Generate
                </span>
                <br />
                <span className="text-foreground">Code with AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced code analysis and AI-powered generation for multiple programming languages.
                Debug your code, understand errors, and generate new code from natural language.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Code Editor */}
          <div className="lg:col-span-2 space-y-8">
            <CodeEditor 
              onAnalyze={handleAnalyzeCode}
              isAnalyzing={isAnalyzing}
            />
            
            <DebugResults 
              result={analysisResult}
              isAnalyzing={isAnalyzing}
              onFixCode={handleFixCode}
            />
          </div>

          {/* Right Column - AI Generator & Stats */}
          <div className="space-y-8">
            <AICodeGenerator 
              onGenerateCode={handleGenerateCode}
              isGenerating={isGenerating}
              generatedCode={generatedCode}
            />
            
            <LanguageStats />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card border border-border rounded-lg shadow-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Analysis</h3>
            <p className="text-muted-foreground">
              Advanced AI-powered code analysis that identifies errors, suggests fixes, and explains consequences.
            </p>
          </div>

          <div className="text-center p-6 bg-card border border-border rounded-lg shadow-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-secondary/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Code Generation</h3>
            <p className="text-muted-foreground">
              Generate production-ready code from natural language descriptions in multiple programming languages.
            </p>
          </div>

          <div className="text-center p-6 bg-card border border-border rounded-lg shadow-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Language</h3>
            <p className="text-muted-foreground">
              Support for JavaScript, Python, Java, C++, C, HTML, CSS and more programming languages.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-border bg-background/95 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Debug Genie Lab. Powered by AI for developers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;