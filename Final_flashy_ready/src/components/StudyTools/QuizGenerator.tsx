import React, { useState, useEffect } from 'react';
import { Play, Plus, Trophy, Clock, BarChart } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { Quiz, QuizQuestion, QuizAttempt, FlashcardDeck } from '../../types';
import { storage } from '../../utils/storage';

const QuizGenerator: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isQuizzing, setIsQuizzing] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // Form states
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState<'multiple-choice' | 'true-false'>('multiple-choice');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuizzes(storage.getQuizzes());
    setDecks(storage.getDecks());
  };

  const generateQuizFromDeck = () => {
    const deck = decks.find(d => d.id === selectedDeck);
    if (!deck || !quizTitle.trim()) return;

    const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, Math.min(questionCount, deck.cards.length));

    const questions: QuizQuestion[] = selectedCards.map((card, index) => {
      if (questionType === 'true-false') {
        return {
          id: `q${index}`,
          type: 'true-false',
          question: card.front,
          correctAnswer: 'true',
          options: ['True', 'False']
        };
      } else {
        // Generate multiple choice with correct answer and distractors
        const options = [card.back];
        
        // Add random wrong answers from other cards
        const otherCards = deck.cards.filter(c => c.id !== card.id);
        while (options.length < 4 && otherCards.length > 0) {
          const randomCard = otherCards.splice(Math.floor(Math.random() * otherCards.length), 1)[0];
          if (!options.includes(randomCard.back)) {
            options.push(randomCard.back);
          }
        }
        
        // Fill with generic distractors if needed
        if (options.length < 4) {
          const genericOptions = ['Not sure', 'None of the above', 'All of the above'];
          genericOptions.forEach(opt => {
            if (options.length < 4 && !options.includes(opt)) {
              options.push(opt);
            }
          });
        }

        // Shuffle options
        const shuffledOptions = options.sort(() => Math.random() - 0.5);

        return {
          id: `q${index}`,
          type: 'multiple-choice',
          question: card.front,
          options: shuffledOptions,
          correctAnswer: card.back
        };
      }
    });

    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: quizTitle,
      questions,
      createdAt: new Date(),
      attempts: []
    };

    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    storage.saveQuizzes(updatedQuizzes);

    // Reset form
    setQuizTitle('');
    setSelectedDeck('');
    setQuestionCount(5);
    setIsCreating(false);
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(''));
    setQuizStartTime(new Date());
    setIsQuizzing(true);
    setShowResults(false);
  };

  const selectAnswer = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!currentQuiz || !quizStartTime) return;

    const answers = selectedAnswers.map((answer, index) => ({
      questionId: currentQuiz.questions[index].id,
      answer,
      correct: answer === currentQuiz.questions[index].correctAnswer
    }));

    const score = answers.filter(a => a.correct).length;
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      date: new Date(),
      score: Math.round((score / currentQuiz.questions.length) * 100),
      answers
    };

    const updatedQuiz = {
      ...currentQuiz,
      attempts: [...currentQuiz.attempts, attempt]
    };

    const updatedQuizzes = quizzes.map(q => 
      q.id === currentQuiz.id ? updatedQuiz : q
    );

    setQuizzes(updatedQuizzes);
    storage.saveQuizzes(updatedQuizzes);
    setLastAttempt(attempt);
    setShowResults(true);
  };

  const endQuiz = () => {
    setIsQuizzing(false);
    setCurrentQuiz(null);
    setShowResults(false);
    setLastAttempt(null);
  };

  if (showResults && lastAttempt && currentQuiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="font-poppins font-bold text-2xl text-gray-900 dark:text-white mb-4">
            Quiz Complete!
          </h2>
          <div className="text-4xl font-bold text-primary-500 mb-2">
            {lastAttempt.score}%
          </div>
          <p className="font-inter text-gray-600 dark:text-gray-300 mb-6">
            You got {lastAttempt.answers.filter(a => a.correct).length} out of {currentQuiz.questions.length} questions correct
          </p>
          
          <div className="space-y-3 mb-6">
            {currentQuiz.questions.map((question, index) => (
              <div 
                key={question.id}
                className={`p-3 rounded-lg text-left ${
                  lastAttempt.answers[index].correct 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}
              >
                <p className="font-inter font-medium mb-1">{question.question}</p>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                  Your answer: {lastAttempt.answers[index].answer}
                </p>
                {!lastAttempt.answers[index].correct && (
                  <p className="font-inter text-sm text-green-600 dark:text-green-400">
                    Correct answer: {question.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => startQuiz(currentQuiz)} fullWidth>
              Retry Quiz
            </Button>
            <Button onClick={endQuiz} fullWidth>
              Back to Quizzes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isQuizzing && currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Button 
            variant="outline" 
            onClick={endQuiz}
            className="mb-4"
          >
            End Quiz
          </Button>
          <p className="font-inter text-gray-600 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </p>
        </div>

        <Card>
          <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  selectedAnswer === option
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="font-inter">{option}</span>
              </button>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={nextQuestion} 
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-2">
            Quiz Generator
          </h2>
          <p className="font-inter text-gray-600 dark:text-gray-300">
            Generate quizzes from your flashcard decks
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => setIsCreating(true)}
          disabled={decks.length === 0}
        >
          Create Quiz
        </Button>
      </div>

      {/* Empty State */}
      {decks.length === 0 ? (
        <Card className="text-center py-12">
          <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No flashcard decks available
          </h3>
          <p className="font-inter text-gray-600 dark:text-gray-300">
            Create some flashcard decks first to generate quizzes
          </p>
        </Card>
      ) : (
        <>
          {/* Quizzes Grid */}
          {quizzes.length === 0 ? (
            <Card className="text-center py-12">
              <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                No quizzes yet
              </h3>
              <p className="font-inter text-gray-600 dark:text-gray-300 mb-6">
                Generate your first quiz from flashcard decks
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Create Your First Quiz
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} hover>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>
                      <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                        {quiz.questions.length} questions
                      </p>
                    </div>
                  </div>

                  {quiz.attempts.length > 0 && (
                    <div className="mb-4">
                      <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Best Score: {Math.max(...quiz.attempts.map(a => a.score))}%
                      </p>
                      <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                        {quiz.attempts.length} attempt(s)
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={() => startQuiz(quiz)}
                    icon={Play}
                    fullWidth
                  >
                    Start Quiz
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Quiz Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Quiz"
      >
        <div className="space-y-4">
          <Input
            label="Quiz Title"
            value={quizTitle}
            onChange={setQuizTitle}
            placeholder="Enter quiz title"
            required
          />

          <div>
            <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Select Flashcard Deck
            </label>
            <select
              value={selectedDeck}
              onChange={(e) => setSelectedDeck(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            >
              <option value="">Choose a deck...</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name} ({deck.cards.length} cards)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as 'multiple-choice' | 'true-false')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
            </select>
          </div>

          <Input
            label="Number of Questions"
            type="number"
            value={questionCount.toString()}
            onChange={(value) => setQuestionCount(parseInt(value) || 5)}
            placeholder="5"
          />

          {selectedDeck && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Available cards: {decks.find(d => d.id === selectedDeck)?.cards.length || 0}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCreating(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={generateQuizFromDeck} fullWidth>
              Generate Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizGenerator;