import { z } from 'zod';
import { workshopResultsSchema } from '../schema';

export const api = {
  workshop: {
    getResults: {
      method: 'GET' as const,
      path: '/api/workshop/results' as const,
      responses: {
        200: workshopResultsSchema,
      }
    }
  }
};