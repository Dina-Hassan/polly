import { notFound } from 'next/navigation';
import { getPoll } from '@/lib/actions/poll-actions';
import VoteForm from './vote-form';

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const { success, poll, options, results, creator, error } = await getPoll(params.id);
  
  if (!success || !poll) {
    return notFound();
  }

  // Calculate total votes
  const totalVotes = results.reduce((sum, result) => sum + result.vote_count, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
          {poll.description && (
            <p className="text-gray-600 mb-6">{poll.description}</p>
          )}
          
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>Created by {creator.display_name || creator.username}</span>
              <span className="mx-2">•</span>
              <span>{new Date(poll.created_at).toLocaleDateString()}</span>
            </div>
            
            {poll.expires_at && (
              <div className="text-sm text-amber-600">
                Expires: {new Date(poll.expires_at).toLocaleString()}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            {results.map((result) => {
              const percentage = totalVotes > 0 
                ? Math.round((result.vote_count / totalVotes) * 100) 
                : 0;
              
              return (
                <div key={result.option_id} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>{result.option_text}</span>
                    <span className="text-gray-600">
                      {result.vote_count} vote{result.vote_count !== 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            <div className="text-sm text-gray-500 mt-2">
              Total votes: {totalVotes}
            </div>
          </div>

          <VoteForm pollId={poll.id} options={options} allowMultiple={poll.allow_multiple_votes} />
        </div>
      </div>
    </div>
  )
}