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
