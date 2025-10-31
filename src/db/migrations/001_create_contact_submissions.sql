-- UP Migration: Create contact_submissions table
-- Stores contact form submissions with user information

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NULL,
  phone_number VARCHAR(50) NULL,
  company_name VARCHAR(255) NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index on email for query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index on submitted_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);

-- DOWN Migration: Rollback changes
-- DROP INDEX IF EXISTS idx_contact_submissions_submitted_at;
-- DROP INDEX IF EXISTS idx_contact_submissions_email;
-- DROP TABLE IF EXISTS contact_submissions;
