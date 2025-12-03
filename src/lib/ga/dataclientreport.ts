import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from '@google-analytics/data/build/protos/protos';

interface ReportParams {
  dimensions?: google.analytics.data.v1beta.IDimension[] | null;
  metrics?: google.analytics.data.v1beta.IMetric[] | null;
  startDate: string;
  endDate: string;
  orderBys?: google.analytics.data.v1beta.IOrderBy[] | null;
}

type ReportResponse = [
  error: Error | null,
  response: google.analytics.data.v1beta.IRunReportResponse | null,
];

export const dataClientReport = async ({
  dimensions,
  metrics,
  startDate,
  endDate,
  orderBys,
}: ReportParams): Promise<ReportResponse> => {
  const propertyId = process.env.GA_PROPERTY_ID;
  const GA_PRIVATE_KEY_BASE64 = process.env.GA_PRIVATE_KEY;

  if (!GA_PRIVATE_KEY_BASE64) {
    throw new Error('No private key available');
  }
  const GA_PRIVATE_KEY_DECODED = Buffer.from(
    GA_PRIVATE_KEY_BASE64,
    'base64'
  ).toString('utf-8');

  const GA_PRIVATE_KEY = GA_PRIVATE_KEY_DECODED.replace(/\\n/g, '\n');
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: GA_PRIVATE_KEY, // replacing is necessary
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions,
      metrics,
      orderBys,
    });

    if (!response) {
      throw new Error('No data available');
    }
    return [null, response];
  } catch (error) {
    if (error instanceof Error) {
      return [error, null];
    } else {
      const message =
        (error as { message: string }).message || 'An error occurred';
      const errorObject = new Error(message);
      return [errorObject, null];
    }
  }
};

interface RealtimeParams {
  dimensions?: google.analytics.data.v1beta.IDimension[] | null;
  metrics?: google.analytics.data.v1beta.IMetric[] | null; // default below
  limit?: number;
}

type RealtimeResponse = [
  error: Error | null,
  response: google.analytics.data.v1beta.IRunRealtimeReportResponse | null,
];

export const dataRealtimeReport = async ({
  dimensions,
  metrics = [{ name: 'activeUsers' }],
  limit = 50,
}: RealtimeParams): Promise<RealtimeResponse> => {
  const propertyId = process.env.GA_PROPERTY_ID;
  const GA_PRIVATE_KEY_BASE64 = process.env.GA_PRIVATE_KEY;
  if (!GA_PRIVATE_KEY_BASE64) throw new Error('No private key available');

  const GA_PRIVATE_KEY_DECODED = Buffer.from(
    GA_PRIVATE_KEY_BASE64,
    'base64'
  ).toString('utf-8');
  const GA_PRIVATE_KEY = GA_PRIVATE_KEY_DECODED.replace(/\\n/g, '\n');

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: GA_PRIVATE_KEY,
      },
    });

    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions,
      metrics,
      limit,
    });

    if (!response) throw new Error('No realtime data available');
    return [null, response];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : (error as any)?.message || 'An error occurred';
    return [new Error(message), null];
  }
};
