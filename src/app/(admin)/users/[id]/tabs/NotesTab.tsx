import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface NotesTabProps {
  userId: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  isPinned?: boolean;
}

export default function NotesTab({ userId }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notes
    const mockNotes: Note[] = [
      {
        id: '1',
        content: 'User requested password reset via support ticket #12345. Reset completed successfully.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: 'Admin User',
        isPinned: true
      },
      {
        id: '2',
        content: 'Upgraded user account from Basic to Premium plan. Billing starts next month.',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        createdBy: 'Sales Team',
      },
      {
        id: '3',
        content: 'User reported issues with 2FA setup. Resolved by resetting authentication app.',
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        createdBy: 'Support Team',
        updatedAt: new Date(Date.now() - 518400000).toISOString()
      }
    ];

    setTimeout(() => {
      setNotes(mockNotes);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: 'Current Admin', // In real app, get from auth context
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingContent(note.content);
    }
  };

  const handleUpdateNote = () => {
    if (!editingContent.trim()) return;

    setNotes(notes.map(note =>
      note.id === editingNoteId
        ? { ...note, content: editingContent, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId
        ? { ...note, isPinned: !note.isPinned }
        : note
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-32 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Sort notes: pinned first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Add new note */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Add a Note</h4>
        <div className="space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className={`bg-white border rounded-lg p-4 ${
              note.isPinned ? 'border-blue-300 shadow-sm' : 'border-gray-200'
            }`}
          >
            {editingNoteId === note.id ? (
              <div className="space-y-3">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateNote}
                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                {note.isPinned && (
                  <div className="flex items-center text-xs text-blue-600 font-medium mb-2">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Pinned
                  </div>
                )}
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <UserCircleIcon className="h-4 w-4 mr-1" />
                    <span>{note.createdBy}</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(note.createdAt), 'PPp')}</span>
                    {note.updatedAt && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Edited {format(new Date(note.updatedAt), 'PPp')}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title={note.isPinned ? 'Unpin note' : 'Pin note'}
                    >
                      <svg className="h-4 w-4" fill={note.isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {sortedNotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a note to keep track of important information about this user.
          </p>
        </div>
      )}
    </div>
  );
}