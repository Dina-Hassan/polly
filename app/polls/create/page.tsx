'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { createPoll } from '@/lib/actions/poll-actions'
import { useRouter } from 'next/navigation'

export default function CreatePollPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isPublic, setIsPublic] = useState(true)
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return // Minimum 2 options required
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Filter out empty options
      const validOptions = options.filter(opt => opt.trim() !== '')
      
      if (validOptions.length < 2) {
        throw new Error('Please provide at least 2 valid options')
      }
      
      const result = await createPoll(
        title,
        description || null,
        validOptions,
        isPublic,
        allowMultipleVotes
      )
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create poll')
      }
      
      // Redirect to the new poll
      router.push(`/polls/${result.pollId}`)
    } catch (err) {
      setError((err as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create a New Poll</h1>
          <Link href="/polls">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6 shadow-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Poll Title
            </label>
            <input
              id="title"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Enter a question for your poll"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Add more context to your question"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Public poll (anyone can view)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="allowMultipleVotes"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={allowMultipleVotes}
                onChange={(e) => setAllowMultipleVotes(e.target.checked)}
              />
              <label htmlFor="allowMultipleVotes" className="ml-2 block text-sm text-gray-700">
                Allow multiple votes per option
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Poll Options</label>
            <p className="mb-2 text-xs text-gray-500">Add at least 2 options for people to choose from</p>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-500"
              onClick={handleAddOption}
            >
              + Add Another Option
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </form>
      </div>
    </div>
  )
}