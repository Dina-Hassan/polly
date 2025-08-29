'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What is your favorite programming language?',
    options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
    votes: [120, 80, 60, 40, 30],
    createdBy: 'John Doe',
    createdAt: '2023-05-15',
  },
  {
    id: '2',
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you prefer?',
    options: ['React', 'Vue', 'Angular', 'Svelte'],
    votes: [150, 70, 50, 40],
    createdBy: 'Jane Smith',
    createdAt: '2023-05-10',
  },
  {
    id: '3',
    title: 'Preferred Database',
    description: 'What database do you use most often?',
    options: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Redis'],
    votes: [90, 85, 70, 40, 30],
    createdBy: 'Alex Johnson',
    createdAt: '2023-05-05',
  },
]

export default function PollsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <div key={poll.id} className="rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-2 text-xl font-semibold">{poll.title}</h2>
            <p className="mb-4 text-gray-600">{poll.description}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Created by {poll.createdBy} on {poll.createdAt}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Total votes: {poll.votes.reduce((a, b) => a + b, 0)}</p>
            </div>
            <Link href={`/polls/${poll.id}`}>
              <Button variant="outline" className="w-full">
                View Poll
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}