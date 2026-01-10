import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'cancelled';

export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  category?: string;
  location?: string;
  zone?: string;
  reportedAt: Date;
  acknowledgedAt?: Date | null;
  resolvedAt?: Date | null;
  slaDueAt?: Date | null;
}

function mapIncident(row: any): Incident {
  const toDate = (value: any): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    if (typeof value.toDate === 'function') return value.toDate();
    return null;
  };

  return {
    id: row.id,
    title: row.title ?? 'Untitled Incident',
    description: row.description ?? undefined,
    severity: (row.severity as IncidentSeverity) ?? 'medium',
    status: (row.status as IncidentStatus) ?? 'open',
    category: row.category ?? undefined,
    location: row.location ?? undefined,
    zone: row.zone ?? undefined,
    reportedAt: toDate(row.reported_at) ?? new Date(),
    acknowledgedAt: toDate(row.acknowledged_at),
    resolvedAt: toDate(row.resolved_at),
    slaDueAt: toDate(row.sla_due_at),
  };
}

async function fetchRecentIncidents(days: number = 7): Promise<Incident[]> {
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .gte('reported_at', from.toISOString())
    .order('reported_at', { ascending: false });

  if (error) {
    console.error('Error fetching incidents', error);
    throw error;
  }

  return (data ?? []).map(mapIncident);
}

export function useIncidents(days: number = 7) {
  return useQuery({
    queryKey: ['incidents', 'executive', days],
    queryFn: () => fetchRecentIncidents(days),
  });
}
