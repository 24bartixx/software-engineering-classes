export type ProjectStatus = 'Aktywny' | 'Zakończony' | 'Planowany';

export type Project = {
  id: string;
  name: string;
  startDate: string;
  plannedEndDate: string;
  projectManagers: string[];
  status: ProjectStatus;
  type: string;
  roles: string[];
  employees: string[];
  description: string;
};