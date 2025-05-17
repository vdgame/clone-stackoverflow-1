/**
 * Global keyboard shortcuts handler for Stack Overflow clone
 * This script implements keyboard shortcuts across the site
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Track if we're in a sequence that begins with 'g'
  let awaitingSecondKey = false;

  // Get active elements that can receive keyboard input
  const isTypingInInput = () => {
    const activeElement = document.activeElement;
    const tagName = activeElement.tagName.toLowerCase();
    return tagName === 'input' ||
           tagName === 'textarea' ||
           tagName === 'select' ||
           activeElement.isContentEditable;
  };

  // Global keyboard event listener
  document.addEventListener('keydown', (e) => {
    // Skip shortcuts if user is typing in an input
    if (isTypingInInput()) {
      return;
    }

    // Handle shortcut key sequences
    if (awaitingSecondKey) {
      awaitingSecondKey = false;

      // g + [key] navigation shortcuts
      switch (e.key.toLowerCase()) {
        case 'h': // Go to Home
          window.location.href = '/';
          e.preventDefault();
          break;
        case 'q': // Go to Questions
          window.location.href = '/questions';
          e.preventDefault();
          break;
        case 't': // Go to Tags
          window.location.href = '/tags';
          e.preventDefault();
          break;
        case 'u': // Go to Users
          window.location.href = '/users';
          e.preventDefault();
          break;
        case 'n': // Go to Notifications
          window.location.href = '/user/notifications';
          e.preventDefault();
          break;
        case 'b': // Go to Bookmarks
          window.location.href = '/user/bookmarks';
          e.preventDefault();
          break;
        case 'p': // Go to Profile
          window.location.href = '/user/profile';
          e.preventDefault();
          break;
      }
      return;
    }

    // Single key shortcuts
    switch (e.key.toLowerCase()) {
      case 'g': // Await second key for navigation
        awaitingSecondKey = true;
        e.preventDefault();
        break;
      case '/': // Focus search
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
          e.preventDefault();
        }
        break;
      case '?': // Show keyboard shortcuts (implemented in KeyboardShortcuts.astro)
        break;
      case 'a': // Ask question
        // Only on question list pages
        if (window.location.pathname === '/questions' || window.location.pathname === '/') {
          window.location.href = '/questions/ask';
          e.preventDefault();
        }
        break;
    }

    // Page-specific shortcuts based on current URL
    const path = window.location.pathname;

    // Question list page shortcuts
    if (path === '/questions' || path === '/') {
      handleQuestionListShortcuts(e);
    }

    // Question detail page shortcuts
    if (path.match(/^\/questions\/\d+/)) {
      handleQuestionDetailShortcuts(e);
    }
  });

  // Handle shortcuts specific to question lists
  function handleQuestionListShortcuts(e) {
    const questions = document.querySelectorAll('.question-list .question-summary');
    if (!questions.length) return;

    let currentQuestion = null;

    // Find the current focused question if any
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].classList.contains('keyboard-focused')) {
        currentQuestion = { element: questions[i], index: i };
        break;
      }
    }

    switch (e.key.toLowerCase()) {
      case 'j': // Next question
        e.preventDefault();
        if (currentQuestion) {
          currentQuestion.element.classList.remove('keyboard-focused');
          const nextIndex = Math.min(currentQuestion.index + 1, questions.length - 1);
          questions[nextIndex].classList.add('keyboard-focused');
          questions[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          questions[0].classList.add('keyboard-focused');
          questions[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      case 'k': // Previous question
        e.preventDefault();
        if (currentQuestion) {
          currentQuestion.element.classList.remove('keyboard-focused');
          const prevIndex = Math.max(currentQuestion.index - 1, 0);
          questions[prevIndex].classList.add('keyboard-focused');
          questions[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          questions[0].classList.add('keyboard-focused');
          questions[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      case 'enter': // Open selected question
        if (currentQuestion) {
          e.preventDefault();
          const questionLink = currentQuestion.element.querySelector('h3 a');
          if (questionLink) {
            questionLink.click();
          }
        }
        break;
    }
  }

  // Handle shortcuts specific to question detail pages
  function handleQuestionDetailShortcuts(e) {
    switch (e.key.toLowerCase()) {
      case 'u': // Upvote
        e.preventDefault();
        const upvoteButton = document.querySelector('.question-detail .vote-button[data-vote="up"]');
        if (upvoteButton) {
          upvoteButton.click();
        }
        break;
      case 'd': // Downvote
        e.preventDefault();
        const downvoteButton = document.querySelector('.question-detail .vote-button[data-vote="down"]');
        if (downvoteButton) {
          downvoteButton.click();
        }
        break;
      case 'c': // Add comment
        e.preventDefault();
        const addCommentButton = document.querySelector('.question-detail .add-comment-button');
        if (addCommentButton) {
          addCommentButton.click();
        }
        break;
      case 'a': // Add answer
        e.preventDefault();
        // Scroll to answer form
        const answerForm = document.querySelector('#answer-form');
        if (answerForm) {
          answerForm.scrollIntoView({ behavior: 'smooth' });
          const answerBody = answerForm.querySelector('textarea');
          if (answerBody) {
            answerBody.focus();
          }
        }
        break;
      case 'n': // Next answer
        e.preventDefault();
        const answers = document.querySelectorAll('.answers .answer');
        if (!answers.length) return;

        let currentAnswer = null;
        for (let i = 0; i < answers.length; i++) {
          if (answers[i].classList.contains('keyboard-focused')) {
            currentAnswer = { element: answers[i], index: i };
            break;
          }
        }

        if (currentAnswer) {
          currentAnswer.element.classList.remove('keyboard-focused');
          const nextIndex = Math.min(currentAnswer.index + 1, answers.length - 1);
          answers[nextIndex].classList.add('keyboard-focused');
          answers[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          answers[0].classList.add('keyboard-focused');
          answers[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      case 'p': // Previous answer
        e.preventDefault();
        const answersList = document.querySelectorAll('.answers .answer');
        if (!answersList.length) return;

        let currentAnswerEl = null;
        for (let i = 0; i < answersList.length; i++) {
          if (answersList[i].classList.contains('keyboard-focused')) {
            currentAnswerEl = { element: answersList[i], index: i };
            break;
          }
        }

        if (currentAnswerEl) {
          currentAnswerEl.element.classList.remove('keyboard-focused');
          const prevIndex = Math.max(currentAnswerEl.index - 1, 0);
          answersList[prevIndex].classList.add('keyboard-focused');
          answersList[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          answersList[0].classList.add('keyboard-focused');
          answersList[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
    }
  }

  // Add keyboard focused styles
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-focused {
      outline: 2px solid #0a95ff !important;
      background-color: rgba(10, 149, 255, 0.05) !important;
    }

    .dark .keyboard-focused {
      outline: 2px solid #0a95ff !important;
      background-color: rgba(10, 149, 255, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
});
