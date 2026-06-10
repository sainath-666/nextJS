import { PageHeader } from '@/components/shared/page-header';
import { CampsView } from '@/components/shared/camps-view';
import { CAMPS, STATE_TOTALS } from '@/lib/data';

export default function AdminCampsPage() {
  return (
    <>
      <PageHeader
        title="All Camps"
        description={`${STATE_TOTALS.campsActive} active · ${STATE_TOTALS.campsTotal} total camps statewide`}
      />
      <CampsView camps={CAMPS} />
    </>
  );
}
