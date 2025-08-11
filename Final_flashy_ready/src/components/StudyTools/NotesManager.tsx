import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Tag, Download, Save, FileText, Trash2, Edit } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { Note } from '../../types';
import { storage } from '../../utils/storage';
import { demoNotes } from '../../utils/demo-data';

const NotesManager: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  
  const autosaveRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const savedNotes = storage.getNotes();
    if (savedNotes.length === 0) {
      // Load demo data if no notes exist
      storage.saveNotes(demoNotes);
      setNotes(demoNotes);
    } else {
      setNotes(savedNotes);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (selectedNote && isEditing && noteContent) {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current);
      }
      
      autosaveRef.current = setTimeout(() => {
        saveAutosave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current);
      }
    };
  }, [noteContent, selectedNote, isEditing]);

  const saveAutosave = () => {
    if (!selectedNote) return;
    
    const autosave = {
      content: noteContent,
      timestamp: new Date()
    };
    
    const updatedNote = {
      ...selectedNote,
      autosaves: [autosave, ...selectedNote.autosaves.slice(0, 4)] // Keep last 5 autosaves
    };
    
    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    );
    
    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
    setSelectedNote(updatedNote);
  };

  const createNote = () => {
    if (!noteTitle.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      autosaves: []
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
    
    // Reset form
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setIsCreating(false);
  };

  const updateNote = () => {
    if (!selectedNote || !noteTitle.trim()) return;

    const updatedNote = {
      ...selectedNote,
      title: noteTitle,
      content: noteContent,
      tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date()
    };

    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
    setSelectedNote(null);
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
  };

  const exportNote = (note: Note, format: 'md' | 'txt') => {
    const extension = format === 'md' ? 'md' : 'txt';
    const content = format === 'md' ? note.content : note.content.replace(/[#*_`]/g, '');
    
    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
    setIsEditing(true);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="max-w-md"
          />
        </div>
        <Button
          icon={Plus}
          onClick={() => setIsCreating(true)}
        >
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="font-inter text-gray-600 dark:text-gray-300 mb-6">
            Create your first note to get started
          </p>
          <Button onClick={() => setIsCreating(true)}>
            Create Your First Note
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} hover>
              <div className="h-32 mb-4 overflow-hidden">
                <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {note.title}
                </h3>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {note.content.substring(0, 150)}...
                </p>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-inter bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-inter bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Updated {new Date(note.updatedAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => openNote(note)}
                  icon={Edit}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportNote(note, 'md')}
                  icon={Download}
                >
                  .md
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportNote(note, 'txt')}
                  icon={Download}
                >
                  .txt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteNote(note.id)}
                  icon={Trash2}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Note Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setNoteTitle('');
          setNoteContent('');
          setNoteTags('');
        }}
        title="Create New Note"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Note Title"
            value={noteTitle}
            onChange={setNoteTitle}
            placeholder="Enter note title"
            required
          />
          
          <Input
            label="Tags (comma-separated)"
            value={noteTags}
            onChange={setNoteTags}
            placeholder="e.g. Study Tips, Learning, Productivity"
          />

          <Input
            label="Content"
            value={noteContent}
            onChange={setNoteContent}
            placeholder="Start writing your note here... Supports markdown formatting!"
            rows={12}
          />

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Supports basic markdown: **bold**, *italic*, # headers, - lists, `code`
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreating(false);
                setNoteTitle('');
                setNoteContent('');
                setNoteTags('');
              }} 
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={createNote} fullWidth>
              Create Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={isEditing && !!selectedNote}
        onClose={() => {
          setIsEditing(false);
          setSelectedNote(null);
        }}
        title="Edit Note"
        size="xl"
      >
        {selectedNote && (
          <div className="space-y-4">
            <Input
              label="Note Title"
              value={noteTitle}
              onChange={setNoteTitle}
              placeholder="Enter note title"
              required
            />
            
            <Input
              label="Tags (comma-separated)"
              value={noteTags}
              onChange={setNoteTags}
              placeholder="e.g. Study Tips, Learning, Productivity"
            />

            <Input
              label="Content"
              value={noteContent}
              onChange={setNoteContent}
              placeholder="Start writing your note here... Supports markdown formatting!"
              rows={16}
            />

            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <span>Supports basic markdown: **bold**, *italic*, # headers, - lists, `code`</span>
              <span>Auto-saves every 2 seconds</span>
            </div>

            {selectedNote.autosaves.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Recent Autosaves ({selectedNote.autosaves.length})
                </h4>
                <div className="space-y-1">
                  {selectedNote.autosaves.slice(0, 3).map((autosave, index) => (
                    <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(autosave.timestamp).toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedNote(null);
                }} 
                fullWidth
              >
                Cancel
              </Button>
              <Button onClick={updateNote} icon={Save} fullWidth>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotesManager;