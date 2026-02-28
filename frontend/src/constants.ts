import { Task, ClassItem } from './types';

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    name: 'User interview for feedback loop',
    status: 'todo',
    priority: 'medium',
    category: 'work',
    deadline: '2025-10-20',
    duration: 60,
    note: 'Prepare questions beforehand',
    order: 0
  },
  {
    id: 2,
    name: 'System functional decomposition chart',
    status: 'todo',
    priority: 'low',
    category: 'work',
    deadline: '2025-10-21',
    duration: 120,
    note: 'Use Lucidchart',
    order: 1
  }
];

export const MOCK_CLASSES: ClassItem[] = [
  {
    id: 1,
    name: 'Team Standup Meeting',
    day: 1,
    startTime: '09:00',
    endTime: '09:30',
    room: 'Video call',
    teacher: 'Alex',
    color: '#6366f1',
    isAuto: false
  }
];
