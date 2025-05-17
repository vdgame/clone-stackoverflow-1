import type { APIRoute } from 'astro';

// Mock database for search results
// In a real app, this would use a proper search engine like Elasticsearch
const mockQuestions = [
  {
    id: 1,
    title: "How to compile Qt webengine (6.8.3) on Ubuntu with proprietary codecs using Cmake and Github Actions",
    body: "I have a lot of trouble to build Qt WebEngine from git using cmake on Ubuntu to enable webengine proprietary codecs. Because it's not so convenient, I use Github Actions to build Qt WebEngine...",
    votes: 15,
    answers: 2,
    hasAcceptedAnswer: true,
    views: 127,
    created: "2023-10-15T15:32:00Z",
    modified: "2023-10-18T12:15:00Z",
    user: {
      id: 101,
      name: "admbrill",
      reputation: 1243
    },
    tags: ["qt", "build", "compiler-errors", "continuous-integration", "qtwebengine"]
  },
  {
    id: 2,
    title: "Qt QML WebEngine PDF viewer displaying blank page",
    body: "I'm trying to use the WebEngine PDF viewer from QML, but I'm getting a blank page. I've tried the code example from the Qt documentation, but it's not working. I'm running Qt 6.5.2 on Ubuntu 22.04...",
    votes: 7,
    answers: 1,
    hasAcceptedAnswer: false,
    views: 89,
    created: "2023-12-02T09:15:00Z",
    modified: "2023-12-03T11:45:00Z",
    user: {
      id: 102,
      name: "QtDeveloper",
      reputation: 512
    },
    tags: ["qt", "qml", "pdf", "webengine", "qtwebengine"]
  },
  {
    id: 3,
    title: "QtWebengine freezes in Qt 6.6.1 on MacOS when loading certain URLs",
    body: "We have an application using Qt 6.6.1 with QtWebEngine that works fine on Windows and Linux, but freezes on MacOS when loading certain URLs. The application becomes unresponsive and needs to be force quit...",
    votes: 4,
    answers: 0,
    hasAcceptedAnswer: false,
    views: 45,
    created: "2024-02-05T11:47:00Z",
    modified: "2024-02-07T16:22:00Z",
    user: {
      id: 103,
      name: "MacQtUser",
      reputation: 2189
    },
    tags: ["qt", "macos", "freeze", "qtwebengine"]
  },
  {
    id: 4,
    title: "How to enable audio output in QtWebEngine on embedded Linux?",
    body: "I'm developing an embedded Linux application using Qt 6.5 with QtWebEngine. Everything works fine except for audio playback. When I play a video with audio on a web page, I can see the video but can't hear any sound...",
    votes: 2,
    answers: 1,
    hasAcceptedAnswer: false,
    views: 32,
    created: "2024-01-18T08:23:00Z",
    modified: "2024-01-19T14:05:00Z",
    user: {
      id: 104,
      name: "LinuxEmbedded",
      reputation: 876
    },
    tags: ["qt", "audio", "embedded-linux", "qtwebengine"]
  },
  {
    id: 5,
    title: "QtWebEngine crashes when enabling proprietary codec support",
    body: "I'm trying to build Qt 6.8.0 with proprietary codec support for WebEngine, but the application crashes when playing H.264 videos. I've compiled with the following options: `-DINPUT_use_proprietary_codecs=ON -DINPUT_webengine_ffmpeg_build_gn=ON`...",
    votes: 3,
    answers: 1,
    hasAcceptedAnswer: true,
    views: 67,
    created: "2023-11-30T16:09:00Z",
    modified: "2023-12-05T09:37:00Z",
    user: {
      id: 105,
      name: "CodeCompiler",
      reputation: 3241
    },
    tags: ["qt", "codec", "h264", "crash", "qtwebengine"]
  },
  {
    id: 6,
    title: "Understanding React's useEffect cleanup function",
    body: "I'm trying to understand how the cleanup function in useEffect works. Specifically, when should I use it and what are the common patterns for cleaning up resources or event listeners?",
    votes: 42,
    answers: 3,
    hasAcceptedAnswer: true,
    views: 543,
    created: "2023-09-12T14:23:00Z",
    modified: "2023-09-15T11:37:00Z",
    user: {
      id: 106,
      name: "ReactNewbie",
      reputation: 752
    },
    tags: ["reactjs", "hooks", "useeffect", "javascript", "functional-components"]
  },
  {
    id: 7,
    title: "How to handle authentication with JWT in a Next.js application",
    body: "I'm building a Next.js application that needs user authentication. I want to use JWT tokens for auth, but I'm not sure about the best way to handle token storage, refresh tokens, and protected routes.",
    votes: 28,
    answers: 4,
    hasAcceptedAnswer: true,
    views: 319,
    created: "2023-11-01T10:15:00Z",
    modified: "2023-11-02T16:45:00Z",
    user: {
      id: 107,
      name: "NextJSDev",
      reputation: 1843
    },
    tags: ["nextjs", "authentication", "jwt", "react", "api-routes"]
  }
];

export const GET: APIRoute = async ({ request }) => {
  // Parse URL for query parameters
  const url = new URL(request.url);

  // Get search query
  const query = url.searchParams.get('q') || '';

  // Get pagination parameters
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  // Get filter parameters
  const sortBy = url.searchParams.get('sort') || 'relevance';
  const tags = url.searchParams.getAll('tags[]');
  const users = url.searchParams.getAll('users[]');
  const answeredStatus = url.searchParams.get('answered') || 'any';
  const dateRange = url.searchParams.get('dateRange') || 'any';
  const minVotes = parseInt(url.searchParams.get('minVotes') || '0');
  const contentType = url.searchParams.get('contentType') || 'all';

  // Filter questions
  let filteredQuestions = [...mockQuestions];

  // Search by query in title and body
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredQuestions = filteredQuestions.filter(question =>
      question.title.toLowerCase().includes(lowerQuery) ||
      question.body.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter by tags
  if (tags.length > 0) {
    filteredQuestions = filteredQuestions.filter(question =>
      tags.some(tag => question.tags.includes(tag))
    );
  }

  // Filter by users
  if (users.length > 0) {
    filteredQuestions = filteredQuestions.filter(question =>
      users.includes(question.user.name)
    );
  }

  // Filter by answered status
  if (answeredStatus !== 'any') {
    if (answeredStatus === 'yes') {
      filteredQuestions = filteredQuestions.filter(question => question.answers > 0);
    } else if (answeredStatus === 'accepted') {
      filteredQuestions = filteredQuestions.filter(question => question.hasAcceptedAnswer);
    } else if (answeredStatus === 'no') {
      filteredQuestions = filteredQuestions.filter(question => question.answers === 0);
    }
  }

  // Filter by date range
  if (dateRange !== 'any') {
    const now = new Date();
    let cutoffDate = new Date();

    if (dateRange === 'day') {
      cutoffDate.setDate(now.getDate() - 1);
    } else if (dateRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (dateRange === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    filteredQuestions = filteredQuestions.filter(question =>
      new Date(question.created) >= cutoffDate
    );
  }

  // Filter by minimum votes
  if (minVotes > 0) {
    filteredQuestions = filteredQuestions.filter(question =>
      question.votes >= minVotes
    );
  }

  // Sort results
  if (sortBy === 'newest') {
    filteredQuestions.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  } else if (sortBy === 'votes') {
    filteredQuestions.sort((a, b) => b.votes - a.votes);
  } else if (sortBy === 'active') {
    filteredQuestions.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
  } else {
    // Default relevance sort - in a real search engine this would be more sophisticated
    if (query) {
      filteredQuestions.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
        const bTitle = b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
        const aBody = a.body.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bBody = b.body.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

        const aScore = aTitle + aBody + (a.votes * 0.1);
        const bScore = bTitle + bBody + (b.votes * 0.1);

        return bScore - aScore;
      });
    }
  }

  // Get total count before pagination
  const totalCount = filteredQuestions.length;

  // Calculate pagination
  const offset = (page - 1) * limit;
  filteredQuestions = filteredQuestions.slice(offset, offset + limit);

  // Get filter options for UI
  // In a real app, these would come from aggregations or facets in the search engine
  const filterOptions = {
    sortBy: [
      { value: "relevance", label: "Relevance" },
      { value: "newest", label: "Newest" },
      { value: "votes", label: "Votes" },
      { value: "active", label: "Active" }
    ],
    tags: Array.from(new Set(mockQuestions.flatMap(q => q.tags))).map(tag => {
      const count = mockQuestions.filter(q => q.tags.includes(tag)).length;
      return { value: tag, count };
    }),
    users: Array.from(new Set(mockQuestions.map(q => q.user.name))).map(user => {
      const count = mockQuestions.filter(q => q.user.name === user).length;
      return { value: user, count };
    }),
    answered: [
      { value: "any", label: "Any answers" },
      { value: "yes", label: "Has answers" },
      { value: "accepted", label: "Has accepted answer" },
      { value: "no", label: "No answers" }
    ],
    dateRange: [
      { value: "any", label: "All time" },
      { value: "day", label: "Last 24 hours" },
      { value: "week", label: "Last week" },
      { value: "month", label: "Last month" },
      { value: "year", label: "Last year" }
    ]
  };

  // Create response
  return new Response(
    JSON.stringify({
      results: filteredQuestions,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: offset + limit < totalCount
      },
      filters: {
        query,
        sortBy,
        tags,
        users,
        answeredStatus,
        dateRange,
        minVotes,
        contentType
      },
      filterOptions
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
