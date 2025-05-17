import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

// This is a mock database of notifications
// In a real app, these would be stored in a database and would be different per user
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
  }
];

export const GET: APIRoute = async ({ params, request }) => {
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

  const id = params.id;
  const notification = mockNotifications.find(n => n.id === id);

  if (!notification) {
    return new Response(JSON.stringify({ error: 'Notification not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify(notification), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
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

  const id = params.id;
  const notificationIndex = mockNotifications.findIndex(n => n.id === id);

  if (notificationIndex === -1) {
    return new Response(JSON.stringify({ error: 'Notification not found' }), {
      status: 404,
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

  // Update the notification
  mockNotifications[notificationIndex] = {
    ...mockNotifications[notificationIndex],
    ...body,
    id: mockNotifications[notificationIndex].id // Ensure ID cannot be changed
  };

  return new Response(JSON.stringify(mockNotifications[notificationIndex]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const DELETE: APIRoute = async ({ params, request }) => {
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

  const id = params.id;
  const notificationIndex = mockNotifications.findIndex(n => n.id === id);

  if (notificationIndex === -1) {
    return new Response(JSON.stringify({ error: 'Notification not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Remove the notification
  mockNotifications.splice(notificationIndex, 1);

  return new Response(null, {
    status: 204
  });
};
