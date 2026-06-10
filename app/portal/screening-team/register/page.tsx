'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Smartphone, IdCard, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { maskAbha } from '@/lib/utils';

type Found = {
  name: string;
  age: number;
  gender: string;
  mobile: string;
  abha?: string;
  via: string;
  patientId: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<Found | null>(null);

  function simulate(via: string) {
    setLoading(true);
    setFound(null);
    setTimeout(() => {
      setLoading(false);
      setFound({
        name: 'Ravi Teja',
        age: 47,
        gender: 'M',
        mobile: '9876543210',
        abha: via === 'mobile' ? undefined : '12-3456-7890-1234',
        via,
        patientId: 'PAT-100234',
      });
    }, 800);
  }

  return (
    <>
      <PageHeader
        title="Register Patient"
        description="Verify identity via ABHA, mobile OTP or QR scan-and-share"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity verification</CardTitle>
            <CardDescription>Choose a registration method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qr">
              <TabsList className="w-full">
                <TabsTrigger value="qr" className="flex-1"><QrCode className="mr-1 size-4" /> QR</TabsTrigger>
                <TabsTrigger value="abha" className="flex-1"><IdCard className="mr-1 size-4" /> ABHA</TabsTrigger>
                <TabsTrigger value="mobile" className="flex-1"><Smartphone className="mr-1 size-4" /> Mobile</TabsTrigger>
              </TabsList>

              <TabsContent value="qr">
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex size-40 items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground">
                    <QrCode className="size-16" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ask the patient to scan this facility QR in their ABHA app. Their profile
                    and a linking token are pushed automatically (V3 scan-and-share).
                  </p>
                  <Button onClick={() => simulate('qr')} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin" /> : <QrCode />} Simulate scan
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="abha">
                <div className="space-y-3 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="abha">ABHA number</Label>
                    <Input id="abha" placeholder="14-digit ABHA number" defaultValue="12-3456-7890-1234" />
                  </div>
                  <Button onClick={() => simulate('abha')} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin" /> : null} Send OTP & verify
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="mobile">
                <div className="space-y-3 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="mobile">Mobile number</Label>
                    <Input id="mobile" placeholder="10-digit mobile" defaultValue="9876543210" />
                  </div>
                  <Button onClick={() => simulate('mobile')} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin" /> : null} Send OTP & verify
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient details</CardTitle>
            <CardDescription>Confirm demographics before screening</CardDescription>
          </CardHeader>
          <CardContent>
            {!found ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <IdCard className="size-8" />
                Verify a patient to auto-populate their details.
              </div>
            ) : (
              <div className="space-y-4">
                <Badge variant="success">
                  <CheckCircle2 className="size-3" /> Verified via {found.via.toUpperCase()}
                </Badge>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Full name</Label>
                    <Input defaultValue={found.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mobile</Label>
                    <Input defaultValue={found.mobile} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Age</Label>
                    <Input defaultValue={found.age} type="number" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gender</Label>
                    <Select defaultValue={found.gender}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </Select>
                  </div>
                </div>
                {found.abha && (
                  <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                    <span className="text-muted-foreground">ABHA:</span>{' '}
                    <span className="font-medium">{maskAbha(found.abha)}</span>
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={() => router.push(`/portal/screening-team/emr/${found.patientId}`)}
                >
                  Register &amp; start EMR <ArrowRight />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
