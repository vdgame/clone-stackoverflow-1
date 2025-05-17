import type { APIRoute } from 'astro';

// Import the mock users data from the index.ts file
// In a real application, this would be a database query
// For our demo purposes, we're redefining the users array here
const users = [
  {
    id: 1,
    name: "Jon Skeet",
    displayName: "Jon Skeet",
    reputation: 1337621,
    location: "Reading, United Kingdom",
    profileImage: "https://ext.same-assets.com/1773809462/1235678901.jpeg",
    createdAt: new Date("2008-09-26"),
    lastSeen: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    aboutMe: "I'm a software engineer and author with a passion for C# and Java. I work at Google on the .NET team, and I've written several books on C#.",
    website: "https://codeblog.jonskeet.uk/",
    tags: ["c#", "java", "c++", ".net", "linq"],
    badges: {
      gold: 213,
      silver: 1729,
      bronze: 2918
    },
    stats: {
      questionCount: 73,
      answerCount: 35928,
      acceptedAnswerCount: 6754,
      voteCount: 482741
    },
    // Additional data for user profile page
    recentActivity: [
      {
        type: 'answer',
        title: 'How to handle nullable types in C# 9',
        link: '/questions/12345',
        votes: 42,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        type: 'question',
        title: 'Optimizing LINQ queries for large datasets',
        link: '/questions/12346',
        votes: 28,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        type: 'comment',
        title: 'Comment on "Java vs C# performance comparison"',
        link: '/questions/12347',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    ],
    topTags: [
      { name: 'c#', score: 9821, posts: 8473 },
      { name: 'java', score: 6542, posts: 5128 },
      { name: '.net', score: 4251, posts: 3791 },
      { name: 'linq', score: 3187, posts: 2856 },
      { name: 'c++', score: 1923, posts: 1782 }
    ],
    topQuestions: [
      { title: 'Parameter vs. Argument', votes: 3124, answers: 4, link: '/questions/12348' },
      { title: 'What is the difference between const and readonly?', votes: 2865, answers: 6, link: '/questions/12349' },
      { title: 'Why is Dictionary<string, string> faster than other data structures?', votes: 2413, answers: 5, link: '/questions/12350' }
    ],
    topAnswers: [
      { title: 'Why does 0.1 + 0.2 not equal 0.3 in floating-point arithmetic?', votes: 8976, accepted: true, link: '/questions/12351' },
      { title: 'What is the difference between a deep copy and a shallow copy?', votes: 7632, accepted: true, link: '/questions/12352' },
      { title: 'How do I convert a String to an int in Java?', votes: 6921, accepted: true, link: '/questions/12353' }
    ]
  },
  {
    id: 2,
    name: "Gordon Linoff",
    displayName: "Gordon Linoff",
    reputation: 983472,
    location: "New York, United States",
    profileImage: "https://ext.same-assets.com/1773809462/7615090187.jpeg",
    createdAt: new Date("2011-05-29"),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    aboutMe: "Data science practitioner and author with focus on SQL and data analysis.",
    website: "https://www.data-miners.com/",
    tags: ["sql", "mysql", "sql-server", "database", "postgresql"],
    badges: {
      gold: 178,
      silver: 1365,
      bronze: 2103
    },
    stats: {
      questionCount: 39,
      answerCount: 28376,
      acceptedAnswerCount: 4911,
      voteCount: 321856
    },
    // Additional data for user profile
    recentActivity: [
      {
        type: 'answer',
        title: 'How to optimize a complex SQL query with multiple joins',
        link: '/questions/23456',
        votes: 38,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        type: 'answer',
        title: 'SQL Server vs MySQL performance comparison',
        link: '/questions/23457',
        votes: 22,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ],
    topTags: [
      { name: 'sql', score: 12453, posts: 10872 },
      { name: 'mysql', score: 8937, posts: 7654 },
      { name: 'sql-server', score: 7251, posts: 6321 },
      { name: 'postgresql', score: 5128, posts: 4321 },
      { name: 'database', score: 4372, posts: 3812 }
    ],
    topQuestions: [
      { title: 'Why use a view instead of a stored procedure?', votes: 1872, answers: 7, link: '/questions/23458' },
      { title: 'What are the performance implications of multiple COUNT(*) in a single query?', votes: 1635, answers: 5, link: '/questions/23459' }
    ],
    topAnswers: [
      { title: 'How to efficiently paginate results in MySQL', votes: 5423, accepted: true, link: '/questions/23460' },
      { title: 'What`s the difference between INNER JOIN and OUTER JOIN?', votes: 4921, accepted: true, link: '/questions/23461' },
      { title: 'How to optimize SQL queries for large datasets', votes: 4732, accepted: true, link: '/questions/23462' }
    ]
  },
  // Other users from the index.ts file would be included here
];

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Find the user with the given ID
  const user = users.find(user => user.id.toString() === id);

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify({ user }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
