'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { votePoll } from '@/lib/actions/poll-actions';
import { PollOption } from '@/lib/database.types';

interface VoteFormProps {
  pollId: string;
  options: PollOption[];
  allowMultiple: boolean;
}

export default function VoteForm({ pollId, options, allowMultiple }: VoteFormProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (allowMultiple) {
      // For multiple selection, toggle the option
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // For single selection, replace the selection
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedOptions.length === 0) {
      setError('Please select at least one option');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // For multiple votes, submit each vote separately
      for (const optionId of selectedOptions) {
        const result = await votePoll(pollId, optionId);
        if (!result.success) {
          throw new Error(result.error || 'Failed to submit vote');
        }
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <p className="text-green-600 font-medium mb-2">Thank you for voting!</p>
        <p className="text-sm text-gray-600">Your vote has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Cast Your Vote</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-6">
        {options.sort((a, b) => a.position - b.position).map((option) => (
          <div 
            key={option.id} 
            className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedOptions.includes(option.id) ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="flex items-center">
              <input
                type={allowMultiple ? 'checkbox' : 'radio'}
                id={`option-${option.id}`}
                name="poll-option"
                className="mr-3 h-4 w-4"
                checked={selectedOptions.includes(option.id)}
                onChange={() => {}} // Handled by the div onClick
                onClick={(e) => e.stopPropagation()}
              />
              <label htmlFor={`option-${option.id}`} className="cursor-pointer">
                {option.option_text}
              </label>
            </div>
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || selectedOptions.length === 0}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
      </Button>
    </form>
  );
}