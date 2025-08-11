import { FlashcardDeck, Note, CalendarEvent, UserProfile } from '../types';

export const demoFlashcardDecks: FlashcardDeck[] = [
  {
    id: 'demo-deck-1',
    name: 'JavaScript Fundamentals',
    tags: ['JavaScript', 'Programming', 'Web Development'],
    coverColor: '#E37083',
    createdAt: new Date('2024-01-15'),
    cards: [
      {
        id: 'card-1',
        front: 'What is a closure in JavaScript?',
        back: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
        difficulty: 3,
        hint: 'Think about function scope and variable access'
      },
      {
        id: 'card-2',
        front: 'What is the difference between let, const, and var?',
        back: 'var is function-scoped and can be redeclared. let is block-scoped and can be reassigned. const is block-scoped and cannot be reassigned.',
        difficulty: 2
      },
      {
        id: 'card-3',
        front: 'What is event delegation?',
        back: 'Event delegation is a technique where you attach a single event listener to a parent element to handle events for multiple child elements.',
        difficulty: 4,
        hint: 'Uses event bubbling'
      }
    ]
  },
  {
    id: 'demo-deck-2',
    name: 'Biology: Cell Structure',
    tags: ['Biology', 'Science', 'Cells'],
    coverColor: '#A8BF8A',
    createdAt: new Date('2024-01-10'),
    cards: [
      {
        id: 'card-4',
        front: 'What is the function of mitochondria?',
        back: 'Mitochondria are the powerhouses of the cell, responsible for producing ATP through cellular respiration.',
        difficulty: 2
      },
      {
        id: 'card-5',
        front: 'What is the difference between prokaryotic and eukaryotic cells?',
        back: 'Prokaryotic cells lack a membrane-bound nucleus and organelles, while eukaryotic cells have both.',
        difficulty: 3
      }
    ]
  }
];

export const demoNotes: Note[] = [
  {
    id: 'demo-note-1',
    title: 'Study Tips for Effective Learning',
    content: `# Effective Study Techniques

## Active Recall
- Test yourself frequently instead of just re-reading
- Use flashcards and practice problems
- Explain concepts out loud

## Spaced Repetition
- Review material at increasing intervals
- Use the forgetting curve to your advantage
- Schedule reviews before you forget

## Pomodoro Technique
- Study for 25 minutes, then take a 5-minute break
- After 4 cycles, take a longer 15-30 minute break
- Helps maintain focus and prevents burnout`,
    tags: ['Study Tips', 'Learning', 'Productivity'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    autosaves: []
  },
  {
    id: 'demo-note-2',
    title: 'JavaScript Array Methods',
    content: `# Common JavaScript Array Methods

## map()
- Creates a new array with the results of calling a function for every array element
- Does not change the original array

## filter()
- Creates a new array with all elements that pass a test
- Perfect for conditional selection

## reduce()
- Executes a reducer function on each element
- Returns a single output value`,
    tags: ['JavaScript', 'Programming', 'Reference'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    autosaves: []
  },
  {
    id: 'demo-note-3',
    title: 'World History Timeline',
    content: `# Major Historical Events

## Ancient Period
- 3500 BCE: Writing invented in Mesopotamia
- 2560 BCE: Great Pyramid of Giza built
- 776 BCE: First Olympic Games in Greece

## Classical Period
- 509 BCE: Roman Republic established
- 221 BCE: China unified under Qin Dynasty
- 476 CE: Fall of Western Roman Empire`,
    tags: ['History', 'Timeline', 'Reference'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15'),
    autosaves: []
  }
];

export const demoCalendarEvents: CalendarEvent[] = [
  {
    id: 'demo-event-1',
    title: 'Math Study Session',
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: '14:00',
    tags: ['Study', 'Math'],
    notes: 'Focus on calculus derivatives',
    repeat: 'weekly'
  },
  {
    id: 'demo-event-2',
    title: 'Biology Lab Report Due',
    date: new Date(Date.now() + 259200000), // 3 days from now
    time: '23:59',
    tags: ['Assignment', 'Biology'],
    repeat: 'none'
  }
];

export const createDemoProfile = (): UserProfile => ({
  id: 'demo-user',
  name: 'Study Enthusiast',
  avatar: '/api/placeholder/100/100',
  theme: 'light',
  notifications: true,
  studyStats: {
    totalStudyTime: 1250, // minutes
    streak: 7,
    flashcardsReviewed: 156,
    quizzesTaken: 8,
    notesCreated: 12,
    goalsCompleted: 3
  },
  badges: [
    {
      id: 'first-deck',
      name: 'First Steps',
      description: 'Created your first flashcard deck',
      icon: '🎯',
      earned: true,
      earnedAt: new Date('2024-01-15')
    },
    {
      id: 'week-streak',
      name: 'Weekly Warrior',
      description: 'Maintained a 7-day study streak',
      icon: '🔥',
      earned: true,
      earnedAt: new Date('2024-01-22')
    },
    {
      id: 'hundred-cards',
      name: 'Card Master',
      description: 'Reviewed 100 flashcards',
      icon: '📚',
      earned: true,
      earnedAt: new Date('2024-01-20')
    }
  ]
});