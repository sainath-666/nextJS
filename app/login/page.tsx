'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DEMO_USERS, ROLE_COOKIE, ROLE_LABELS } from '@/lib/auth';
import { useSession } from '@/lib/store/session';
import type { Role } from '@/lib/types';

const ROLES: Role[] = ['super_admin', 'nodal_officer', 'screening_team', 'patient'];

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setRole = useSession((s) => s.setRole);

  const [role, setSelectedRole] = useState<Role>('screening_team');
  const [step, setStep] = useState<'id' | 'otp'>('id');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const user = DEMO_USERS[role];
  const isPatient = role === 'patient';
  const idLabel = isPatient ? 'Mobile number' : 'Username';
  const idPlaceholder = isPatient ? '98765 43210' : user.name.split(' ')[0].toLowerCase();

  function sendOtp() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setOtp('123456'); // demo OTP pre-filled
    }, 600);
  }

  function signIn() {
    setLoading(true);
    setTimeout(() => {
      // Demo session: set role cookie (read by middleware) + persisted store.
      document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=86400; samesite=lax`;
      setRole(role);
      const from = params.get('from');
      router.push(from && from.includes(role.replace('_', '-')) ? from : user.home);
    }, 600);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Logo className="[&_p]:text-primary-foreground [&_div_p:last-child]:text-primary-foreground/70" />
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Statewide digital eye care, in one secure platform.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Sign in with your government-issued credentials. All access is OTP-verified,
            role-based and audit-logged in line with ABDM &amp; DPDP requirements.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">
          © 2026 Government of Andhra Pradesh
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sign in to your portal</CardTitle>
              <CardDescription>
                Choose your role to continue. This is a demo build — any OTP works.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setStep('id');
                      setOtp('');
                    }}
                    className={cn(
                      'rounded-lg border p-3 text-left text-sm transition-colors',
                      role === r
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'hover:bg-secondary',
                    )}
                  >
                    <p className="font-medium leading-tight">{ROLE_LABELS[r]}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-lg border bg-secondary/40 p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{user.name}</span> · {user.title}
                <br />
                Auth: {user.loginHint}
              </div>

              {step === 'id' ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="loginId">{idLabel}</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="loginId"
                        defaultValue={idPlaceholder}
                        className="pl-9"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={sendOtp} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <KeyRound />}
                    Send OTP
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="otp">Enter 6-digit OTP</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      inputMode="numeric"
                      className="text-center text-lg tracking-[0.5em]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo OTP pre-filled. {role === 'super_admin' && 'TOTP step skipped in demo.'}
                    </p>
                  </div>
                  <Button className="w-full" onClick={signIn} disabled={loading || otp.length < 4}>
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                    Verify &amp; Sign in
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setStep('id')}
                  >
                    Change number
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
