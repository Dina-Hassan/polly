# Supabase Setup for Polly App

This directory contains the database schema and setup instructions for the Polly polling application.

## Database Schema

The `schema.sql` file contains the complete database schema for the Polly app, including:

- Tables for user profiles, polls, poll options, and votes
- Row Level Security (RLS) policies for data access control
- Indexes for performance optimization
- Functions for vote counting and timestamp management

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project
3. Note your project URL and anon/public key for the next step

### 2. Set Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key
```

### 3. Apply the Database Schema

You can apply the schema in one of two ways:

#### Option 1: Using the Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `schema.sql`
5. Run the query

#### Option 2: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already
2. Log in to the CLI: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Apply the schema: `supabase db push`

### 4. Enable Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable the Email provider
3. Configure any other authentication providers you want to use

## Database Structure

### Tables

- **profiles**: Extends Supabase Auth with additional user profile information
- **polls**: Stores poll information including title, description, and settings
- **poll_options**: Stores the options for each poll
- **votes**: Records votes cast by users or anonymous visitors

### Row Level Security

The schema includes RLS policies that enforce the following rules:

- Public polls are viewable by everyone
- Private polls are only viewable by their creators
- Users can only update or delete their own polls and votes
- Anyone can vote on public polls

### Functions

- **get_poll_results**: Returns the results for a specific poll
- **update_updated_at_column**: Automatically updates the `updated_at` timestamp when records are modified