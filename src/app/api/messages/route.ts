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
