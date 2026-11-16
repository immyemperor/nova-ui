/** A stand-in server: paged, sorted and searched like a real API. Replace with fetch() to your backend. */
export interface Invoice { id: string; customer: string; amount: number; status: 'paid' | 'due' | 'overdue'; issued: string }

const seed: Invoice[] = Array.from({ length: 137 }, (_, i) => ({
  id: `INV-${1000 + i}`,
  customer: ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'][i % 5],
  amount: ((i * 7919) % 9000) + 300,
  status: (['paid', 'due', 'overdue'] as const)[i % 3],
  issued: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
}));

export interface Query { page: number; pageSize: number; search: string; sort?: { key: string; dir: 'asc' | 'desc' } }

export function fetchInvoices(q: Query): Promise<{ rows: Invoice[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = seed.filter((r) => r.customer.toLowerCase().includes(q.search.toLowerCase()) || r.id.includes(q.search));
      if (q.sort) {
        const { key, dir } = q.sort;
        const k = key as keyof Invoice;
        data = [...data].sort((a, b) => (String(a[k]) > String(b[k]) ? 1 : -1) * (dir === 'asc' ? 1 : -1));
      }
      const start = (q.page - 1) * q.pageSize;
      resolve({ rows: data.slice(start, start + q.pageSize), total: data.length });
    }, 300);
  });
}
