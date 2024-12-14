import { db } from './db';
import { activityLogs } from './db/schema';

/**
 * Log activity in the system
 * @param {string} userId
 * @param {'create' | 'update' | 'delete'} action
 * @param {'student', 'teacher', 'classroom', 'subject', 'user'} objectType
 * @param {string} objectId
 */
export const log = async (userId, action, objectType, objectId) => {
  await db.insert(activityLogs).values({
    userId,
    action,
    objectType,
    objectId,
  });
};
