import { AnalysisResult } from '@/components/DebugResults';

// Simulated code analysis - In a real app, this would call an AI service
export const analyzeCode = async (code: string, language: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const errors = [];
  let codeQuality = 90;
  const suggestions = [];

  // Language-specific analysis patterns
  const analysisPatterns = {
    javascript: [
      { pattern: /function\s+\w+\([^)]*\)\s*{[^}]*[^}return]/g, message: 'Function missing return statement', line: 2 },
      { pattern: /console\.log\s*\(/g, message: 'Console.log statement found', line: 6 },
      { pattern: /var\s+/g, message: 'Use let or const instead of var', line: 5 },
    ],
    python: [
      { pattern: /def\s+\w+\([^)]*\):[^return]*$/gm, message: 'Function missing return statement', line: 2 },
      { pattern: /print\s*\(/g, message: 'Print statement found', line: 4 },
    ],
    java: [
      { pattern: /public\s+static\s+\w+\s+\w+\([^)]*\)\s*{[^}]*[^}return]/g, message: 'Method missing return statement', line: 2 },
      { pattern: /System\.out\.print/g, message: 'System.out.print statement found', line: 7 },
    ],
    cpp: [
      { pattern: /\w+\s+\w+\([^)]*\)\s*{[^}]*[^}return]/g, message: 'Function missing return statement', line: 5 },
      { pattern: /cout\s*<</, message: 'cout statement found', line: 9 },
    ],
    c: [
      { pattern: /\w+\s+\w+\([^)]*\)\s*{[^}]*[^}return]/g, message: 'Function missing return statement', line: 5 },
      { pattern: /printf\s*\(/g, message: 'printf statement found', line: 9 },
    ],
    html: [
      { pattern: /<div[^>]*>(?:(?!<\/div>).)*$/gm, message: 'Unclosed div tag', line: 8 },
      { pattern: /<\w+[^>]*>(?:(?!<\/\w+>).)*$/gm, message: 'Unclosed HTML tag', line: 9 },
    ],
    css: [
      { pattern: /[^;{}]+:[^;{}]+(?!;)/g, message: 'Missing semicolon in CSS property', line: 5 },
      { pattern: /text-shadow\s*:\s*[^;]*[^;]/g, message: 'Invalid text-shadow syntax', line: 8 },
    ],
  };

  const patterns = analysisPatterns[language as keyof typeof analysisPatterns] || [];

  patterns.forEach(({ pattern, message, line }) => {
    if (pattern.test(code)) {
      errors.push({
        line,
        type: 'error' as const,
        message,
        suggestion: getSuggestion(message, language),
        consequence: getConsequence(message, language),
      });
      codeQuality -= 15;
    }
  });

  // Add some general suggestions based on language
  if (language === 'javascript') {
    suggestions.push('Consider using async/await for better readability');
    suggestions.push('Add error handling with try-catch blocks');
  } else if (language === 'python') {
    suggestions.push('Follow PEP 8 style guidelines');
    suggestions.push('Add type hints for better code documentation');
  } else if (language === 'java') {
    suggestions.push('Use meaningful variable names');
    suggestions.push('Consider using proper exception handling');
  }

  const hasErrors = errors.length > 0;
  const summary = hasErrors 
    ? `Found ${errors.length} issue(s) in your ${language} code. The main problems are related to missing return statements and debugging statements.`
    : `Your ${language} code looks good! No major issues detected.`;

  return {
    hasErrors,
    errors,
    summary,
    codeQuality: Math.max(codeQuality, 0),
    suggestions,
  };
};

const getSuggestion = (message: string, language: string): string => {
  if (message.includes('return statement')) {
    switch (language) {
      case 'javascript':
        return 'Add "return a + b;" at the end of your function to return the calculated value.';
      case 'python':
        return 'Add "return a + b" at the end of your function to return the calculated value.';
      case 'java':
      case 'cpp':
      case 'c':
        return 'Add "return a + b;" at the end of your function to return the calculated value.';
      default:
        return 'Add a return statement to return the calculated value.';
    }
  }
  
  if (message.includes('Console.log') || message.includes('Print') || message.includes('cout') || message.includes('printf')) {
    return 'Remove debug statements before production or use a proper logging library.';
  }
  
  if (message.includes('var')) {
    return 'Replace "var" with "let" for block-scoped variables or "const" for constants.';
  }
  
  if (message.includes('Unclosed')) {
    return 'Add the missing closing tag to properly structure your HTML.';
  }
  
  if (message.includes('semicolon')) {
    return 'Add a semicolon (;) at the end of the CSS property declaration.';
  }
  
  return 'Review the code structure and fix the identified issue.';
};

const getConsequence = (message: string, language: string): string => {
  if (message.includes('return statement')) {
    return 'The function will return undefined instead of the expected calculated value, causing unexpected behavior in your application.';
  }
  
  if (message.includes('Console.log') || message.includes('Print') || message.includes('cout') || message.includes('printf')) {
    return 'Debug statements will clutter the output and may expose sensitive information in production.';
  }
  
  if (message.includes('var')) {
    return 'Using "var" can lead to scope-related bugs and unexpected variable hoisting behavior.';
  }
  
  if (message.includes('Unclosed')) {
    return 'Unclosed tags will break the HTML structure and may cause layout issues or invalid markup.';
  }
  
  if (message.includes('semicolon')) {
    return 'Missing semicolons can cause CSS properties to be ignored and styling to not work as expected.';
  }
  
  return 'This issue may cause runtime errors or unexpected behavior in your application.';
};

// Simulated AI code generation
export const generateCode = async (prompt: string, language: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Simple code generation based on prompt keywords
  const templates = {
    javascript: {
      factorial: `function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

// Example usage
console.log(factorial(5)); // Output: 120`,
      
      todo: `class TodoList {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }
    
    add(text) {
        this.todos.push({
            id: this.nextId++,
            text: text,
            completed: false
        });
    }
    
    remove(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }
    
    complete(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = true;
        }
    }
    
    getAll() {
        return this.todos;
    }
}`,
      
      default: `// Generated JavaScript code based on your request
function processData(data) {
    // Process the input data
    const result = data.map(item => {
        return {
            ...item,
            processed: true,
            timestamp: new Date().toISOString()
        };
    });
    
    return result;
}

// Example usage
const sampleData = [{ name: 'Item 1' }, { name: 'Item 2' }];
console.log(processData(sampleData));`
    },
    
    python: {
      factorial: `def factorial(n):
    """Calculate the factorial of a number."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Example usage
print(factorial(5))  # Output: 120`,
      
      todo: `class TodoList:
    def __init__(self):
        self.todos = []
        self.next_id = 1
    
    def add(self, text):
        """Add a new todo item."""
        self.todos.append({
            'id': self.next_id,
            'text': text,
            'completed': False
        })
        self.next_id += 1
    
    def remove(self, todo_id):
        """Remove a todo item by ID."""
        self.todos = [todo for todo in self.todos if todo['id'] != todo_id]
    
    def complete(self, todo_id):
        """Mark a todo item as completed."""
        for todo in self.todos:
            if todo['id'] == todo_id:
                todo['completed'] = True
                break
    
    def get_all(self):
        """Get all todo items."""
        return self.todos`,
      
      default: `# Generated Python code based on your request
def process_data(data):
    """Process a list of data items."""
    result = []
    for item in data:
        processed_item = {
            **item,
            'processed': True,
            'timestamp': str(datetime.now())
        }
        result.append(processed_item)
    
    return result

# Example usage
from datetime import datetime
sample_data = [{'name': 'Item 1'}, {'name': 'Item 2'}]
print(process_data(sample_data))`
    }
  };

  // Determine which template to use based on prompt
  let template = 'default';
  if (prompt.toLowerCase().includes('factorial')) {
    template = 'factorial';
  } else if (prompt.toLowerCase().includes('todo')) {
    template = 'todo';
  }

  const languageTemplates = templates[language as keyof typeof templates];
  if (languageTemplates) {
    return languageTemplates[template as keyof typeof languageTemplates] || languageTemplates.default;
  }

  // Fallback for other languages
  return `// Generated ${language} code for: ${prompt}
// This is a placeholder implementation
// In a real application, this would be generated by an AI model

int main() {
    // Your code implementation here
    return 0;
}`;
};