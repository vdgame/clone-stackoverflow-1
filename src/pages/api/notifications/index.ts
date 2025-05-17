import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

// This is a mock database of notifications
// In a real app, these would be stored in a database
const mockNotifications = [
  {
    id: '1',
    type: 'comment',
    message: 'John Doe commented on your question about React hooks',
    link: '/questions/1#comment-1',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: '2',
    type: 'answer',
    message: 'Sarah Smith posted an answer to your question about TypeScript interfaces',
    link: '/questions/2#answer-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: '3',
    type: 'vote',
    message: 'Your answer about Docker containers received 5 upvotes',
    link: '/questions/3#answer-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true
  },
  {
    id: '4',
    type: 'accept',
    message: 'Your answer about JavaScript promises was accepted',
    link: '/questions/4#answer-3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  },
  {
    id: '5',
    type: 'mention',
    message: 'You were mentioned in a comment by Michael Brown',
    link: '/questions/5#comment-4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true
  },
  {
    id: '6',
    type: 'vote',
    message: 'Your question about React context API received 10 upvotes',
    link: '/questions/6',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true
  }
];

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

  // Get query parameters from the URL
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const unreadOnly = url.searchParams.get('unread') === 'true';

  // Filter and paginate notifications
  let filtered = mockNotifications;

  if (unreadOnly) {
    filtered = filtered.filter(n => !n.read);
  }

  const paginatedNotifications = filtered.slice(offset, offset + limit);
  const totalCount = filtered.length;
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return new Response(
    JSON.stringify({
      notifications: paginatedNotifications,
      unreadCount,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
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

  // Mark notification(s) as read
  if (body.action === 'mark_read') {
    if (body.all) {
      // Mark all as read
      mockNotifications.forEach(n => {
        n.read = true;
      });

      return new Response(JSON.stringify({ success: true, message: 'All notifications marked as read' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (body.ids && Array.isArray(body.ids)) {
      // Mark specific notifications as read
      mockNotifications.forEach(n => {
        if (body.ids.includes(n.id)) {
          n.read = true;
        }
      });

      return new Response(JSON.stringify({ success: true, message: 'Notifications marked as read' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
