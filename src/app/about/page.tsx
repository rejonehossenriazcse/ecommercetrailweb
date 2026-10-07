import DynamicCMSPage, { generateMetadata as baseGenerateMetadata } from '../pages/[slug]/page';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return baseGenerateMetadata({ params: Promise.resolve({ slug: 'about' }) });
}

export default async function AboutPage() {
  return DynamicCMSPage({ params: Promise.resolve({ slug: 'about' }) });
}
