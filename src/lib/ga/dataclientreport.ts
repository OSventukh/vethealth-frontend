import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface ReportParams {
  dimensions: { name: string }[];
  metrics: { name: string }[];
  startDate: string;
  endDate: string;
  orderBys?: any[];
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
  // const [response] = await analyticsDataClient.runReport({
  //   property: `properties/${propertyId}`,
  //   dateRanges: [
  //     {
  //       startDate: `7daysAgo`, //👈  e.g. "7daysAgo" or "30daysAgo"
  //       endDate: 'yesterday',
  //     },
  //   ],
  //   dimensions: [
  //     {
        
  //       name: 'date', // data will be year wise
  //     },
  //   ],

  //   metrics: [
  //     {
  //       name: 'activeUsers', // it returns the active users
  //     },
  //     {
  //       name: 'active7DayUsers'
  //     },
  //   ],
  //   orderBys: [
  //     {
  //       dimension: {
  //         dimensionName: 'date',
  //         orderType: 'ALPHANUMERIC',
  //       },
  //     },
  //   ],
  // });

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
