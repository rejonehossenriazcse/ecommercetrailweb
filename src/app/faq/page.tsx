import DynamicCMSPage, { generateMetadata as baseGenerateMetadata } from '../pages/[slug]/page';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return baseGenerateMetadata({ params: Promise.resolve({ slug: 'faq' }) });
}

export default async function FaqPage() {
  return DynamicCMSPage({ params: Promise.resolve({ slug: 'faq' }) });
}
