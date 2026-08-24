export interface ProcessedDeadline {
  id: string;
  title: string;
  entityType: 'OPPORTUNITY' | 'ASSESSMENT' | 'INTERVIEW' | 'CERTIFICATE' | 'GENERAL';
  dueDate: Date;
  daysRemaining: number;
  urgencyLevel: 'URGENT' | 'REMINDER' | 'INFO';
  isOverdue: boolean;
  actionUrl?: string;
}

export class DeadlineService {
  public static processDeadline(
    id: string,
    title: string,
    entityType: string,
    dueDate: Date | string,
    actionUrl?: string
  ): ProcessedDeadline {
    const target = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    let urgencyLevel: 'URGENT' | 'REMINDER' | 'INFO' = 'INFO';
    if (daysRemaining <= 3) {
      urgencyLevel = 'URGENT';
    } else if (daysRemaining <= 7) {
      urgencyLevel = 'REMINDER';
    }

    return {
      id,
      title,
      entityType: (entityType as any) || 'GENERAL',
      dueDate: target,
      daysRemaining,
      urgencyLevel,
      isOverdue,
      actionUrl,
    };
  }

  public static sortByUrgency(deadlines: ProcessedDeadline[]): ProcessedDeadline[] {
    return [...deadlines].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }
}
