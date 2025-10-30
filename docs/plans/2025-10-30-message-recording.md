# Message Recording Feature Implementation Plan

> **For Claude:** Use `${UNI_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Build a feature for users to record their name and message (minimum 5 words) with timestamp storage in PostgreSQL, showing confirmation after submission.

**Architecture:** Client-side React form component submits to Next.js API route, which validates and inserts into PostgreSQL. Form shows confirmation and clears after successful submission.

**Tech Stack:** Next.js 16, React 19, TypeScript, PostgreSQL (via pg), Tailwind CSS

---

## Task 1: Database Schema Setup

**Files:**
- Create: `/target/db/schema.sql`
- Create: `/target/db/README.md`

**Step 1: Create database schema file**

Create `/target/db/schema.sql`:

```sql
-- Messages table for storing user submissions
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for potential future queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
```

**Step 2: Create database setup instructions**

Create `/target/db/README.md`:

```markdown
# Database Setup

## Prerequisites
- PostgreSQL running via docker-compose (see project root)
- DATABASE_URL configured in .env.local

## Initial Setup

Run the schema migration:

\`\`\`bash
psql $DATABASE_URL -f db/schema.sql
\`\`\`

Or if using docker-compose:

\`\`\`bash
docker-compose exec db psql -U app_user -d test_driving_superpowers -f /workspace/db/schema.sql
\`\`\`

## Verify Setup

\`\`\`bash
psql $DATABASE_URL -c "SELECT * FROM messages;"
\`\`\`
```

**Step 3: Run the schema migration**

```bash
cd /target
psql $DATABASE_URL -f db/schema.sql
```

Expected: Table created successfully

**Step 4: Verify the table exists**

```bash
psql $DATABASE_URL -c "\d messages"
```

Expected: Table structure displayed with id, name, message, created_at columns

**Step 5: Commit**

```bash
git add db/schema.sql db/README.md
git commit -m "feat: add database schema for messages table"
```

---

## Task 2: Add PostgreSQL Dependency

**Files:**
- Modify: `/target/package.json`

**Step 1: Add pg dependency**

```bash
cd /target
npm install pg
npm install --save-dev @types/pg
```

Expected: Dependencies added to package.json and installed

**Step 2: Verify installation**

```bash
npm list pg @types/pg
```

Expected: Both packages listed with version numbers

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add pg and @types/pg dependencies"
```

---

## Task 3: Database Connection Utility

**Files:**
- Create: `/target/src/lib/db.ts`

**Step 1: Create database connection utility**

Create `/target/src/lib/db.ts`:

```typescript
import { Pool } from 'pg';

// Create a connection pool
// In production, you'd want to configure pool size, timeouts, etc.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
```

**Step 2: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add database connection utility"
```

---

## Task 4: API Route for Message Submission

**Files:**
- Create: `/target/src/app/api/messages/route.ts`

**Step 1: Create API route handler**

Create `/target/src/app/api/messages/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface MessageRequest {
  name: string;
  message: string;
}

// Helper function to count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export async function POST(request: NextRequest) {
  try {
    const body: MessageRequest = await request.json();

    // Validate name
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate message
    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate message has at least 5 words
    const wordCount = countWords(body.message);
    if (wordCount < 5) {
      return NextResponse.json(
        { error: `Message must be at least 5 words (currently ${wordCount})` },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await query(
      'INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING id, name, message, created_at',
      [body.name.trim(), body.message.trim()]
    );

    const insertedMessage = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        id: insertedMessage.id,
        name: insertedMessage.name,
        message: insertedMessage.message,
        createdAt: insertedMessage.created_at,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message. Please try again.' },
      { status: 500 }
    );
  }
}
```

**Step 2: Update TypeScript config for path aliases**

Verify `/target/tsconfig.json` has path mapping (should already exist in Next.js):

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 3: Test the API route manually**

Start dev server:
```bash
npm run dev
```

Test with curl (in another terminal):
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","message":"This is a test message"}'
```

Expected: 201 response with inserted message data

Test validation (less than 5 words):
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","message":"Too short"}'
```

Expected: 400 response with error about word count

**Step 4: Verify database insertion**

```bash
psql $DATABASE_URL -c "SELECT * FROM messages;"
```

Expected: Row with test data visible

**Step 5: Commit**

```bash
git add src/app/api/messages/route.ts
git commit -m "feat: add API route for message submission with validation"
```

---

## Task 5: Message Form Component

**Files:**
- Create: `/target/src/components/MessageForm.tsx`

**Step 1: Create the MessageForm component**

Create `/target/src/components/MessageForm.tsx`:

```typescript
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface ConfirmationData {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export default function MessageForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  // Count words in message
  const wordCount = message.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isValidWordCount = wordCount >= 5;
  const isValidName = name.trim().length > 0;
  const isFormValid = isValidName && isValidWordCount;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit message');
        return;
      }

      // Set confirmation data
      setConfirmation(data.data);

      // Clear form
      setName('');
      setMessage('');

    } catch (err) {
      setError('Failed to submit message. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError('');
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
            placeholder="Enter your name"
            required
          />
          {name.length > 0 && !isValidName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Name is required
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            rows={4}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
            placeholder="Enter your message (at least 5 words)"
            required
          />
          <div className="mt-1 flex items-center justify-between">
            <p className={`text-sm ${
              message.length > 0 && !isValidWordCount
                ? 'text-red-600 dark:text-red-400'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'} (minimum 5 required)
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-950/20 dark:border-red-900">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
        >
          {loading ? 'Submitting...' : 'Submit Message'}
        </button>
      </form>

      {confirmation && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-8 shadow-sm dark:border-green-900 dark:bg-green-950/20">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
            Message Submitted Successfully!
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-900 dark:text-green-100">Name:</span>
              <span className="ml-2 text-green-700 dark:text-green-300">{confirmation.name}</span>
            </div>
            <div>
              <span className="font-medium text-green-900 dark:text-green-100">Message:</span>
              <p className="mt-1 text-green-700 dark:text-green-300">{confirmation.message}</p>
            </div>
            <div>
              <span className="font-medium text-green-900 dark:text-green-100">Submitted at:</span>
              <span className="ml-2 text-green-700 dark:text-green-300">
                {new Date(confirmation.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/MessageForm.tsx
git commit -m "feat: add MessageForm component with validation and confirmation"
```

---

## Task 6: Messages Page

**Files:**
- Create: `/target/src/app/messages/page.tsx`

**Step 1: Create the messages page**

Create `/target/src/app/messages/page.tsx`:

```typescript
import MessageForm from '@/components/MessageForm';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-black dark:via-zinc-900 dark:to-black dark:text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-24 sm:px-12">
        <div className="max-w-2xl mx-auto w-full">
          <span className="w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm tracking-wide text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Message Recording
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Share Your Message
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Record your name and a message to be stored in our database. Your message must be at least 5 words long.
          </p>
        </div>

        <MessageForm />
      </main>
    </div>
  );
}
```

**Step 2: Test the complete feature**

Start dev server:
```bash
npm run dev
```

Visit: http://localhost:3000/messages

**Manual test checklist:**
- [ ] Page loads without errors
- [ ] Form displays correctly with styling
- [ ] Name field validates (shows error when empty on blur)
- [ ] Word counter updates as you type
- [ ] Word counter shows error when <5 words
- [ ] Submit button is disabled when form is invalid
- [ ] Submitting valid data shows confirmation
- [ ] Confirmation displays name, message, and timestamp
- [ ] Form clears after successful submission
- [ ] Can submit another message after first one
- [ ] Database contains the submitted messages

**Step 3: Verify in database**

```bash
psql $DATABASE_URL -c "SELECT id, name, LEFT(message, 50) as message, created_at FROM messages ORDER BY created_at DESC LIMIT 5;"
```

Expected: Your test messages appear in the database

**Step 4: Commit**

```bash
git add src/app/messages/page.tsx
git commit -m "feat: add messages page with form and styling"
```

---

## Task 7: Add Navigation Link (Optional Enhancement)

**Files:**
- Modify: `/target/src/app/page.tsx`

**Step 1: Add link to messages page from home**

Update the button section in `/target/src/app/page.tsx` to include a link to the messages page.

Find this section (around line 34-46):
```typescript
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Next.js Docs
            </a>
```

Replace with:
```typescript
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
              href="/messages"
            >
              Try Message Recording
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Next.js Docs
            </a>
```

**Step 2: Test navigation**

Visit: http://localhost:3000

Click "Try Message Recording" button

Expected: Navigates to /messages page

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add navigation link to messages page from home"
```

---

## Task 8: Build and Final Verification

**Files:**
- N/A (verification only)

**Step 1: Run production build**

```bash
cd /target
npm run build
```

Expected: Build completes without errors

**Step 2: Run linter**

```bash
npm run lint
```

Expected: No linting errors

**Step 3: Final manual test**

Start production server:
```bash
npm start
```

Test the full flow:
1. Visit /messages
2. Submit a message
3. Verify confirmation appears
4. Check database has the record
5. Submit another message
6. Verify both messages in database

**Step 4: Review implementation**

Verify all requirements met:
- [x] User can enter name and message
- [x] Message must be at least 5 words
- [x] Data stored in database with timestamp
- [x] Confirmation shown after submission
- [x] Form clears after submission
- [x] Confirmation displays what was submitted to database

**Step 5: Final commit**

```bash
git add -A
git commit -m "docs: verify build and final testing complete"
```

---

## Completion Checklist

- [ ] Database schema created and applied
- [ ] pg dependency added
- [ ] Database connection utility created
- [ ] API route implemented with validation
- [ ] MessageForm component created
- [ ] Messages page created
- [ ] Navigation link added (optional)
- [ ] Production build passes
- [ ] Manual testing completed
- [ ] All commits made with clear messages

## Next Steps

After implementation:
1. Consider adding error boundary for better error handling
2. Consider adding rate limiting to API route
3. Consider adding pagination if showing all messages
4. Consider adding admin page to view all messages
5. Consider adding email notifications for new messages

## Notes

- Database connection uses connection pooling for efficiency
- Validation happens both client-side (UX) and server-side (security)
- Timestamps are stored in UTC with timezone info
- Form styling matches existing site theme
