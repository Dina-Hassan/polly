import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Create and share polls <span className="text-indigo-600">instantly</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          Polly makes it easy to create polls, gather opinions, and analyze results in real-time.
          Start creating polls in seconds, no complex setup required.
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/polls">
            <Button size="lg" className="px-8">
              Browse Polls
            </Button>
          </Link>
          
          <Link href="/polls/create">
            <Button size="lg" variant="outline" className="px-8">
              Create a Poll
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-20 grid gap-12 md:grid-cols-3">
        <div className="flex flex-col items-center space-y-4 rounded-lg p-6 text-center shadow-sm">
          <div className="rounded-full bg-indigo-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-600"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
          <h2 className="text-xl font-semibold">Easy to Create</h2>
          <p className="text-gray-600">Create custom polls in seconds with our intuitive interface. Add multiple options and customize your poll settings.</p>
        </div>
        
        <div className="flex flex-col items-center space-y-4 rounded-lg p-6 text-center shadow-sm">
          <div className="rounded-full bg-indigo-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-600"><path d="M12 20v-6"></path><path d="M6 20V10"></path><path d="M18 20V4"></path></svg>
          </div>
          <h2 className="text-xl font-semibold">Real-time Results</h2>
          <p className="text-gray-600">Watch votes come in real-time. Analyze results with beautiful charts and detailed breakdowns.</p>
        </div>
        
        <div className="flex flex-col items-center space-y-4 rounded-lg p-6 text-center shadow-sm">
          <div className="rounded-full bg-indigo-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h2 className="text-xl font-semibold">Share with Anyone</h2>
          <p className="text-gray-600">Share your polls with friends, colleagues, or the world. No account required to vote.</p>
        </div>
      </div>
    </div>
  );
}
