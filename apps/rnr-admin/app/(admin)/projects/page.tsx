'use client';

import { PageContainer } from '@/components/layout/page-container';
import { Plus, Calendar, Users, MoreVertical } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed';
  progress: number;
  team: number;
  dueDate: string;
}

export default function ProjectsPage() {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      status: 'in_progress',
      progress: 65,
      team: 5,
      dueDate: '2024-04-30',
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native iOS and Android applications',
      status: 'planning',
      progress: 20,
      team: 8,
      dueDate: '2024-06-15',
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      description: 'Q2 digital marketing initiatives',
      status: 'in_progress',
      progress: 45,
      team: 3,
      dueDate: '2024-05-31',
    },
    {
      id: '4',
      name: 'API Integration',
      description: 'Third-party service integrations',
      status: 'completed',
      progress: 100,
      team: 4,
      dueDate: '2024-03-15',
    },
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'planning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    }
  };

  return (
    <PageContainer
      title="Projects"
      description="Manage and track your projects"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects' },
      ]}
      actions={
        <button className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              </div>
              <button className="rounded-lg p-2 hover:bg-accent transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{project.team} members</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

