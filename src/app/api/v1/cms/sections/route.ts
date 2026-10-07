import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sections = await db.getCMSSections();
    return NextResponse.json({ success: true, count: sections.length, data: sections });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sections, sectionId, toggle, action } = body;

    // Reset to factory defaults
    if (action === 'reset') {
      const resetSections = await db.resetCMSSections('Executive Admin');
      return NextResponse.json({ success: true, data: resetSections });
    }

    // Direct toggle mode
    if (sectionId && toggle) {
      const toggled = await db.toggleCMSSection(sectionId, 'Executive Admin');
      return NextResponse.json({ success: true, data: toggled });
    }

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Sections array is required' }, { status: 400 });
    }

    const updated = await db.updateCMSSections(sections, 'Executive Admin');
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
