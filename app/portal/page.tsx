import { redirect } from 'next/navigation';

// Bare /portal has no role context — send users through the login chooser.
export default function PortalIndex() {
  redirect('/login');
}
