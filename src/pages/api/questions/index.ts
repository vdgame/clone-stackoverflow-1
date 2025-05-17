import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { sendContentUpdate } from '../sse/index';

// Mock database of questions (in a real app this would be a database)
// Using a simple array for demo purposes
const questions = [
  {
    id: 1,
    title: "How to compile Qt webengine (6.8.3) on Ubuntu with proprietary codecs using Cmake and Github Actions",
    content: "I have a lot of trouble to build Qt WebEngine from git using cmake on Ubuntu to enable webengine proprietary codecs. Because it's not so convenient, I use Github Actions to build Qt WebEngine. But I...",
    votes: 0,
    answers: 0,
    views: 2,
    timestamp: "1 min ago",
    createdAt: new Date(Date.now() - 60000), // 1 minute ago
    user: {
      name: "admbrill",
      reputation: 1,
      image: "https://ext.same-assets.com/1773809462/1615090187.jpeg"
    },
    tags: ["qt", "build", "compiler-errors", "continuous-integration", "qtwebengine"],
    collective: {
      name: "CI/CD Collective",
      slug: "ci-cd"
    }
  },
  // ...other existing questions
];

// GET endpoint to retrieve questions (with pagination and sorting)
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const tag = url.searchParams.get('tag');
  const sort = url.searchParams.get('sort') || 'newest';

  // Filter questions by tag if provided
  let filteredQuestions = questions;
  if (tag) {
    filteredQuestions = questions.filter(q => q.tags.includes(tag));
  }

  // Sort the questions based on the sort parameter
  let sortedQuestions = [...filteredQuestions];
  switch (sort) {
    case 'newest':
      sortedQuestions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      sortedQuestions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'votes':
      sortedQuestions.sort((a, b) => b.votes - a.votes);
      break;
    default:
      // Default to newest
      sortedQuestions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Paginate results
  const startIndex = (page - 1) * limit;
  const paginatedQuestions = sortedQuestions.slice(startIndex, startIndex + limit);

  return new Response(JSON.stringify({
    questions: paginatedQuestions,
    totalQuestions: filteredQuestions.length,
    currentPage: page,
    totalPages: Math.ceil(filteredQuestions.length / limit),
    sort: sort
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// POST endpoint to create a new question
export const POST: APIRoute = async ({ request }) => {
  // Get the current session
  const session = await getSession(request);

  // Check if user is authenticated
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Parse the request body
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.content || !body.tags) {
      return new Response(JSON.stringify({ error: 'Title, content, and tags are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Create a new question
    const newQuestion = {
      id: questions.length + 1,
      title: body.title,
      content: body.content,
      votes: 0,
      answers: 0,
      views: 0,
      timestamp: "just now",
      createdAt: new Date(), // Current time
      user: {
        name: session.user.name || 'Anonymous',
        reputation: 1, // Default for now
        image: session.user.image || 'https://ext.same-assets.com/1773809462/default-avatar.png'
      },
      tags: body.tags,
      collective: body.collective || null
    };

    // Add to "database"
    questions.unshift(newQuestion);

    // Send real-time update to all connected clients
    sendContentUpdate('question', newQuestion);

    return new Response(JSON.stringify(newQuestion), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return new Response(JSON.stringify({ error: 'Failed to create question' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
