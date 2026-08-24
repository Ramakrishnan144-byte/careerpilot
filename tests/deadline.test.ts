import { describe, it, expect } from 'vitest';
import { DeadlineService } from '../src/services/deadline.service';

describe('DeadlineService', () => {
  it('should categorize deadline <= 3 days as URGENT', () => {
    const targetDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const deadline = DeadlineService.processDeadline('dl-1', 'Google Assessment', 'ASSESSMENT', targetDate);

    expect(deadline.urgencyLevel).toBe('URGENT');
    expect(deadline.isOverdue).toBe(false);
    expect(deadline.daysRemaining).toBeLessThanOrEqual(3);
  });

  it('should categorize deadline between 4 and 7 days as REMINDER', () => {
    const targetDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const deadline = DeadlineService.processDeadline('dl-2', 'TCS Application', 'OPPORTUNITY', targetDate);

    expect(deadline.urgencyLevel).toBe('REMINDER');
  });

  it('should categorize deadline > 7 days as INFO', () => {
    const targetDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    const deadline = DeadlineService.processDeadline('dl-3', 'Infosys Drive', 'OPPORTUNITY', targetDate);

    expect(deadline.urgencyLevel).toBe('INFO');
  });
});
