import type { APIRoute } from 'astro';

// Mock database of tags (in a real app this would be a database)
// Using a simple array for demo purposes
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
  // Additional tags would be defined here...
];

// GET endpoint to retrieve all tags (with pagination if needed)
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '36');
  const sort = url.searchParams.get('sort') || 'popular';
  const query = url.searchParams.get('q')?.toLowerCase() || '';

  // Filter tags by search query if provided
  let filteredTags = tags;
  if (query) {
    filteredTags = tags.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  }

  // Sort the tags based on the sort parameter
  let sortedTags = [...filteredTags];
  switch (sort) {
    case 'popular':
      sortedTags.sort((a, b) => b.count - a.count);
      break;
    case 'name':
      sortedTags.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'new':
      // In a real application, we'd sort by creation date
      // Here we're just shuffling for demonstration
      sortedTags.sort(() => Math.random() - 0.5);
      break;
    default:
      sortedTags.sort((a, b) => b.count - a.count);
  }

  // Paginate results
  const startIndex = (page - 1) * limit;
  const paginatedTags = sortedTags.slice(startIndex, startIndex + limit);

  return new Response(JSON.stringify({
    tags: paginatedTags,
    totalTags: filteredTags.length,
    currentPage: page,
    totalPages: Math.ceil(filteredTags.length / limit),
    sort: sort
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
