/*
  # Create user_roles table and related functions

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, foreign key to profiles)
      - `role` (user_role enum, default 'user')
      - `assigned_by` (uuid, foreign key to profiles)
      - `assigned_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_roles` table
    - Add policy for users to read their own role
    - Add policy for admins to manage all user roles

  3. Functions
    - Create helper functions for role checking
*/

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'employee', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  assigned_by uuid,
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_roles_user_id_fkey'
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_roles_assigned_by_fkey'
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_assigned_by_fkey 
    FOREIGN KEY (assigned_by) REFERENCES profiles(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION public.uid() RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_employee_or_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'employee')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
DROP TRIGGER IF EXISTS user_roles_updated_at ON user_roles;
CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_roles;

-- Create RLS policies
CREATE POLICY "Users can view their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all user roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());