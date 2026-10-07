import DynamicCMSPage, { generateMetadata as baseGenerateMetadata } from '../pages/[slug]/page';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return baseGenerateMetadata({ params: Promise.resolve({ slug: 'sustainability' }) });
}

export default async function SustainabilityPage() {
  return DynamicCMSPage({ params: Promise.resolve({ slug: 'sustainability' }) });
}
