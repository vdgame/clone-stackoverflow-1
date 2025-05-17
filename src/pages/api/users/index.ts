import type { APIRoute } from 'astro';

// Mock database of users (in a real app this would be a database)
// Using a simple array for demo purposes
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
    }
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
    }
  },
  {
    id: 3,
    name: "VonC",
    displayName: "VonC",
    reputation: 893147,
    location: "France",
    profileImage: "https://ext.same-assets.com/1773809462/5617290387.jpeg",
    createdAt: new Date("2008-10-01"),
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    aboutMe: "Git expert and open source contributor.",
    website: "",
    tags: ["git", "github", "version-control", "unix", "bash"],
    badges: {
      gold: 161,
      silver: 1592,
      bronze: 2281
    },
    stats: {
      questionCount: 195,
      answerCount: 27183,
      acceptedAnswerCount: 5216,
      voteCount: 298734
    }
  },
  {
    id: 4,
    name: "BalusC",
    displayName: "BalusC",
    reputation: 1064297,
    location: "Amsterdam, Netherlands",
    profileImage: "https://ext.same-assets.com/1773809462/4615090187.jpeg",
    createdAt: new Date("2008-12-15"),
    lastSeen: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    aboutMe: "Java and JSF expert, active in open source community.",
    website: "https://balusc.omnifaces.org/",
    tags: ["java", "jsf", "servlets", "jpa", "rest"],
    badges: {
      gold: 203,
      silver: 1631,
      bronze: 2510
    },
    stats: {
      questionCount: 128,
      answerCount: 25741,
      acceptedAnswerCount: 6021,
      voteCount: 376218
    }
  },
  {
    id: 5,
    name: "admbrill",
    displayName: "Adam Brill",
    reputation: 1,
    location: "San Francisco, California",
    profileImage: "https://ext.same-assets.com/1773809462/1615090187.jpeg",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lastSeen: new Date(), // Now
    aboutMe: "New to programming, learning as I go.",
    website: "",
    tags: ["javascript", "html", "css"],
    badges: {
      gold: 0,
      silver: 0,
      bronze: 1
    },
    stats: {
      questionCount: 1,
      answerCount: 0,
      acceptedAnswerCount: 0,
      voteCount: 0
    }
  },
  {
    id: 6,
    name: "jfriend00",
    displayName: "jfriend00",
    reputation: 731058,
    location: "United States",
    profileImage: "https://ext.same-assets.com/1773809462/3615090187.jpeg",
    createdAt: new Date("2011-07-12"),
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    aboutMe: "JavaScript expert and mentor.",
    website: "",
    tags: ["javascript", "node.js", "promise", "async-await", "jquery"],
    badges: {
      gold: 95,
      silver: 835,
      bronze: 1128
    },
    stats: {
      questionCount: 42,
      answerCount: 18274,
      acceptedAnswerCount: 4102,
      voteCount: 251935
    }
  },
  {
    id: 7,
    name: "CommonsWare",
    displayName: "CommonsWare",
    reputation: 693814,
    location: "United States",
    profileImage: "https://ext.same-assets.com/1773809462/2615090187.jpeg",
    createdAt: new Date("2009-01-05"),
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    aboutMe: "Android developer and book author.",
    website: "https://commonsware.com/",
    tags: ["android", "java", "kotlin", "android-studio", "android-jetpack"],
    badges: {
      gold: 112,
      silver: 972,
      bronze: 1408
    },
    stats: {
      questionCount: 95,
      answerCount: 17856,
      acceptedAnswerCount: 3892,
      voteCount: 243718
    }
  },
  {
    id: 8,
    name: "anubhava",
    displayName: "anubhava",
    reputation: 619352,
    location: "India",
    profileImage: "https://ext.same-assets.com/1773809462/9615090187.jpeg",
    createdAt: new Date("2012-03-14"),
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    aboutMe: "Web developer with focus on regular expressions and JavaScript.",
    website: "",
    tags: ["regex", "javascript", "php", "apache", "htaccess"],
    badges: {
      gold: 87,
      silver: 782,
      bronze: 1105
    },
    stats: {
      questionCount: 13,
      answerCount: 14928,
      acceptedAnswerCount: 3217,
      voteCount: 215926
    }
  },
  {
    id: 9,
    name: "CertainPerformance",
    displayName: "CertainPerformance",
    reputation: 521483,
    location: "",
    profileImage: "https://ext.same-assets.com/1773809462/8615090187.jpeg",
    createdAt: new Date("2017-12-20"),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    aboutMe: "JavaScript enthusiast.",
    website: "",
    tags: ["javascript", "typescript", "reactjs", "es6", "ecmascript-6"],
    badges: {
      gold: 68,
      silver: 611,
      bronze: 845
    },
    stats: {
      questionCount: 8,
      answerCount: 12754,
      acceptedAnswerCount: 2841,
      voteCount: 182517
    }
  },
  {
    id: 10,
    name: "pskink",
    displayName: "pskink",
    reputation: 417295,
    location: "",
    profileImage: "https://ext.same-assets.com/1773809462/6615090187.jpeg",
    createdAt: new Date("2014-06-08"),
    lastSeen: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    aboutMe: "Android developer.",
    website: "",
    tags: ["android", "kotlin", "android-layout", "android-fragments", "android-recyclerview"],
    badges: {
      gold: 49,
      silver: 524,
      bronze: 731
    },
    stats: {
      questionCount: 55,
      answerCount: 10172,
      acceptedAnswerCount: 2104,
      voteCount: 145821
    }
  }
];

// GET endpoint to retrieve users with pagination and sorting
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '36'); // Default to 36 users per page (like Stack Overflow)
  const tab = url.searchParams.get('tab') || 'reputation'; // Default sort by reputation
  const search = url.searchParams.get('search') || '';

  // Filter users by search term if provided
  let filteredUsers = users;
  if (search) {
    const searchTermLower = search.toLowerCase();
    filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTermLower) ||
      user.displayName.toLowerCase().includes(searchTermLower) ||
      user.location.toLowerCase().includes(searchTermLower) ||
      user.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  }

  // Sort the users based on the tab parameter
  let sortedUsers = [...filteredUsers];
  switch (tab) {
    case 'reputation':
      sortedUsers.sort((a, b) => b.reputation - a.reputation);
      break;
    case 'new_users':
      sortedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'voters':
      sortedUsers.sort((a, b) => b.stats.voteCount - a.stats.voteCount);
      break;
    case 'editors':
      // In a real app, we would track edits. For now, we'll just sort by reputation
      sortedUsers.sort((a, b) => b.reputation - a.reputation);
      break;
    case 'moderators':
      // In a real app, we would have a moderator flag. For now, just show highest rep
      sortedUsers.sort((a, b) => b.reputation - a.reputation);
      break;
    default:
      // Default to reputation
      sortedUsers.sort((a, b) => b.reputation - a.reputation);
  }

  // Paginate results
  const startIndex = (page - 1) * limit;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + limit);

  return new Response(JSON.stringify({
    users: paginatedUsers,
    totalUsers: filteredUsers.length,
    currentPage: page,
    totalPages: Math.ceil(filteredUsers.length / limit),
    tab: tab
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
