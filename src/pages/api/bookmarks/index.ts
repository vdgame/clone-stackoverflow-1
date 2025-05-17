import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

// Mock database for bookmarks
// In a real app, this would be in a database
const bookmarkStore = new Map();

export const GET: APIRoute = async ({ request }) => {
  // Get the current user from the session
  const session = await getSession(request);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const userId = session.user.id;

  // Get user's bookmarks
  const userBookmarks = bookmarkStore.get(userId) || [];

  // Parse URL for query params
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  // Paginate bookmarks
  const paginatedBookmarks = userBookmarks.slice(offset, offset + limit);

  return new Response(
    JSON.stringify({
      bookmarks: paginatedBookmarks,
      total: userBookmarks.length,
      hasMore: offset + limit < userBookmarks.length
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  // Get the current user from the session
  const session = await getSession(request);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const userId = session.user.id;

  // Parse the request body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const { questionId, action } = body;

  if (!questionId || !action) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Validate action
  if (action !== 'add' && action !== 'remove') {
    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Get user's bookmarks
  let userBookmarks = bookmarkStore.get(userId) || [];

  // Process action
  if (action === 'add') {
    // Check if already bookmarked
    if (!userBookmarks.some(bookmark => bookmark.questionId === questionId)) {
      // Add bookmark
      userBookmarks.push({
        questionId,
        addedAt: new Date().toISOString()
      });

      // Mock: Increment bookmark count for the question (in a real app)
      console.log(`Incremented bookmark count for question ${questionId}`);
    }
  } else if (action === 'remove') {
    // Remove bookmark
    userBookmarks = userBookmarks.filter(bookmark => bookmark.questionId !== questionId);

    // Mock: Decrement bookmark count for the question (in a real app)
    console.log(`Decremented bookmark count for question ${questionId}`);
  }

  // Update store
  bookmarkStore.set(userId, userBookmarks);

  return new Response(
    JSON.stringify({
      success: true,
      action,
      bookmarked: action === 'add',
      bookmarks: userBookmarks
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
