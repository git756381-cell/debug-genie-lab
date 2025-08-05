import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, XCircle, Lightbulb, Code2, Zap } from 'lucide-react';

export interface AnalysisResult {
  hasErrors: boolean;
  errors: Array<{
    line: number;
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
    consequence: string;
  }>;
  summary: string;
  codeQuality: number;
  suggestions: string[];
}

interface DebugResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  onFixCode: (errorIndex: number) => void;
}

export const DebugResults = ({ result, isAnalyzing, onFixCode }: DebugResultsProps) => {
  if (isAnalyzing) {
    return (
      <Card className="bg-card border-border shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-center space-y-4 min-h-32">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <h3 className="text-lg font-semibold text-foreground">Analyzing Code...</h3>
              <p className="text-muted-foreground">Our AI is examining your code for errors and improvements</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="bg-card border-border shadow-card">
        <div className="p-6">
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ready for Analysis</h3>
            <p className="text-muted-foreground">
              Click "Analyze Code" to start debugging your code
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="bg-card border-border shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Debug Analysis</h2>
          <div className="flex items-center gap-2">
            <Badge
              variant={result.hasErrors ? "destructive" : "secondary"}
              className={result.hasErrors ? "" : "bg-success/20 text-success border-success/30"}
            >
              {result.hasErrors ? `${result.errors.length} Issues Found` : 'No Issues Found'}
            </Badge>
            <Badge variant="outline" className={`${getQualityColor(result.codeQuality)} border-current`}>
              Quality: {result.codeQuality}%
            </Badge>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Analysis Summary
          </h3>
          <p className="text-foreground">{result.summary}</p>
        </div>

        {/* Errors and Issues */}
        {result.errors.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-foreground">Issues Found:</h3>
            {result.errors.map((error, index) => (
              <Card key={index} className="border-l-4 border-l-destructive bg-error-bg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getErrorIcon(error.type)}
                      <span className="font-semibold text-foreground">
                        Line {error.line}: {error.type.toUpperCase()}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onFixCode(index)}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Auto Fix
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Issue:</h4>
                      <p className="text-muted-foreground">{error.message}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-1">How to Fix:</h4>
                      <p className="text-muted-foreground">{error.suggestion}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Impact if Not Fixed:</h4>
                      <p className="text-muted-foreground">{error.consequence}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* General Suggestions */}
        {result.suggestions.length > 0 && (
          <div>
            <Separator className="my-4" />
            <h3 className="font-semibold text-foreground mb-3">Improvement Suggestions:</h3>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};