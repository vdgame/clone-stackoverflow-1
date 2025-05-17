import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

// Mock database - in a real app, this would be persisted in a database
const voteStore = new Map();
const reputationStore = new Map();

// Reputation points values
const REPUTATION_VALUES = {
  QUESTION_UPVOTE: 5,
  QUESTION_DOWNVOTE: -2,
  ANSWER_UPVOTE: 10,
  ANSWER_DOWNVOTE: -2,
  DOWNVOTE_PENALTY: -1  // For the user who downvotes (costs them 1 rep)
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

  const { contentType, contentId, voteType, previousVote } = body;

  if (!contentType || !contentId || !voteType) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Validate contentType
  if (contentType !== 'question' && contentType !== 'answer') {
    return new Response(JSON.stringify({ error: 'Invalid content type' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Validate voteType
  if (voteType !== 'up' && voteType !== 'down' && voteType !== 'null') {
    return new Response(JSON.stringify({ error: 'Invalid vote type' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Create a unique key for this vote
  const voteKey = `${contentType}_${contentId}`;

  // Store user's vote
  let userVoteKey = `${voteKey}_${userId}`;

  // Get the content author ID (in a real app, this would be fetched from the database)
  // For demo, using a fixed author ID
  const authorId = contentType === 'question' ? 'author123' : 'author456';

  // Initialize reputation for author if not exists
  if (!reputationStore.has(authorId)) {
    reputationStore.set(authorId, 1);
  }

  // Initialize reputation for voter if not exists
  if (!reputationStore.has(userId)) {
    reputationStore.set(userId, 1);
  }

  // Calculate reputation change based on vote action
  const previousUserVote = voteStore.get(userVoteKey);
  let authorReputationChange = 0;
  let voterReputationChange = 0;

  // Determine reputation changes
  if (voteType === 'up') {
    if (previousUserVote === 'up') {
      // Removing upvote
      authorReputationChange = contentType === 'question' ? -REPUTATION_VALUES.QUESTION_UPVOTE : -REPUTATION_VALUES.ANSWER_UPVOTE;
      voteStore.delete(userVoteKey);
    } else if (previousUserVote === 'down') {
      // Changing from downvote to upvote
      authorReputationChange = contentType === 'question'
        ? REPUTATION_VALUES.QUESTION_UPVOTE - REPUTATION_VALUES.QUESTION_DOWNVOTE
        : REPUTATION_VALUES.ANSWER_UPVOTE - REPUTATION_VALUES.ANSWER_DOWNVOTE;

      // Refund the downvote penalty to the voter
      voterReputationChange = -REPUTATION_VALUES.DOWNVOTE_PENALTY;

      voteStore.set(userVoteKey, 'up');
    } else {
      // New upvote
      authorReputationChange = contentType === 'question' ? REPUTATION_VALUES.QUESTION_UPVOTE : REPUTATION_VALUES.ANSWER_UPVOTE;
      voteStore.set(userVoteKey, 'up');
    }
  } else if (voteType === 'down') {
    if (previousUserVote === 'down') {
      // Removing downvote
      authorReputationChange = contentType === 'question' ? -REPUTATION_VALUES.QUESTION_DOWNVOTE : -REPUTATION_VALUES.ANSWER_DOWNVOTE;

      // Refund the downvote penalty to the voter
      voterReputationChange = -REPUTATION_VALUES.DOWNVOTE_PENALTY;

      voteStore.delete(userVoteKey);
    } else if (previousUserVote === 'up') {
      // Changing from upvote to downvote
      authorReputationChange = contentType === 'question'
        ? REPUTATION_VALUES.QUESTION_DOWNVOTE - REPUTATION_VALUES.QUESTION_UPVOTE
        : REPUTATION_VALUES.ANSWER_DOWNVOTE - REPUTATION_VALUES.ANSWER_UPVOTE;

      // Apply downvote penalty to the voter
      voterReputationChange = REPUTATION_VALUES.DOWNVOTE_PENALTY;

      voteStore.set(userVoteKey, 'down');
    } else {
      // New downvote
      authorReputationChange = contentType === 'question' ? REPUTATION_VALUES.QUESTION_DOWNVOTE : REPUTATION_VALUES.ANSWER_DOWNVOTE;

      // Apply downvote penalty to the voter
      voterReputationChange = REPUTATION_VALUES.DOWNVOTE_PENALTY;

      voteStore.set(userVoteKey, 'down');
    }
  } else {
    // Vote removed
    if (previousUserVote === 'up') {
      authorReputationChange = contentType === 'question' ? -REPUTATION_VALUES.QUESTION_UPVOTE : -REPUTATION_VALUES.ANSWER_UPVOTE;
    } else if (previousUserVote === 'down') {
      authorReputationChange = contentType === 'question' ? -REPUTATION_VALUES.QUESTION_DOWNVOTE : -REPUTATION_VALUES.ANSWER_DOWNVOTE;

      // Refund the downvote penalty to the voter
      voterReputationChange = -REPUTATION_VALUES.DOWNVOTE_PENALTY;
    }

    voteStore.delete(userVoteKey);
  }

  // Update author's reputation
  if (authorId !== userId) { // No self-voting reputation change
    const currentAuthorReputation = reputationStore.get(authorId) || 0;
    reputationStore.set(authorId, Math.max(1, currentAuthorReputation + authorReputationChange));
  }

  // Update voter's reputation (only for downvotes)
  if (voterReputationChange !== 0) {
    const currentVoterReputation = reputationStore.get(userId) || 0;
    reputationStore.set(userId, Math.max(1, currentVoterReputation + voterReputationChange));
  }

  // Calculate total votes for the content
  let upvotes = 0;
  let downvotes = 0;

  for (const [key, vote] of voteStore.entries()) {
    if (key.startsWith(voteKey) && key !== userVoteKey) {
      if (vote === 'up') upvotes++;
      if (vote === 'down') downvotes++;
    }
  }

  // Add current user's vote if exists
  const currentUserVote = voteStore.get(userVoteKey);
  if (currentUserVote === 'up') upvotes++;
  if (currentUserVote === 'down') downvotes++;

  const totalVotes = upvotes - downvotes;

  // Create response with updated vote totals and user's current vote
  const response = {
    success: true,
    contentType,
    contentId,
    votes: totalVotes,
    userVote: voteStore.get(userVoteKey) || null,
    authorReputationChange,
    newAuthorReputation: reputationStore.get(authorId),
    voterReputationChange,
    newVoterReputation: reputationStore.get(userId)
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
