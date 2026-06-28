// utils/activity.ts

import prisma from "../prisma/client";

export const logActivity = async ({
  caseId,
  userId,
  action,
  message,
  metadata = {},
}: {
  caseId: number;
  userId: number;
  action: any;
  message: string;
  metadata?: any;
}) => {
  await prisma.caseActivity.create({
    data: {
      caseId,
      performedById: userId,
      action,
      message,
      metadata,
    },
  });
};