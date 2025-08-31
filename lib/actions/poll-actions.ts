'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase } from '../supabase';
import { PollInsert, PollOptionInsert, VoteInsert } from '../database.types';

/**
 * Create a new poll with options
 */
export async function createPoll(
  title: string,
  description: string | null,
  options: string[],
  isPublic: boolean = true,
  allowMultipleVotes: boolean = false,
  expiresAt: Date | null = null
) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to create a poll');
    }

    // Start a transaction
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        creator_id: user.id,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
        expires_at: expiresAt?.toISOString() || null,
      } as PollInsert)
      .select()
      .single();

    if (pollError) throw pollError;
    if (!poll) throw new Error('Failed to create poll');

    // Insert options
    const pollOptions = options.map((optionText, index) => ({
      poll_id: poll.id,
      option_text: optionText,
      position: index,
    } as PollOptionInsert));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) throw optionsError;

    // Revalidate the polls page and redirect to the new poll
    revalidatePath('/polls');
    return { success: true, pollId: poll.id };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get a poll by ID with its options
 */
export async function getPoll(pollId: string) {
  try {
    // Get the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();

    if (pollError) throw pollError;
    if (!poll) throw new Error('Poll not found');

    // Get the poll options
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', pollId)
      .order('position', { ascending: true });

    if (optionsError) throw optionsError;

    // Get the poll results
    const { data: results, error: resultsError } = await supabase
      .rpc('get_poll_results', { poll_id: pollId });

    if (resultsError) throw resultsError;

    // Get the creator's profile
    const { data: creator, error: creatorError } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', poll.creator_id)
      .single();

    if (creatorError && creatorError.code !== 'PGRST116') {
      // PGRST116 is the error code for "Results contain 0 rows"
      throw creatorError;
    }

    return {
      success: true,
      poll,
      options,
      results,
      creator: creator || { username: 'Unknown', display_name: 'Unknown User', avatar_url: null },
    };
  } catch (error) {
    console.error('Error getting poll:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get all polls, optionally filtered by creator
 */
export async function getPolls(creatorId?: string, limit: number = 50, offset: number = 0) {
  try {
    let query = supabase
      .from('polls')
      .select('*, profiles!polls_creator_id_fkey(id, username, display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (creatorId) {
      query = query.eq('creator_id', creatorId);
    }

    const { data: polls, error, count } = await query;

    if (error) throw error;

    return { success: true, polls, count };
  } catch (error) {
    console.error('Error getting polls:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Vote on a poll
 */
export async function votePoll(pollId: string, optionId: string) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get the client IP if user is not logged in
    let voterIp = null;
    if (!user) {
      // Use a unique identifier for anonymous users
      // In a real app with middleware, you would get the IP from the request
      voterIp = `anonymous-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }

    // Check if the poll allows multiple votes
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('allow_multiple_votes')
      .eq('id', pollId)
      .single();

    if (pollError) throw pollError;
    if (!poll) throw new Error('Poll not found');

    // If the poll doesn't allow multiple votes, check if the user has already voted
    if (!poll.allow_multiple_votes) {
      const { data: existingVotes, error: votesError } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq(user ? 'user_id' : 'voter_ip', user ? user.id : voterIp);

      if (votesError) throw votesError;

      if (existingVotes && existingVotes.length > 0) {
        throw new Error('You have already voted on this poll');
      }
    }

    // Insert the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: user?.id || null,
        voter_ip: voterIp,
      } as VoteInsert);

    if (voteError) throw voteError;

    // Revalidate the poll page
    revalidatePath(`/polls/${pollId}`);
    return { success: true };
  } catch (error) {
    console.error('Error voting on poll:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete a poll
 */
export async function deletePoll(pollId: string) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to delete a poll');
    }

    // Check if the user is the creator of the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', pollId)
      .single();

    if (pollError) throw pollError;
    if (!poll) throw new Error('Poll not found');

    if (poll.creator_id !== user.id) {
      throw new Error('You can only delete your own polls');
    }

    // Delete the poll (cascade will delete options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);

    if (deleteError) throw deleteError;

    // Revalidate the polls page
    revalidatePath('/polls');
    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    return { success: false, error: (error as Error).message };
  }
}