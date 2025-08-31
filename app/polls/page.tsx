import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { getPolls } from '@/lib/actions/poll-actions'
import { Profile } from '@/lib/database.types'

export default async function PollsPage() {
  const { success, polls, error } = await getPolls();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading polls: {error}
        </div>
      ) : !success || !polls || polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">No polls found</p>
          <Link href="/polls/create">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => {
            const creator = poll.profiles as Profile;
            return (
              <Link 
                key={poll.id} 
                href={`/polls/${poll.id}`}
                className="block"
              >
                <div className="h-full border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 bg-white">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{poll.title}</h2>
                  
                  {poll.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{poll.description}</p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                    <div>
                      <span>By {creator?.display_name || creator?.username || 'Unknown'}</span>
                    </div>
                    <div>
                      <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  )
}