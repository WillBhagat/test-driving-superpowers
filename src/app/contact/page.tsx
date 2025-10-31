'use client';

import ContactForm from '@/components/ContactForm';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  return (
    <div>
      <ContactForm
        onSuccess={(message) => toast.success(message, { duration: 4000 })}
        onError={(error) => toast.error(error, { duration: 6000 })}
      />
    </div>
  );
}
