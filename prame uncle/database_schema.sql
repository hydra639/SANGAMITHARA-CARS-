-- ============================================================================
-- MITHARA TRAVEL AGENCY - MASTER DATABASE SCHEMA (Supabase / PostgreSQL)
-- Connected Project URL: https://ujchidcnanptczaouwlg.supabase.co
-- Agency: Mithara Travel Agency
-- Contact Hotline: +91 79049 74485
-- Base Pricing: ₹80 / KM across Tamil Nadu
-- ============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    rate_per_km NUMERIC(6, 2) NOT NULL DEFAULT 80.00,
    estimated_fare NUMERIC(10, 2) NOT NULL DEFAULT 0,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_bookings_mobile ON bookings (mobile_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings (created_at DESC);

-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- Run the following SQL queries in your Supabase SQL Editor:
-- (Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public / anonymous users to insert bookings from website
DROP POLICY IF EXISTS "Allow public insert into bookings" ON bookings;
CREATE POLICY "Allow public insert into bookings" 
ON bookings FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow public / dispatch desk to read bookings
DROP POLICY IF EXISTS "Allow public read from bookings" ON bookings;
CREATE POLICY "Allow public read from bookings" 
ON bookings FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow updating booking status (Pending, Confirmed, Completed, Cancelled)
DROP POLICY IF EXISTS "Allow public update to bookings" ON bookings;
CREATE POLICY "Allow public update to bookings" 
ON bookings FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Allow deleting bookings from admin portal
DROP POLICY IF EXISTS "Allow public delete from bookings" ON bookings;
CREATE POLICY "Allow public delete from bookings" 
ON bookings FOR DELETE 
TO anon, authenticated 
USING (true);

-- ============================================================================
-- 3. OPTIONAL: INQUIRIES TABLE
-- For storing Contact Us form inquiries in Supabase
-- ============================================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    route TEXT,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert into inquiries" ON inquiries;
CREATE POLICY "Allow public insert into inquiries" 
ON inquiries FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read from inquiries" ON inquiries;
CREATE POLICY "Allow public read from inquiries" 
ON inquiries FOR SELECT 
TO anon, authenticated 
USING (true);
