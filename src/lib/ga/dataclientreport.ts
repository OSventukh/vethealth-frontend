import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from '@google-analytics/data/build/protos/protos';

interface ReportParams {
  dimensions?: google.analytics.data.v1beta.IDimension[] | null;
  metrics?: google.analytics.data.v1beta.IMetric[] | null;
  startDate: string;
  endDate: string;
  orderBys?: google.analytics.data.v1beta.IOrderBy[] | null;
}

export const dataClientReport = async ({
  dimensions,
  metrics,
  startDate,
  endDate,
  orderBys,
}: ReportParams) => {
  const propertyId = process.env.GA_PROPERTY_ID;

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GA_CLIENT_EMAIL,
      private_key: process.env.GA_PRIVATE_KEY?.replace(/\n/gm, '\n'), // replacing is necessary
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

  return response;
};
