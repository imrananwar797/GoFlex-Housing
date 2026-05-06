import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/ai.service';

const prisma = new PrismaClient();

export const extendedPrisma = prisma.$extends({
  query: {
    user: {
      async update({ args, query }) {
        const result = await query(args);
        
        // After updating a user, trigger a background refresh of their AI recommendations
        // We don't 'await' it to keep the main request fast (Event Loop optimization)
        if (result && result.id) {
          aiService.getRecommendations(result.id)
            .then(() => console.log(`✅ AI Recommendations refreshed for User #${result.id}`))
            .catch(err => console.warn(`⚠️ Failed to trigger AI refresh: ${err.message}`));
        }
        
        return result;
      }
    }
  }
});

export default extendedPrisma;
