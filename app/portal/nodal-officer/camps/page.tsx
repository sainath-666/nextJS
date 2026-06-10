import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { CampsView } from '@/components/shared/camps-view';
import { CAMPS } from '@/lib/data';

const DISTRICT = 'Guntur';

export default function NodalCampsPage() {
  const camps = CAMPS.filter((c) => c.district === DISTRICT);
  return (
    <>
      <PageHeader
        title="Camp Scheduling"
        description={`${camps.length} camps in ${DISTRICT} district`}
        actions={<Button><Plus /> Schedule Camp</Button>}
      />
      <CampsView camps={camps} />
    </>
  );
}
