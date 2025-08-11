import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, Shuffle, Play, Download, Upload, Edit, Trash2, BookOpen } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { FlashcardDeck, Flashcard } from '../../types';
import { storage } from '../../utils/storage';
import { demoFlashcardDecks } from '../../utils/demo-data';

const FlashcardsManager: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);

  // Form states
  const [deckName, setDeckName] = useState('');
  const [deckTags, setDeckTags] = useState('');
  const [deckColor, setDeckColor] = useState('#E37083');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [cardHint, setCardHint] = useState('');

  const colorOptions = ['#E37083', '#A8BF8A', '#F49AA2', '#89B7C2', '#FCCD86'];

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = () => {
    const savedDecks = storage.getDecks();
    if (savedDecks.length === 0) {
      // Load demo data if no decks exist
      storage.saveDecks(demoFlashcardDecks);
      setDecks(demoFlashcardDecks);
    } else {
      setDecks(savedDecks);
    }
  };

  const createDeck = () => {
    if (!deckName.trim()) return;

    const newDeck: FlashcardDeck = {
      id: Date.now().toString(),
      name: deckName,
      tags: deckTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      coverColor: deckColor,
      cards: [],
      createdAt: new Date()
    };

    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    storage.saveDecks(updatedDecks);
    setDeckName('');
    setDeckTags('');
    setIsCreating(false);
  };

  const addCard = () => {
    if (!selectedDeck || !cardFront.trim() || !cardBack.trim()) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: cardFront,
      back: cardBack,
      hint: cardHint || undefined,
      difficulty: 1
    };

    const updatedDecks = decks.map(deck => 
      deck.id === selectedDeck.id 
        ? { ...deck, cards: [...deck.cards, newCard] }
        : deck
    );

    setDecks(updatedDecks);
    storage.saveDecks(updatedDecks);
    setSelectedDeck(updatedDecks.find(d => d.id === selectedDeck.id)!);
    setCardFront('');
    setCardBack('');
    setCardHint('');
  };

  const deleteDeck = (deckId: string) => {
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(updatedDecks);
    storage.saveDecks(updatedDecks);
  };

  const startStudy = (deck: FlashcardDeck, shuffle: boolean = false) => {
    if (deck.cards.length === 0) return;

    const cards = shuffle ? [...deck.cards].sort(() => Math.random() - 0.5) : deck.cards;
    setStudyCards(cards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setIsStudying(true);
  };

  const nextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setIsStudying(false);
    }
  };

  const exportDeck = (deck: FlashcardDeck) => {
    const dataStr = JSON.stringify(deck, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deck.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDeck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedDeck: FlashcardDeck = JSON.parse(e.target?.result as string);
        importedDeck.id = Date.now().toString(); // New ID to prevent conflicts
        const updatedDecks = [...decks, importedDeck];
        setDecks(updatedDecks);
        storage.saveDecks(updatedDecks);
      } catch (error) {
        alert('Error importing deck. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isStudying && studyCards.length > 0) {
    const currentCard = studyCards[currentCardIndex];
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => setIsStudying(false)}
            className="mb-4"
          >
            End Study Session
          </Button>
          <p className="font-inter text-gray-600 dark:text-gray-300">
            Card {currentCardIndex + 1} of {studyCards.length}
          </p>
        </div>

        <Card className="min-h-64 flex flex-col justify-center items-center text-center">
          <div className="w-full">
            <h3 className="font-poppins font-semibold text-xl mb-4 text-gray-900 dark:text-white">
              {showAnswer ? 'Answer' : 'Question'}
            </h3>
            <p className="font-inter text-lg text-gray-700 dark:text-gray-300 mb-6">
              {showAnswer ? currentCard.back : currentCard.front}
            </p>
            
            {!showAnswer && currentCard.hint && (
              <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
                Hint: {currentCard.hint}
              </p>
            )}
            
            {!showAnswer ? (
              <Button onClick={() => setShowAnswer(true)}>
                Show Answer
              </Button>
            ) : (
              <Button onClick={nextCard}>
                {currentCardIndex < studyCards.length - 1 ? 'Next Card' : 'Finish'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search decks..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={importDeck}
            className="hidden"
            id="import-deck"
          />
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => document.getElementById('import-deck')?.click()}
          >
            Import
          </Button>
          <Button
            icon={Plus}
            onClick={() => setIsCreating(true)}
          >
            Create Deck
          </Button>
        </div>
      </div>

      {/* Decks Grid */}
      {filteredDecks.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No decks yet
          </h3>
          <p className="font-inter text-gray-600 dark:text-gray-300 mb-6">
            Create your first flashcard deck to get started
          </p>
          <Button onClick={() => setIsCreating(true)}>
            Create Your First Deck
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => (
            <Card key={deck.id} hover>
              <div 
                className="h-32 rounded-lg mb-4 flex items-center justify-center"
                style={{ backgroundColor: deck.coverColor + '20' }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: deck.coverColor }}
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {deck.name}
              </h3>

              <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-4">
                {deck.cards.length} cards
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {deck.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-inter bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {deck.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-inter bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    +{deck.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => startStudy(deck)}
                  disabled={deck.cards.length === 0}
                  icon={Play}
                  className="flex-1"
                >
                  Study
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startStudy(deck, true)}
                  disabled={deck.cards.length === 0}
                  icon={Shuffle}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDeck(deck)}
                  icon={Edit}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportDeck(deck)}
                  icon={Download}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteDeck(deck.id)}
                  icon={Trash2}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Deck Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Deck"
      >
        <div className="space-y-4">
          <Input
            label="Deck Name"
            value={deckName}
            onChange={setDeckName}
            placeholder="Enter deck name"
            required
          />
          
          <Input
            label="Tags (comma-separated)"
            value={deckTags}
            onChange={setDeckTags}
            placeholder="e.g. JavaScript, Programming, Web Development"
          />

          <div>
            <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Cover Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setDeckColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    deckColor === color ? 'border-gray-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCreating(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={createDeck} fullWidth>
              Create Deck
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Deck Modal */}
      <Modal
        isOpen={!!selectedDeck}
        onClose={() => setSelectedDeck(null)}
        title={selectedDeck?.name || ''}
        size="lg"
      >
        {selectedDeck && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-poppins font-semibold text-lg">Add New Card</h4>
              <Input
                label="Front (Question)"
                value={cardFront}
                onChange={setCardFront}
                placeholder="Enter your question"
                required
              />
              <Input
                label="Back (Answer)"
                value={cardBack}
                onChange={setCardBack}
                placeholder="Enter the answer"
                required
                rows={3}
              />
              <Input
                label="Hint (optional)"
                value={cardHint}
                onChange={setCardHint}
                placeholder="Enter a helpful hint"
              />
              <Button onClick={addCard} icon={Plus}>
                Add Card
              </Button>
            </div>

            <div>
              <h4 className="font-poppins font-semibold text-lg mb-4">
                Cards ({selectedDeck.cards.length})
              </h4>
              {selectedDeck.cards.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 font-inter">
                  No cards yet. Add your first card above.
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedDeck.cards.map((card) => (
                    <Card key={card.id} padding="sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Front:
                          </p>
                          <p className="font-inter text-sm">{card.front}</p>
                        </div>
                        <div>
                          <p className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Back:
                          </p>
                          <p className="font-inter text-sm">{card.back}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FlashcardsManager;