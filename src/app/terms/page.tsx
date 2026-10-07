import DynamicCMSPage, { generateMetadata as baseGenerateMetadata } from '../pages/[slug]/page';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return baseGenerateMetadata({ params: Promise.resolve({ slug: 'terms' }) });
}

export default async function TermsPage() {
  return DynamicCMSPage({ params: Promise.resolve({ slug: 'terms' }) });
}
