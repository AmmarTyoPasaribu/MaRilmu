import { Page } from '@/components/ui';

export default function SurahLoading() {
  return (
    <Page width="narrow">
      <div className="skeleton" style={{ height: 190, borderRadius: 26, marginBottom: 24 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <div className="skeleton" style={{ height: 44, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: '90%' }} />
        </div>
      ))}
    </Page>
  );
}
