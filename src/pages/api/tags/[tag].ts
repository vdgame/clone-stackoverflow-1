import type { APIRoute } from 'astro';

// Mock database of tags (in a real app this would be a database)
const tags = [
  {
    name: "javascript",
    count: 2422153,
    description: "For questions about JavaScript, a programming language widely used for client-side web development as well as server-side with Node.js.",
    excerpt: "JavaScript (not to be confused with Java) is a high-level, dynamic, multi-paradigm, object-oriented, prototype-based, weakly-typed, and interpreted programming language used for both client-side and server-side scripting.",
    popularQuestions: [
      { id: 1, title: "How to check if an array includes a value in JavaScript?", views: 2500000, answers: 25 },
      { id: 2, title: "How to remove a property from a JavaScript object", views: 1800000, answers: 18 },
      { id: 3, title: "How to check whether a string contains a substring in JavaScript?", views: 1500000, answers: 12 }
    ],
    relatedTags: ["typescript", "react", "node.js", "html", "jquery", "css", "vue.js", "angular", "reactjs"],
    stats: {
      questionsToday: 45,
      questionsThisWeek: 328,
      questionsThisMonth: 1256,
      questionsTotal: 2422153,
      askers: 845602,
      answerers: 298410
    }
  },
  {
    name: "python",
    count: 2115854,
    description: "Python is a multi-paradigm, dynamically typed, multipurpose programming language. It is designed to be quick to learn, understand, and use.",
    excerpt: "Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically-typed and garbage-collected.",
    popularQuestions: [
      { id: 4, title: "How to check if a file exists in Python", views: 2100000, answers: 22 },
      { id: 5, title: "How to concatenate two lists in Python", views: 1750000, answers: 15 },
      { id: 6, title: "How to merge two dictionaries in Python", views: 1450000, answers: 19 }
    ],
    relatedTags: ["pandas", "django", "numpy", "flask", "tensorflow", "machine-learning", "matplotlib", "data-science"],
    stats: {
      questionsToday: 58,
      questionsThisWeek: 412,
      questionsThisMonth: 1458,
      questionsTotal: 2115854,
      askers: 725340,
      answerers: 245120
    }
  },
  {
    name: "java",
    count: 1879767,
    description: "Java is a high-level object-oriented programming language. Use this tag when you're having problems using or understanding the language itself.",
    excerpt: "Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible.",
    popularQuestions: [
      { id: 7, title: "How to convert String to int in Java", views: 1950000, answers: 24 },
      { id: 8, title: "How to split a string in Java", views: 1550000, answers: 16 },
      { id: 9, title: "Reading a plain text file in Java", views: 1325000, answers: 14 }
    ],
    relatedTags: ["spring", "android", "spring-boot", "hibernate", "maven", "jdbc", "kotlin", "jpa", "json"],
    stats: {
      questionsToday: 32,
      questionsThisWeek: 274,
      questionsThisMonth: 1185,
      questionsTotal: 1879767,
      askers: 632450,
      answerers: 215340
    }
  },
  {
    name: "c#",
    count: 1616187,
    description: "C# (pronounced \"see sharp\") is a high-level, statically typed, multi-paradigm programming language developed by Microsoft.",
    excerpt: "C# is a general-purpose, multi-paradigm programming language encompassing strong typing, lexically scoped, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines.",
    popularQuestions: [
      { id: 10, title: "How to convert a string to an integer in C#", views: 1890000, answers: 20 },
      { id: 11, title: "Difference between decimal, float and double in .NET", views: 1650000, answers: 18 },
      { id: 12, title: "How do I check if a string contains a specific word?", views: 1425000, answers: 13 }
    ],
    relatedTags: [".net", "asp.net", "wpf", "entity-framework", "linq", "asp.net-mvc", "xamarin", "xaml", "winforms"],
    stats: {
      questionsToday: 29,
      questionsThisWeek: 258,
      questionsThisMonth: 1102,
      questionsTotal: 1616187,
      askers: 578540,
      answerers: 198250
    }
  },
  {
    name: "php",
    count: 1467584,
    description: "PHP is a widely used, open source, general-purpose, multi-paradigm, dynamically typed and interpreted scripting language designed for server-side web development.",
    excerpt: "PHP is a server-side scripting language designed for web development but also used as a general-purpose programming language. Originally, PHP stood for Personal Home Page, but it now stands for the recursive initialism PHP: Hypertext Preprocessor.",
    popularQuestions: [
      { id: 13, title: "How do I redirect to another webpage?", views: 1780000, answers: 19 },
      { id: 14, title: "How to check if an array is empty or exists in PHP?", views: 1630000, answers: 15 },
      { id: 15, title: "How do I output an image in PHP?", views: 1350000, answers: 11 }
    ],
    relatedTags: ["mysql", "laravel", "sql", "html", "javascript", "wordpress", "symfony", "ajax", "jquery"],
    stats: {
      questionsToday: 25,
      questionsThisWeek: 235,
      questionsThisMonth: 968,
      questionsTotal: 1467584,
      askers: 542130,
      answerers: 185430
    }
  },
  // Additional tags could be added here
];

export const GET: APIRoute = async ({ params, request }) => {
  const tagName = params.tag?.toLowerCase();

  if (!tagName) {
    return new Response(JSON.stringify({ error: 'Tag name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const tag = tags.find(t => t.name.toLowerCase() === tagName);

  if (!tag) {
    // If the tag doesn't exist in our mock database, create a generic one
    const genericTag = {
      name: tagName,
      count: Math.floor(Math.random() * 1000) + 100,
      description: `Questions about ${tagName}.`,
      excerpt: `${tagName} is a technology used in software development.`,
      popularQuestions: [],
      relatedTags: [],
      stats: {
        questionsToday: Math.floor(Math.random() * 20),
        questionsThisWeek: Math.floor(Math.random() * 100) + 20,
        questionsThisMonth: Math.floor(Math.random() * 400) + 100,
        questionsTotal: Math.floor(Math.random() * 10000) + 100,
        askers: Math.floor(Math.random() * 5000) + 100,
        answerers: Math.floor(Math.random() * 1000) + 50
      }
    };

    return new Response(JSON.stringify(genericTag), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(tag), {
    headers: { 'Content-Type': 'application/json' }
  });
};
