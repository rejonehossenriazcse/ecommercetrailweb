import DynamicCMSPage, { generateMetadata as baseGenerateMetadata } from '../pages/[slug]/page';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return baseGenerateMetadata({ params: Promise.resolve({ slug: 'privacy' }) });
}

export default async function PrivacyPage() {
  return DynamicCMSPage({ params: Promise.resolve({ slug: 'privacy' }) });
}
