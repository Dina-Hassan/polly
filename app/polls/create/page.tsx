'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'

export default function CreatePollPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the poll data to an API
    console.log('Creating poll:', { title, description, options })
    // Redirect to polls page after creation
    window.location.href = '/polls'
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

          <Button type="submit" className="w-full">
            Create Poll
          </Button>
        </form>
      </div>
    </div>
  )
}