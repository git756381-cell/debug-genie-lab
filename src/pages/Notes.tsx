import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Code, FileText, ExternalLink } from 'lucide-react';

const PROGRAMMING_NOTES = {
  'JavaScript': {
    basics: [
      'Variables: let, const, var',
      'Functions: function declaration vs arrow functions',
      'Objects and Arrays',
      'Conditional statements (if/else, switch)',
      'Loops (for, while, forEach)',
      'Error handling (try/catch)',
    ],
    advanced: [
      'Promises and async/await',
      'ES6+ features (destructuring, spread operator)',
      'DOM manipulation',
      'Event handling',
      'Modules (import/export)',
      'Closures and scope',
    ],
    examples: `// Variables
let name = "John";
const age = 25;

// Functions
const greet = (name) => {
    return \`Hello, \${name}!\`;
};

// Arrays
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// Objects
const person = {
    name: "Alice",
    age: 30,
    greet() {
        console.log(\`Hi, I'm \${this.name}\`);
    }
};`
  },
  'Python': {
    basics: [
      'Variables and data types',
      'Functions with def keyword',
      'Lists, tuples, and dictionaries',
      'Conditional statements',
      'Loops (for, while)',
      'Exception handling (try/except)',
    ],
    advanced: [
      'List comprehensions',
      'Classes and objects',
      'Decorators',
      'Generators and iterators',
      'File handling',
      'Modules and packages',
    ],
    examples: `# Variables
name = "John"
age = 25

# Functions
def greet(name):
    return f"Hello, {name}!"

# Lists
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]

# Classes
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        print(f"Hi, I'm {self.name}, {self.age} years old")`
  },
  'Java': {
    basics: [
      'Class structure and main method',
      'Variables and data types',
      'Methods and parameters',
      'Control structures (if/else, loops)',
      'Arrays',
      'Exception handling',
    ],
    advanced: [
      'Object-oriented programming (inheritance, polymorphism)',
      'Interfaces and abstract classes',
      'Collections framework',
      'Generics',
      'Lambda expressions',
      'Stream API',
    ],
    examples: `// Class definition
public class Person {
    private String name;
    private int age;
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Method
    public void introduce() {
        System.out.println("Hi, I'm " + name + ", " + age + " years old");
    }
    
    // Main method
    public static void main(String[] args) {
        Person person = new Person("Alice", 25);
        person.introduce();
    }
}`
  },
  'HTML': {
    basics: [
      'Document structure (<!DOCTYPE>, html, head, body)',
      'Common tags (h1-h6, p, div, span)',
      'Links and images',
      'Lists (ul, ol, li)',
      'Forms and input elements',
      'Semantic HTML elements',
    ],
    advanced: [
      'HTML5 semantic elements (header, nav, main, footer)',
      'Forms validation',
      'Media elements (video, audio)',
      'Accessibility attributes',
      'Meta tags and SEO',
      'Custom data attributes',
    ],
    examples: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <header>
        <h1>Welcome to My Site</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>About Us</h2>
            <p>This is a paragraph of text.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website</p>
    </footer>
</body>
</html>`
  },
  'CSS': {
    basics: [
      'Selectors (element, class, id)',
      'Properties and values',
      'Colors and units',
      'Box model (margin, padding, border)',
      'Typography (font-family, size, weight)',
      'Layout basics (display, position)',
    ],
    advanced: [
      'Flexbox layout',
      'Grid layout',
      'Responsive design (media queries)',
      'Animations and transitions',
      'CSS variables (custom properties)',
      'Pseudo-classes and pseudo-elements',
    ],
    examples: `/* Basic styling */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

/* Class selector */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Flexbox layout */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: white;
    padding: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
    }
}`
  }
};

const Notes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const languages = Object.keys(PROGRAMMING_NOTES);

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
            <div className="p-2 bg-warning/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Programming Notes</h1>
              <p className="text-sm text-muted-foreground">Study materials and references</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Programming Language</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {selectedLanguage} Study Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basics" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Concepts</h3>
                    <div className="grid gap-3">
                      {PROGRAMMING_NOTES[selectedLanguage as keyof typeof PROGRAMMING_NOTES].basics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Advanced Topics</h3>
                    <div className="grid gap-3">
                      {PROGRAMMING_NOTES[selectedLanguage as keyof typeof PROGRAMMING_NOTES].advanced.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="examples" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Code Examples</h3>
                    <div className="bg-code-bg border border-code-border rounded-lg p-4">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{PROGRAMMING_NOTES[selectedLanguage as keyof typeof PROGRAMMING_NOTES].examples}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Additional Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Official Documentation</h4>
                  <div className="space-y-2 text-sm">
                    {selectedLanguage === 'JavaScript' && (
                      <>
                        <div>• MDN Web Docs - JavaScript</div>
                        <div>• ECMAScript Specifications</div>
                        <div>• Node.js Documentation</div>
                      </>
                    )}
                    {selectedLanguage === 'Python' && (
                      <>
                        <div>• Official Python Documentation</div>
                        <div>• PEP (Python Enhancement Proposals)</div>
                        <div>• Python Package Index (PyPI)</div>
                      </>
                    )}
                    {selectedLanguage === 'Java' && (
                      <>
                        <div>• Oracle Java Documentation</div>
                        <div>• Java API Specification</div>
                        <div>• OpenJDK Documentation</div>
                      </>
                    )}
                    {selectedLanguage === 'HTML' && (
                      <>
                        <div>• MDN Web Docs - HTML</div>
                        <div>• W3C HTML Specifications</div>
                        <div>• HTML5 Specification</div>
                      </>
                    )}
                    {selectedLanguage === 'CSS' && (
                      <>
                        <div>• MDN Web Docs - CSS</div>
                        <div>• W3C CSS Specifications</div>
                        <div>• Can I Use (Browser Support)</div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Practice Platforms</h4>
                  <div className="space-y-2 text-sm">
                    <div>• HackerRank</div>
                    <div>• LeetCode</div>
                    <div>• CodePen (Web technologies)</div>
                    <div>• FreeCodeCamp</div>
                    <div>• Codecademy</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Notes;