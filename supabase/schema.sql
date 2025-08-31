-- Schema for Polly - Polling App with QR Code Sharing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (leveraging Supabase Auth)
-- Note: Supabase Auth automatically creates auth.users table
-- This table extends the auth.users with additional profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Polls Table
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Poll Options Table
CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Votes Table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voter_ip TEXT,  -- For anonymous votes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- Constraint to ensure we have either user_id or voter_ip
  CONSTRAINT votes_user_or_ip CHECK (user_id IS NOT NULL OR voter_ip IS NOT NULL),
  -- Constraint to prevent duplicate votes from the same user on the same poll option
  CONSTRAINT unique_user_vote UNIQUE NULLS NOT DISTINCT (poll_id, option_id, user_id),
  -- Constraint to prevent duplicate votes from the same IP on the same poll option (for anonymous votes)
  CONSTRAINT unique_ip_vote UNIQUE NULLS NOT DISTINCT (poll_id, option_id, voter_ip)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS polls_creator_id_idx ON public.polls(creator_id);
CREATE INDEX IF NOT EXISTS poll_options_poll_id_idx ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS votes_poll_id_idx ON public.votes(poll_id);
CREATE INDEX IF NOT EXISTS votes_option_id_idx ON public.votes(option_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON public.votes(user_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read any profile
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Polls policies
-- Anyone can view public polls
CREATE POLICY "Public polls are viewable by everyone" 
  ON public.polls FOR SELECT 
  USING (is_public = true);

-- Creators can view their own polls (public or private)
CREATE POLICY "Creators can view their own polls" 
  ON public.polls FOR SELECT 
  USING (auth.uid() = creator_id);

-- Only authenticated users can create polls
CREATE POLICY "Authenticated users can create polls" 
  ON public.polls FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Creators can update their own polls
CREATE POLICY "Creators can update their own polls" 
  ON public.polls FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Creators can delete their own polls
CREATE POLICY "Creators can delete their own polls" 
  ON public.polls FOR DELETE 
  USING (auth.uid() = creator_id);

-- Poll options policies
-- Anyone can view options for public polls
CREATE POLICY "Options for public polls are viewable by everyone" 
  ON public.poll_options FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id AND polls.is_public = true
    )
  );

-- Creators can view options for their own polls
CREATE POLICY "Creators can view options for their own polls" 
  ON public.poll_options FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id AND polls.creator_id = auth.uid()
    )
  );

-- Only poll creators can create, update, or delete options
CREATE POLICY "Creators can insert options for their own polls" 
  ON public.poll_options FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update options for their own polls" 
  ON public.poll_options FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Creators can delete options for their own polls" 
  ON public.poll_options FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id AND polls.creator_id = auth.uid()
    )
  );

-- Votes policies
-- Anyone can view votes for public polls
CREATE POLICY "Votes for public polls are viewable by everyone" 
  ON public.votes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id AND polls.is_public = true
    )
  );

-- Creators can view votes for their own polls
CREATE POLICY "Creators can view votes for their own polls" 
  ON public.votes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id AND polls.creator_id = auth.uid()
    )
  );

-- Users can view their own votes
CREATE POLICY "Users can view their own votes" 
  ON public.votes FOR SELECT 
  USING (auth.uid() = user_id);

-- Anyone can vote on public polls
CREATE POLICY "Anyone can vote on public polls" 
  ON public.votes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id AND polls.is_public = true
    )
  );

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON public.votes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create functions for vote counting
CREATE OR REPLACE FUNCTION get_poll_results(poll_id UUID)
RETURNS TABLE (option_id UUID, option_text TEXT, vote_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id AS option_id,
    po.option_text,
    COUNT(v.id) AS vote_count
  FROM 
    public.poll_options po
  LEFT JOIN 
    public.votes v ON po.id = v.option_id
  WHERE 
    po.poll_id = get_poll_results.poll_id
  GROUP BY 
    po.id, po.option_text, po.position
  ORDER BY 
    po.position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON public.polls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();