import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Brain,
  Eye,
  Glasses,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { STATE_TOTALS } from '@/lib/data';
import { formatNumber } from '@/lib/utils';

const features = [
  { icon: MapPin, title: 'Statewide Screening Camps', desc: 'Village, tribal, urban-slum, school & industrial camps tracked in real time across 26 districts.' },
  { icon: Eye, title: 'Digital EMR', desc: 'Structured vision assessment, refraction and fundus records with an automated outcome decision engine.' },
  { icon: Glasses, title: 'Spectacle Supply Chain', desc: 'Order → manufacture → QA → dispatch → OTP-verified delivery, with SLA monitoring.' },
  { icon: Video, title: 'Tele-Ophthalmology', desc: 'Connect remote patients to specialist ophthalmologists via secure video consults.' },
  { icon: Brain, title: 'AI Public-Health Intelligence', desc: 'Disease hotspot mapping, demand forecasting and referral prioritisation.' },
  { icon: ShieldCheck, title: 'ABDM / DPDP Compliant', desc: 'ABHA linkage, consent management and full audit logging built in.' },
];

const stats = [
  { label: 'Citizens Screened', value: formatNumber(STATE_TOTALS.screened) },
  { label: 'Spectacles Delivered', value: formatNumber(STATE_TOTALS.spectaclesDelivered) },
  { label: 'Districts Covered', value: STATE_TOTALS.districts },
  { label: 'Active Camps', value: STATE_TOTALS.campsActive },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">
                Citizen Portal <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
            <div className="animate-fade-in">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Activity className="size-3.5 text-accent" /> Government of Andhra Pradesh · Digital Health
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Eye care for every citizen of{' '}
                <span className="text-primary">Andhra Pradesh</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                A statewide digital vision-care platform connecting screening teams,
                district officers, ophthalmologists and citizens — from screening camp
                to spectacle delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg">
                    Access Portal <ArrowRight />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Explore features
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <Card key={s.label} className="bg-card/60">
                  <CardContent className="p-5">
                    <p className="text-3xl font-bold tracking-tight text-primary">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              One platform, four connected portals
            </h2>
            <p className="mt-3 text-muted-foreground">
              Purpose-built workflows for every role in the public eye-care system.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles CTA */}
        <section className="border-t bg-secondary/40">
          <div className="container py-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: ShieldCheck, label: 'Super Admin', desc: 'SPMU statewide command' },
                { icon: Users, label: 'Nodal Officer', desc: 'District operations' },
                { icon: Stethoscope, label: 'Screening Team', desc: 'Field screening & EMR' },
                { icon: Eye, label: 'Patient', desc: 'Records & services' },
              ].map((r) => (
                <Link key={r.label} href="/login">
                  <Card className="h-full transition-colors hover:border-primary">
                    <CardContent className="flex items-center gap-3 p-5">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <r.icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row">
          <Logo subtitle={false} />
          <p>© 2026 Government of Andhra Pradesh · AP Vision Care Platform</p>
        </div>
      </footer>
    </div>
  );
}
