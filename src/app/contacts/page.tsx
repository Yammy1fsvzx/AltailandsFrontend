import React from 'react';
import PageHero from '@/components/common/PageHero';
import { fetchPrimaryContact } from '@/lib/api/fetchContacts';
import { Contact } from '@/types/site';
import ContactView from '@/components/contact/ContactView';
import ContactViewSkeleton from '@/components/contact/ContactViewSkeleton';

export default async function ContactPage() {
  const contactData: Contact | null = await fetchPrimaryContact();

  if (contactData === null) {
    return <ContactViewSkeleton />;
  }

  return (
    <>
      <PageHero title="Контакты" />
      <ContactView contactData={contactData} />
    </>
  );
} 