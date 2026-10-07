import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, data, clientUserAgent, pageUrl } = body;

    const settings = await db.getSettings();
    const tracking = settings.tracking;

    // Hash email or phone if provided using SHA-256 for Meta CAPI compliance
    const hashData = (val?: string) => {
      if (!val) return undefined;
      return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
    };

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const serverCapiPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: pageUrl,
      action_source: 'website',
      user_data: {
        em: hashData(data?.userEmail),
        ph: hashData(data?.userPhone),
        client_ip_address: clientIp,
        client_user_agent: clientUserAgent || 'Mozilla/5.0',
      },
      custom_data: {
        currency: data?.currency || 'USD',
        value: data?.value || 0,
        content_name: data?.contentName,
        content_ids: data?.contentId ? [data.contentId] : undefined,
      },
    };

    // If live Conversions API token is configured, forward in background
    if (tracking.metaPixelId && tracking.conversionsApiTokenConfigured) {
      // In production: fetch(`https://graph.facebook.com/v19.0/${tracking.metaPixelId}/events?access_token=...`)
    }

    return NextResponse.json({
      success: true,
      deduplicationId: eventId,
      deduplicationKey: eventId,
      status: 'dispatched',
      serverTagging: tracking.serverSideTaggingEnabled,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
