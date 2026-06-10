import { Download, FileText, FileSpreadsheet, FileBarChart } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const REPORTS = [
  { id: 'R1', title: 'Monthly Programme Performance', desc: 'Statewide KPIs, district coverage & service delivery', period: 'June 2026', format: 'PDF', icon: FileBarChart },
  { id: 'R2', title: 'District-wise Screening Summary', desc: 'Camp-level screening counts and outcomes', period: 'June 2026', format: 'XLSX', icon: FileSpreadsheet },
  { id: 'R3', title: 'Spectacle Supply Chain & SLA', desc: 'Order funnel, vendor SLA compliance, delivery times', period: 'June 2026', format: 'PDF', icon: FileText },
  { id: 'R4', title: 'Referral & Teleconsult Outcomes', desc: 'Referral closure rates, specialist outcomes', period: 'Q1 2026', format: 'PDF', icon: FileText },
  { id: 'R5', title: 'ABDM Linkage & Consent Audit', desc: 'ABHA linkages, care contexts, consent compliance', period: 'June 2026', format: 'CSV', icon: FileSpreadsheet },
  { id: 'R6', title: 'AI Disease Burden & Forecast', desc: 'Hotspot detection and demand projections', period: 'Q2 2026', format: 'PDF', icon: FileBarChart },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Government Reports"
        description="Auto-generated reports for the State Programme Management Unit"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="mb-3 inline-flex w-fit rounded-lg bg-primary/10 p-2.5 text-primary">
                <r.icon className="size-5" />
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{r.title}</p>
              </div>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{r.period}</Badge>
                  <Badge variant="outline">{r.format}</Badge>
                </div>
                <Button size="sm" variant="outline">
                  <Download /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
