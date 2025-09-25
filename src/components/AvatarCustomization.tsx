import React, { useState } from 'react';
import { X, Palette, User } from 'lucide-react';

interface AvatarCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSave: (avatar: string) => void;
}

const AvatarCustomization: React.FC<AvatarCustomizationProps> = ({ 
  isOpen, 
  onClose, 
  currentAvatar, 
  onSave 
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  if (!isOpen) return null;

  const avatarOptions = [
    { id: 'boy1', emoji: '👦', name: 'Boy 1' },
    { id: 'girl1', emoji: '👧', name: 'Girl 1' },
    { id: 'boy2', emoji: '🧒', name: 'Boy 2' },
    { id: 'girl2', emoji: '👩', name: 'Girl 2' },
    { id: 'man1', emoji: '👨', name: 'Man 1' },
    { id: 'woman1', emoji: '👩‍🦱', name: 'Woman 1' },
    { id: 'student1', emoji: '👨‍🎓', name: 'Graduate 1' },
    { id: 'student2', emoji: '👩‍🎓', name: 'Graduate 2' },
    { id: 'scientist1', emoji: '👨‍🔬', name: 'Scientist 1' },
    { id: 'scientist2', emoji: '👩‍🔬', name: 'Scientist 2' },
    { id: 'teacher1', emoji: '👨‍🏫', name: 'Teacher 1' },
    { id: 'teacher2', emoji: '👩‍🏫', name: 'Teacher 2' },
  ];

  const handleSave = () => {
    onSave(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6" />
              <h2 className="text-xl font-bold">Customize Avatar</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Selection */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl">
                {avatarOptions.find(a => a.id === selectedAvatar)?.emoji || '👤'}
              </span>
            </div>
            <p className="text-gray-600">
              Selected: {avatarOptions.find(a => a.id === selectedAvatar)?.name || 'Default'}
            </p>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  selectedAvatar === avatar.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-3xl mb-2">{avatar.emoji}</div>
                <div className="text-xs text-gray-600 font-medium">{avatar.name}</div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomization;