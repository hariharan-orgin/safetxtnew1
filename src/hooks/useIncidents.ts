import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebase';

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

const incidentsCollection = collection(firebaseDb, 'incidents');

function mapIncident(docSnap: any): Incident {
  const data = docSnap.data();
  const toDate = (value: any): Date | null => {
    if (value instanceof Timestamp) return value.toDate();
    if (value && typeof value.toDate === 'function') return value.toDate();
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return null;
  };

  return {
    id: docSnap.id,
    title: data.title ?? 'Untitled Incident',
    description: data.description ?? undefined,
    severity: (data.severity as IncidentSeverity) ?? 'medium',
    status: (data.status as IncidentStatus) ?? 'open',
    category: data.category ?? undefined,
    location: data.location ?? undefined,
    zone: data.zone ?? undefined,
    reportedAt: toDate(data.reportedAt) ?? new Date(),
    acknowledgedAt: toDate(data.acknowledgedAt),
    resolvedAt: toDate(data.resolvedAt),
    slaDueAt: toDate(data.slaDueAt),
  };
}

async function fetchRecentIncidents(days: number = 7): Promise<Incident[]> {
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const q = query(
    incidentsCollection,
    where('reportedAt', '>=', from)
  );

  const snap = await getDocs(q);
  return snap.docs.map(mapIncident);
}

export function useIncidents(days: number = 7) {
  return useQuery({
    queryKey: ['incidents', 'executive', days],
    queryFn: () => fetchRecentIncidents(days),
  });
}
