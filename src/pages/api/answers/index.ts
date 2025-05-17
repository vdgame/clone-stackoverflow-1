import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { sendContentUpdate } from '../sse/index';

// Mock database of answers (in a real app this would be a database)
// Using a simple array for demo purposes
const answers = [
  {
    id: 1,
    questionId: 1,
    body: `<p>For Qt 6.8.3, you need to use a different approach when building with CMake. Instead of <code>WEBENGINE_CONFIG+=use_proprietary_codecs</code>, you need to set this as a CMake option.</p>

      <p>Try the following in your GitHub Actions workflow:</p>

      <pre><code>cmake -DCMAKE_PREFIX_PATH=/path/to/qt \\
    -DINPUT_use_proprietary_codecs=ON \\
    -DINPUT_webengine_ffmpeg_build_gn=ON \\
    -G Ninja
      </code></pre>

      <p>The key here is using the <code>-DINPUT_use_proprietary_codecs=ON</code> flag when configuring with CMake.</p>`,
    votes: 23,
    created: "yesterday",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    user: {
      name: "QtExpert",
      reputation: 34562,
      image: "https://ext.same-assets.com/1773809462/1145680541.png"
    },
    accepted: true
  },
  // ...other existing answers
];

// GET endpoint to retrieve answers for a specific question
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const questionId = parseInt(url.searchParams.get('questionId') || '0');
  const sort = url.searchParams.get('sort') || 'votes';

  if (!questionId) {
    return new Response(JSON.stringify({ error: 'Question ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const questionAnswers = answers.filter(a => a.questionId === questionId);

  // Sort the answers based on the sort parameter
  let sortedAnswers = [...questionAnswers];
  switch (sort) {
    case 'newest':
      sortedAnswers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      sortedAnswers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'votes':
      // Sort by votes (descending) with accepted answers first
      sortedAnswers.sort((a, b) => {
        if (a.accepted && !b.accepted) return -1;
        if (!a.accepted && b.accepted) return 1;
        return b.votes - a.votes;
      });
      break;
    default:
      // Default to votes
      sortedAnswers.sort((a, b) => {
        if (a.accepted && !b.accepted) return -1;
        if (!a.accepted && b.accepted) return 1;
        return b.votes - a.votes;
      });
  }

  return new Response(JSON.stringify({
    answers: sortedAnswers,
    totalAnswers: sortedAnswers.length,
    sort: sort
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// POST endpoint to create a new answer
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
    if (!body.questionId || !body.body) {
      return new Response(JSON.stringify({ error: 'Question ID and answer body are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Create a new answer
    const newAnswer = {
      id: answers.length + 1,
      questionId: parseInt(body.questionId),
      body: body.body,
      votes: 0,
      created: "just now",
      createdAt: new Date(), // Current time
      user: {
        name: session.user.name || 'Anonymous',
        reputation: 1, // Default for now
        image: session.user.image || 'https://ext.same-assets.com/1773809462/default-avatar.png'
      },
      accepted: false
    };

    // Add to "database"
    answers.push(newAnswer);

    // Send real-time update to all connected clients
    sendContentUpdate('answer', newAnswer);

    return new Response(JSON.stringify(newAnswer), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating answer:', error);
    return new Response(JSON.stringify({ error: 'Failed to create answer' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
