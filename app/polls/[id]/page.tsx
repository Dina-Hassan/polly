'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'

// Mock data for a single poll
const mockPoll = {
  id: '1',
  title: 'Favorite Programming Language',
  description: 'What is your favorite programming language?',
  options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
  votes: [120, 80, 60, 40, 30],
  createdBy: 'John Doe',
  createdAt: '2023-05-15',
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const totalVotes = mockPoll.votes.reduce((sum, current) => sum + current, 0)

  const handleVote = () => {
    if (selectedOption !== null) {
      // In a real app, this would send the vote to an API
      console.log(`Voted for option: ${mockPoll.options[selectedOption]}`)
      setHasVoted(true)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl rounded-lg border p-6 shadow-md">
        <h1 className="mb-2 text-2xl font-bold">{mockPoll.title}</h1>
        <p className="mb-6 text-gray-600">{mockPoll.description}</p>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Created by {mockPoll.createdBy} on {mockPoll.createdAt}
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {mockPoll.options.map((option, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {!hasVoted ? (
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="poll-option"
                      className="mr-3 h-4 w-4"
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                    />
                  ) : null}
                  <label
                    htmlFor={`option-${index}`}
                    className={`${hasVoted ? 'font-medium' : ''}`}
                  >
                    {option}
                  </label>
                </div>
                {hasVoted && (
                  <span className="text-sm font-medium">
                    {mockPoll.votes[index]} votes ({((mockPoll.votes[index] / totalVotes) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              {hasVoted && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(mockPoll.votes[index] / totalVotes) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!hasVoted ? (
          <Button
            onClick={handleVote}
            disabled={selectedOption === null}
            className="w-full"
          >
            Submit Vote
          </Button>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg font-medium">Thank you for voting!</p>
            <p className="text-sm text-gray-600">
              Total votes: {totalVotes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}