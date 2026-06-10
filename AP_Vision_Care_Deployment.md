# AP Vision Care — Full-Stack Deployment Prompt
## Andhra Pradesh Digital Vision Care & Public Health Intelligence Platform

---

## MASTER DEPLOYMENT PROMPT

You are a senior DevOps + Full-Stack Architect. Generate the **complete end-to-end production-ready codebase and infrastructure** for the **AP Vision Care Platform** — a Government of Andhra Pradesh statewide digital eye-care system. Follow every specification below exactly.

---

## 1. SYSTEM OVERVIEW

Build a multi-role, multi-tenant healthcare platform with:
- **4 user roles**: Super Admin (SPMU), Nodal Officer (District), Screening Team, Patient/Citizen
- **Auth**: Keycloak (OpenID Connect / OAuth2) with OTP login, RBAC, per-role realms/clients
- **Backend**: NestJS microservices (REST + WebSocket)
- **Frontend**: Next.js 14 App Router (separate portals per role)
- **Database**: PostgreSQL (primary) + Redis (cache/sessions) — each in isolated Docker containers
- **Infrastructure**: Docker Compose (dev) + Kubernetes (production)
- **API Gateway**: NestJS API Gateway or Kong
- **Documentation**: OpenAPI/Swagger auto-generated + architecture docs

---

## 2. MONOREPO STRUCTURE

```
ap-vision-care/
├── apps/
│   ├── web/                          # Next.js 14 frontend
│   │   ├── app/
│   │   │   ├── (public)/             # Landing page, patient registration
│   │   │   ├── (auth)/               # Login flow (Keycloak redirect)
│   │   │   ├── portal/
│   │   │   │   ├── super-admin/      # SPMU dashboard
│   │   │   │   ├── nodal-officer/    # District officer dashboard
│   │   │   │   ├── screening-team/   # Mobile team app (PWA-ready)
│   │   │   │   └── patient/          # Citizen self-service portal
│   │   │   └── api/                  # Next.js API routes (BFF)
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn/UI + Tailwind components
│   │   │   ├── emr/                  # EMR form components
│   │   │   ├── maps/                 # District heatmaps (Leaflet)
│   │   │   └── charts/               # Analytics dashboards (Recharts)
│   │   ├── lib/
│   │   │   ├── keycloak.ts           # Keycloak client + token refresh
│   │   │   └── api-client.ts         # Typed API client (generated from OpenAPI)
│   │   └── middleware.ts             # Route protection + role-guard
│   │
│   └── api-gateway/                  # NestJS API Gateway
│       ├── src/
│       │   ├── auth/                 # Keycloak JWT validation
│       │   ├── proxy/                # Route forwarding to microservices
│       │   └── main.ts
│       └── Dockerfile
│
├── services/
│   ├── patient-service/              # Patient registration & records
│   ├── emr-service/                  # Electronic Medical Records
│   ├── screening-service/            # Vision assessment & prescriptions
│   ├── teleconsult-service/          # Tele-ophthalmology (WebRTC/TURN)
│   ├── referral-service/             # Referral routing & tracking
│   ├── spectacle-service/            # Order → manufacture → delivery
│   ├── vendor-service/               # Spectacle vendor management & SLA
│   ├── notification-service/         # SMS / Push / Email (OTP, status)
│   ├── ai-analytics-service/         # Disease prediction & hotspot AI
│   ├── reporting-service/            # Automated government reports
│   └── audit-service/               # DPDP/ABDM compliance logging
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml        # Full local dev stack
│   │   ├── docker-compose.prod.yml   # Production overrides
│   │   ├── keycloak/
│   │   │   ├── Dockerfile
│   │   │   └── realm-export.json     # Pre-configured realm + clients
│   │   ├── postgres/
│   │   │   ├── Dockerfile
│   │   │   └── init.sql              # Schema + seed data
│   │   ├── redis/
│   │   │   └── redis.conf
│   │   └── nginx/
│   │       └── nginx.conf            # Reverse proxy + SSL termination
│   │
│   └── kubernetes/
│       ├── namespaces/
│       ├── secrets/                  # Sealed secrets (bitnami/sealed-secrets)
│       ├── configmaps/
│       ├── deployments/              # One YAML per service
│       ├── services/                 # ClusterIP + LoadBalancer configs
│       ├── ingress/                  # NGINX ingress + cert-manager TLS
│       ├── hpa/                      # Horizontal Pod Autoscaler
│       └── helm/                     # Helm chart for full stack
│
├── libs/
│   ├── shared-types/                 # TypeScript interfaces (Patient, EMR, etc.)
│   ├── shared-dtos/                  # NestJS DTOs + Zod validators
│   └── shared-utils/                 # Formatters, ABHA helpers, etc.
│
├── scripts/
│   ├── keycloak-setup.sh             # Auto-configure Keycloak realm/clients
│   ├── db-migrate.sh                 # Run all service migrations
│   └── seed-demo-data.sh             # Load demo districts/camps/patients
│
├── docs/
│   ├── architecture/
│   │   ├── system-design.md
│   │   ├── database-schema.md
│   │   ├── api-contracts.md
│   │   └── security-model.md
│   ├── deployment/
│   │   ├── local-dev.md
│   │   ├── docker-guide.md
│   │   └── kubernetes-guide.md
│   └── openapi/                      # Auto-generated Swagger JSONs per service
│
├── .env.example
├── turbo.json                        # Turborepo build pipeline
└── package.json                      # Root workspace
```

---

## 3. KEYCLOAK AUTH CONFIGURATION

### Realm Setup
Create a single realm: `ap-vision-care`

### Clients (one per app context)
| Client ID | Type | Roles |
|---|---|---|
| `apvc-web` | Public (PKCE) | All frontend users |
| `apvc-api-gateway` | Confidential | Service-to-service |
| `apvc-patient-service` | Confidential | Internal service |

### Realm Roles (RBAC)
```
super_admin
nodal_officer
screening_team_lead
ophthalmic_assistant
optometrist
data_entry_operator
patient
tele_ophthalmologist
spectacle_vendor
```

### Authentication Flows
- **All users**: OTP via SMS (ABHA-registered mobile) using Keycloak OTP Authenticator
- **Staff**: Username + OTP (no password)
- **Patient**: Mobile number + OTP only
- **Super Admin**: Username + Password + TOTP (Google Authenticator)

### Required Keycloak Config Files to Generate:
1. `realm-export.json` — full realm configuration with clients, roles, auth flows, OTP policies
2. `keycloak/Dockerfile` — Keycloak 24.x image with realm import on startup
3. `keycloak-setup.sh` — CLI script to configure realm programmatically via Keycloak Admin REST API

### NestJS JWT Validation (API Gateway)
```typescript
// Install: @nestjs/passport passport passport-jwt jwks-rsa
PassportModule.register({ defaultStrategy: 'jwt' })
JwtModule configured with:
  jwksUri: 'http://keycloak:8080/realms/ap-vision-care/protocol/openid-connect/certs'
  audience: 'apvc-api-gateway'
  issuer: 'http://keycloak:8080/realms/ap-vision-care'
```

### Next.js Keycloak Integration
```typescript
// Use: next-auth v5 with Keycloak provider
// OR: @react-keycloak/web for SPA-style
// Middleware: validate JWT, extract roles, redirect by role

// middleware.ts pattern:
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')
  const role = extractRole(token)
  if (!hasPermission(role, request.pathname)) {
    return NextResponse.redirect('/unauthorized')
  }
}
```

---

## 4. EACH NESTJS MICROSERVICE — GENERATE IN FULL

For **every service** listed in section 2, generate:

### a) Service Skeleton
```typescript
// NestJS 10 with:
@Module({
  imports: [
    TypeOrmModule.forFeature([...entities]),
    ClientsModule.register([{ name: 'NOTIFICATION_SERVICE', transport: Transport.TCP }]),
  ],
  controllers: [...],
  providers: [...services, ...repositories],
})
```

### b) Entities (TypeORM + PostgreSQL)
Generate all database entities. Key entities:

**Patient**
```typescript
@Entity() class Patient {
  @PrimaryGeneratedColumn('uuid') id: string
  abhaNumber?: string
  mobile: string
  name: string; age: number; gender: string
  district: string; mandal: string; village: string
  keycloakUserId: string
  createdAt: Date; updatedAt: Date
}
```

**EMR (ElectronicMedicalRecord)**
```typescript
@Entity() class EMR {
  id; patientId; campId; screeningTeamId
  // Symptoms
  diminishedVisionDistance: boolean
  diminishedVisionNear: boolean
  redness: boolean; watering: boolean; pain: boolean
  blurredVision: boolean; photophobia: boolean
  flashersFloaters: boolean; diplopia: boolean
  digitalEyeStrain: boolean
  // Ocular history
  diabetes: boolean; hypertension: boolean; thyroid: boolean
  glaucosaHistory: boolean; cataractHistory: boolean
  ocularTrauma: boolean; previousSurgery: boolean
  existingGlassesPower: string
  // Vision Assessment
  rightEyeUCDVA: string; rightEyeBCDVA: string; rightEyePH: string
  leftEyeUCDVA: string; leftEyeBCDVA: string; leftEyePH: string
  rightEyeUCNVA: string; leftEyeUCNVA: string
  rightEyeSph: number; rightEyeCyl: number; rightEyeAxis: number
  leftEyeSph: number; leftEyeCyl: number; leftEyeAxis: number
  addPowerRight: number; addPowerLeft: number
  muscleFunctionTest: string; iop: string; colorVision: string
  // Retinal/Fundus
  cupToDiscRatio: string; opticDiscPallor: boolean
  macularEdema: boolean; amd: boolean
  diabeticRetinopathyGrade: string
  hypertensiveRetinopathyGrade: string
  // Decision
  outcome: 'normal' | 'spectacles' | 'teleconsult' | 'referral'
  prescriptionId?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  nodalOfficerNote?: string
  createdAt: Date
}
```

**Camp**
```typescript
@Entity() class Camp {
  id; name; type: 'village'|'tribal'|'urban_slum'|'school'|'industrial'
  district; mandal; village; location: Point (PostGIS)
  scheduledDate; teamId; nodalOfficerId
  status: 'scheduled'|'active'|'completed'
  patientCount; screenedCount
}
```

**SpectacleOrder**
```typescript
@Entity() class SpectacleOrder {
  id; patientId; emrId; prescriptionId
  vendorId; status: 'pending'|'manufacturing'|'qa'|'dispatched'|'delivered'
  rightLensSph; rightLensCyl; rightLensAxis; rightLensAdd
  leftLensSph; leftLensCyl; leftLensAxis; leftLensAdd
  frameType; frameSize
  manufacturingStartedAt; qaClearedAt; dispatchedAt
  deliveryOtp; deliveryPhotoUrl; deliveryGpsLat; deliveryGpsLng
  deliveredAt; slaDeadline; slaBreached: boolean
}
```

**TeleconsultSession**
```typescript
@Entity() class TeleconsultSession {
  id; patientId; emrId; ophthalmologistId
  status: 'scheduled'|'waiting'|'active'|'completed'|'cancelled'
  roomId; webrtcToken; scheduledAt; startedAt; endedAt
  clinicalNotes; diagnosis; followUpRequired
}
```

**AuditLog** (every state mutation)
```typescript
@Entity() class AuditLog {
  id; entityType; entityId; action; performedBy
  performedByRole; ipAddress; userAgent
  before: jsonb; after: jsonb; timestamp: Date
}
```

### c) Service Layer — Business Logic

**Screening Service Key Logic:**
```typescript
// Decision Engine
determineOutcome(emr: CreateEMRDto): PatientOutcome {
  if (emr.rightEyeUCDVA > 6/18 || emr.leftEyeUCDVA > 6/18) {
    if (hasFundusAbnormality(emr)) return 'referral'
    if (needsTeleconsult(emr)) return 'teleconsult'
    return 'spectacles'
  }
  return 'normal'
}
```

**Spectacle SLA Monitoring:**
```typescript
// Cron job every 15 minutes
@Cron('*/15 * * * *')
async checkSLABreaches() {
  const overdue = await this.orderRepo.find({
    where: { slaDeadline: LessThan(new Date()), status: Not('delivered'), slaBreached: false }
  })
  for (const order of overdue) {
    order.slaBreached = true
    await this.notificationService.alertNodalOfficer(order)
  }
}
```

### d) Controllers & DTOs
- Full CRUD + domain-specific endpoints
- `class-validator` + `class-transformer` on all DTOs
- Swagger `@ApiOperation`, `@ApiResponse` decorators on every endpoint
- Guards: `@UseGuards(KeycloakJwtGuard, RolesGuard)` + `@Roles('nodal_officer')`

### e) Dockerfile (per service)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

## 5. NEXT.JS FRONTEND — ALL 4 PORTALS

### Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + Shadcn/UI
- next-auth v5 (Keycloak provider)
- React Query (TanStack) for server state
- Zustand for local state
- React Hook Form + Zod for forms
- Leaflet for district heatmaps
- Recharts for analytics
- next-pwa for Service Worker (offline screening support)

### Portal 1: Super Admin (SPMU)
Pages:
- `/portal/super-admin/dashboard` — Statewide KPIs (screened, spectacles, referrals, SLA breaches)
- `/portal/super-admin/districts` — District performance table + map
- `/portal/super-admin/users` — Nodal officer & vendor management
- `/portal/super-admin/camps` — All camps statewide
- `/portal/super-admin/vendors` — Vendor onboarding, SLA config
- `/portal/super-admin/ai-insights` — Disease hotspot map, predictions
- `/portal/super-admin/reports` — Download government reports
- `/portal/super-admin/audit` — Full audit log viewer
- `/portal/super-admin/settings` — AI model config, master data

### Portal 2: Nodal Officer
Pages:
- `/portal/nodal-officer/dashboard` — District KPIs, pending approvals
- `/portal/nodal-officer/teams` — Create/assign screening teams
- `/portal/nodal-officer/camps` — Camp scheduling, monitoring
- `/portal/nodal-officer/approvals` — Prescription approval queue (with EMR viewer)
- `/portal/nodal-officer/referrals` — Referral verification
- `/portal/nodal-officer/spectacles` — Order tracking, SLA monitoring
- `/portal/nodal-officer/vendors` — Local vendor coordination

### Portal 3: Screening Team (PWA-optimized, offline-capable)
Pages:
- `/portal/screening-team/dashboard` — Today's camp, targets
- `/portal/screening-team/register` — Patient registration (ABHA/mobile/QR)
- `/portal/screening-team/emr/[patientId]` — Full EMR form (multi-step)
  - Step 1: Symptoms & history
  - Step 2: Vision assessment (UCDVA/BCDVA/PH)
  - Step 3: Refraction (Sph/Cyl/Axis)
  - Step 4: Fundus/Retinal assessment
  - Step 5: Review & submit
- `/portal/screening-team/patients` — Today's patient list
- `/portal/screening-team/teleconsult/[sessionId]` — WebRTC teleconsult room

### Portal 4: Patient / Citizen
Pages:
- `/portal/patient/dashboard` — Personal records
- `/portal/patient/prescriptions` — View prescriptions
- `/portal/patient/spectacles` — Spectacle order status & tracking
- `/portal/patient/referrals` — Referral status
- `/portal/patient/teleconsult` — Book/join teleconsult session

### EMR Form Component (Critical)
```typescript
// Multi-step form with full validation
const EMRForm = () => {
  const form = useForm<EMRFormData>({ resolver: zodResolver(emrSchema) })
  // Step state machine
  // Auto-save as draft to localStorage (offline support)
  // Submit triggers decision engine API call
  // Show outcome: Normal / Spectacle Order / Teleconsult / Referral
}
```

### Keycloak Integration
```typescript
// app/api/auth/[...nextauth]/route.ts
export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token
        token.roles = extractRolesFromToken(account.access_token)
      }
      return token
    },
    session: async ({ session, token }) => {
      session.roles = token.roles
      session.accessToken = token.accessToken
      return session
    }
  }
}
```

---

## 6. DOCKER COMPOSE (FULL LOCAL STACK)

Generate `docker-compose.yml` with these **isolated services**, each with their own network segment:

### Services & Ports

| Container | Image | Port | Notes |
|---|---|---|---|
| `postgres-main` | postgres:16-alpine | 5432 | Primary DB |
| `postgres-keycloak` | postgres:16-alpine | 5433 | Keycloak-only DB |
| `redis` | redis:7-alpine | 6379 | Sessions + cache |
| `keycloak` | quay.io/keycloak/keycloak:24.0 | 8080 | Auth server |
| `api-gateway` | ./apps/api-gateway | 3000 | Public API entry |
| `patient-service` | ./services/patient-service | 3001 | Internal only |
| `emr-service` | ./services/emr-service | 3002 | Internal only |
| `screening-service` | ./services/screening-service | 3003 | Internal only |
| `teleconsult-service` | ./services/teleconsult-service | 3004 | WebSocket |
| `referral-service` | ./services/referral-service | 3005 | Internal only |
| `spectacle-service` | ./services/spectacle-service | 3006 | Internal only |
| `vendor-service` | ./services/vendor-service | 3007 | Internal only |
| `notification-service` | ./services/notification-service | 3008 | Internal only |
| `ai-analytics-service` | ./services/ai-analytics-service | 3009 | Internal only |
| `reporting-service` | ./services/reporting-service | 3010 | Internal only |
| `audit-service` | ./services/audit-service | 3011 | Internal only |
| `web` | ./apps/web | 3100 | Frontend (Next.js) |
| `nginx` | nginx:alpine | 80/443 | Reverse proxy |

### Key Docker Compose Config
```yaml
version: '3.9'
networks:
  frontend-net:      # web <-> api-gateway <-> keycloak
  backend-net:       # api-gateway <-> all microservices
  db-net:            # services <-> postgres-main only
  keycloak-db-net:   # keycloak <-> postgres-keycloak only
  cache-net:         # services <-> redis

volumes:
  postgres-main-data:
  postgres-keycloak-data:
  redis-data:
  keycloak-data:

services:
  postgres-main:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: apvisioncare
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-main-data:/var/lib/postgresql/data
      - ./infra/docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks: [db-net]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s; timeout: 5s; retries: 5

  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    command: start-dev --import-realm
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres-keycloak:5432/keycloak
      KC_DB_USERNAME: ${KC_DB_USER}
      KC_DB_PASSWORD: ${KC_DB_PASSWORD}
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PASSWORD}
    volumes:
      - ./infra/docker/keycloak/realm-export.json:/opt/keycloak/data/import/realm.json
    networks: [frontend-net, keycloak-db-net]
    depends_on:
      postgres-keycloak: { condition: service_healthy }
```

---

## 7. KUBERNETES MANIFESTS

Generate complete Kubernetes YAMLs for **production deployment**:

### Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apvisioncare
  labels:
    app: apvisioncare
    environment: production
```

### Per-Service Deployment Pattern
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patient-service
  namespace: apvisioncare
spec:
  replicas: 2
  selector:
    matchLabels:
      app: patient-service
  template:
    spec:
      containers:
      - name: patient-service
        image: gcr.io/apvisioncare/patient-service:latest
        ports: [{containerPort: 3001}]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: patient-service-url
        - name: KEYCLOAK_ISSUER
          valueFrom:
            configMapKeyRef:
              name: keycloak-config
              key: issuer
        resources:
          requests: {memory: "256Mi", cpu: "100m"}
          limits: {memory: "512Mi", cpu: "500m"}
        livenessProbe:
          httpGet: {path: /health, port: 3001}
          initialDelaySeconds: 30
        readinessProbe:
          httpGet: {path: /health/ready, port: 3001}
```

### Generate These Kubernetes Files:
- `namespaces/apvisioncare.yaml`
- `configmaps/app-config.yaml` — shared env (Keycloak issuer, service URLs)
- `secrets/db-secrets.yaml` (sealed) — connection strings per service
- `secrets/keycloak-secrets.yaml` (sealed)
- `deployments/<service-name>.yaml` for every service (14 total)
- `services/<service-name>.yaml` (ClusterIP for internal, LoadBalancer for gateway/web)
- `ingress/ingress.yaml` — NGINX ingress with TLS, host routing:
  - `apvisioncare.ap.gov.in` → web (Next.js)
  - `api.apvisioncare.ap.gov.in` → api-gateway
  - `auth.apvisioncare.ap.gov.in` → Keycloak
- `hpa/<service-name>.yaml` — HPA (min 2, max 10 pods based on CPU/memory)
- `pvc/postgres.yaml` — Persistent Volume Claims
- `helm/Chart.yaml` + `helm/values.yaml` — Full Helm chart

### PostgreSQL on Kubernetes
Use **Bitnami PostgreSQL Helm chart** with:
```yaml
postgresql:
  primary:
    persistence:
      enabled: true
      size: 100Gi
      storageClass: standard
  auth:
    database: apvisioncare
    existingSecret: db-secrets
```

---

## 8. DATABASE SCHEMA (PostgreSQL)

Generate full migration files (TypeORM migrations) for all entities:

```sql
-- Core tables
CREATE TABLE patients (...)
CREATE TABLE camps (...)
CREATE TABLE screening_teams (...)
CREATE TABLE emrs (...)
CREATE TABLE prescriptions (...)
CREATE TABLE spectacle_orders (...)
CREATE TABLE teleconsult_sessions (...)
CREATE TABLE referrals (...)
CREATE TABLE vendors (...)
CREATE TABLE vendor_sla_config (...)
CREATE TABLE districts (...)
CREATE TABLE mandals (...)
CREATE TABLE audit_logs (...)
CREATE TABLE ai_predictions (...)
CREATE TABLE disease_hotspots (...)

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE camps ADD COLUMN location geometry(Point, 4326);
CREATE INDEX camps_location_idx ON camps USING GIST(location);

-- Indexes for performance
CREATE INDEX emrs_patient_id_idx ON emrs(patient_id);
CREATE INDEX emrs_outcome_idx ON emrs(outcome);
CREATE INDEX spectacle_orders_sla_idx ON spectacle_orders(sla_deadline, status);
CREATE INDEX audit_logs_entity_idx ON audit_logs(entity_type, entity_id);
```

---

## 9. ENVIRONMENT VARIABLES

Generate `.env.example` with all required variables:

```bash
# App
NODE_ENV=development
APP_URL=http://localhost:3100
API_GATEWAY_URL=http://localhost:3000

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ap-vision-care
KEYCLOAK_CLIENT_ID=apvc-web
KEYCLOAK_CLIENT_SECRET=<secret>
KEYCLOAK_ISSUER=http://localhost:8080/realms/ap-vision-care
NEXTAUTH_SECRET=<32-char-secret>
NEXTAUTH_URL=http://localhost:3100

# Database (Main)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apvisioncare
DB_USER=apvc_user
DB_PASSWORD=<password>

# Database (Keycloak)
KC_DB_HOST=localhost
KC_DB_PORT=5433
KC_DB_NAME=keycloak
KC_DB_USER=kc_user
KC_DB_PASSWORD=<password>

# Redis
REDIS_URL=redis://localhost:6379

# Services (internal)
PATIENT_SERVICE_URL=http://patient-service:3001
EMR_SERVICE_URL=http://emr-service:3002
SCREENING_SERVICE_URL=http://screening-service:3003
TELECONSULT_SERVICE_URL=http://teleconsult-service:3004
REFERRAL_SERVICE_URL=http://referral-service:3005
SPECTACLE_SERVICE_URL=http://spectacle-service:3006
NOTIFICATION_SERVICE_URL=http://notification-service:3008
AI_ANALYTICS_SERVICE_URL=http://ai-analytics-service:3009

# SMS (OTP)
SMS_PROVIDER=twilio   # or msg91 / kaleyra for India
SMS_API_KEY=<key>
SMS_FROM=APVCGOV

# ABHA Integration
ABHA_API_URL=https://healthidsbx.abdm.gov.in/api/v1
ABHA_CLIENT_ID=<client_id>
ABHA_CLIENT_SECRET=<secret>

# WebRTC (Teleconsult)
TURN_SERVER_URL=turn:turn.apvisioncare.ap.gov.in:3478
TURN_USERNAME=<user>
TURN_CREDENTIAL=<cred>

# AI/ML
AI_MODEL_ENDPOINT=http://ai-analytics-service:3009
OPENAI_API_KEY=<optional, for LLM-based reports>

# Monitoring
SENTRY_DSN=<dsn>
```

---

## 10. API CONTRACTS (KEY ENDPOINTS)

### API Gateway Base: `POST /api/v1/`

#### Patient Service
```
POST   /patients/register          # New patient (OTP verified)
GET    /patients/:id               # Patient record
GET    /patients/search?abha=&mobile=&qr=  # Search
PUT    /patients/:id               # Update demographics
GET    /patients/:id/history       # Full visit history
```

#### EMR Service
```
POST   /emr                        # Create EMR draft
PUT    /emr/:id                    # Update draft
POST   /emr/:id/submit             # Submit for approval
POST   /emr/:id/approve            # Nodal Officer action
POST   /emr/:id/reject             # Nodal Officer action
GET    /emr/:id                    # Full EMR record
GET    /emr/patient/:patientId     # All EMRs for patient
POST   /emr/:id/decision           # Run decision engine
```

#### Spectacle Service
```
POST   /spectacles/orders          # Create order from prescription
GET    /spectacles/orders/:id      # Order + tracking status
PUT    /spectacles/orders/:id/status  # Vendor updates status
POST   /spectacles/orders/:id/deliver # OTP-verified delivery
GET    /spectacles/sla/breaches    # SLA monitoring (Nodal/Admin)
```

#### Teleconsult Service
```
POST   /teleconsult/sessions       # Schedule session
GET    /teleconsult/sessions/:id   # Session details + room token
POST   /teleconsult/sessions/:id/join    # Join room (generates WebRTC token)
PUT    /teleconsult/sessions/:id/complete # End session + save notes
WS     /teleconsult/ws/:roomId     # WebSocket for signaling
```

#### AI Analytics Service
```
POST   /ai/predict/risk            # Individual disease risk score
GET    /ai/hotspots?district=      # District disease burden scores
GET    /ai/demand-forecast         # Spectacle demand prediction
GET    /ai/referral-prioritization # Critical/High/Routine queue
POST   /ai/reports/generate        # Generate government report
```

---

## 11. SECURITY IMPLEMENTATION

### Encryption
- All DB columns with PII: encrypted at rest using PostgreSQL `pgcrypto`
- ABHA numbers: AES-256 encrypted before storage
- All API traffic: TLS 1.3 (enforced via NGINX/ingress)
- Spectacle delivery OTP: time-limited, single-use, stored as bcrypt hash

### RBAC Guard (NestJS)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    const user = context.switchToHttp().getRequest().user
    const userRoles = user.realm_access?.roles || []
    return requiredRoles.some(role => userRoles.includes(role))
  }
}
```

### DPDP / ABDM Compliance
- All patient data access logged to `audit_logs`
- Consent management for ABHA linkage
- Data retention policy enforcement via scheduled jobs
- Patient right-to-delete workflow
- Data masking in logs (mobile numbers, ABHA IDs)

---

## 12. DOCUMENTATION TO GENERATE

### `/docs/architecture/system-design.md`
- System architecture diagram (Mermaid)
- Component interaction flow
- Data flow diagrams
- Technology decisions and rationale

### `/docs/architecture/database-schema.md`
- Full ER diagram (Mermaid)
- Table descriptions and relationships
- Index strategy
- Partitioning strategy for `audit_logs` (by month)

### `/docs/deployment/local-dev.md`
```markdown
## Prerequisites
- Docker Desktop 4.x+
- Node.js 20+
- pnpm 8+

## Quick Start
git clone <repo>
cp .env.example .env
# Edit .env with your values
docker compose up -d postgres-main postgres-keycloak redis keycloak
./scripts/keycloak-setup.sh
./scripts/db-migrate.sh
docker compose up -d
# App: http://localhost:3100
# Keycloak: http://localhost:8080
# API: http://localhost:3000
```

### `/docs/deployment/kubernetes-guide.md`
- GKE / EKS / bare-metal setup
- Sealed secrets setup
- Cert-manager + Let's Encrypt
- Helm install commands
- Rolling update strategy
- Backup/restore procedures

### Swagger/OpenAPI
- Auto-generated from NestJS `@nestjs/swagger`
- Hosted at `api.apvisioncare.ap.gov.in/docs`
- One JSON spec per service, aggregated at gateway

---

## 13. TURBOREPO BUILD PIPELINE

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": {},
    "dev": { "cache": false, "persistent": true },
    "db:migrate": { "cache": false }
  }
}
```

---

## 14. CI/CD (GitHub Actions)

Generate `.github/workflows/`:

### `ci.yml` — On PR
```yaml
- Lint (ESLint + Prettier)
- Type check (tsc --noEmit)
- Unit tests (Jest)
- Integration tests (Supertest)
- Docker build (all services)
- Security scan (Trivy)
```

### `deploy-staging.yml` — On merge to `develop`
```yaml
- Build + push Docker images to registry
- Run DB migrations (staging)
- kubectl apply (staging namespace)
- Run smoke tests
- Notify Slack
```

### `deploy-prod.yml` — On tag `v*.*.*`
- Manual approval gate
- Blue/green deployment
- Automated rollback on health check failure

---

## 15. ABHA INTEGRATION — M1, M2, M3 WITH V3 APIs

> **CRITICAL**: All ABDM integration MUST use V3 APIs exclusively. V0.5 and V1.0 are deprecated. The AP Vision Care platform acts as both a **HIP (Health Information Provider)** for M2 and a **HIU (Health Information User)** for M3.

---

### 15.1 GATEWAY & ENVIRONMENT CONFIGURATION

```
Sandbox Gateway:    https://dev.abdm.gov.in/api/hiecm/gateway/v3/
Production Gateway: https://apis.abdm.gov.in/api/hiecm/gateway/v3/
ABHA API (Sandbox): https://abhasbx.abdm.gov.in/abha/api
ABHA API (Prod):    https://abha.abdm.gov.in/api/abha
PHR Verify (SBX):   https://abhasbx.abdm.gov.in/abha/api/v3/phr/web
PHR Verify (Prod):  https://phr.abdm.gov.in/api/phr/web/v3
HIP ID Header:      X-HIP-ID: <your-hip-id-from-HFR>
HIU ID Header:      X-HIU-ID: <your-hiu-id-from-HFR>
CM ID (Sandbox):    X-CM-ID: sbx
CM ID (Production): X-CM-ID: abdm
```

**V3 Key Changes vs Legacy APIs:**
- **Discovery is synchronous**: Return patient match directly in the HTTP response body — no async callbacks
- **Linking token at profile share**: V3 provides a linking token when patient QR is scanned — save it and use for HIP-initiated linking (no separate OTP step)
- **Unified bridge URL**: Single callback URL per registered software; route internally by `X-HIP-ID` / `X-HIU-ID` headers
- **Bridge registration**: `PATCH /v3/bridge/url` + `GET /v3/bridge-services` to verify

**Common Required Headers (all V3 calls):**
```
REQUEST-ID: <UUID v4>
TIMESTAMP:  <ISO 8601 — actual current time>
Authorization: Bearer <accessToken from session API>
X-CM-ID:    sbx  (sandbox) | abdm  (production)
```

**Sensitive data encryption (mandatory before sending to any API):**
- Fetch public key: `GET /v3/profile/public/certificate`
- Algorithm: `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`
- Encrypt: Aadhaar numbers, mobile numbers, OTP values, passwords before every API call

---

### 15.2 SESSION TOKEN (PREREQUISITE FOR ALL ABHA CALLS)

```typescript
// services/abha-service/src/auth/abdm-session.service.ts
// POST https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions
// Response: { accessToken, expiresIn: 1200, refreshToken, tokenType: "bearer" }
// Cache token in Redis; refresh 60s before expiry

interface ABDMSessionResponse {
  accessToken: string
  expiresIn: number          // 1200 seconds
  refreshExpiresIn: number
  refreshToken: string
  tokenType: 'bearer'
}

// Store in Redis with TTL = expiresIn - 60
await this.redis.set('abdm:access_token', token, 'EX', 1140)
```

---

### 15.3 MILESTONE 1 — ABHA IDENTITY LAYER (M1)

**What AP Vision Care must implement:**
- ABHA creation via Aadhaar OTP (primary) and mobile OTP (fallback)
- ABHA lookup/verification at patient registration
- QR scan-and-share (patient scans facility QR → profile auto-populated)
- Care context linking (every EMR/consultation = one care context)
- HFR (Health Facility Registry) registration for each camp/facility
- Save and persist V3 linking tokens for HIP-initiated linking

#### M1 API Flow 1: ABHA Creation via Aadhaar

```
Step 1: GET  /v3/profile/public/certificate           → Fetch RSA public key
Step 2: POST /v3/enrollment/request/otp               → Send OTP to Aadhaar-linked mobile
Step 3: POST /v3/enrollment/enrol/byAadhaar           → Verify OTP → create ABHA
Step 4: GET  /v3/enrollment/enrol/suggestion          → Get ABHA address suggestions
Step 5: POST /v3/enrollment/enrol/abha-address        → Patient selects/sets ABHA address
Step 6: POST /v3/profile/account/request/emailVerificationLink  → Optional email verify
```

**Step 2 Request — Generate OTP:**
```typescript
// POST /v3/enrollment/request/otp
{
  "txnId": "",                          // empty for first call
  "scope": ["abha-enrol"],
  "loginHint": "aadhaar",
  "loginId": "<RSA_encrypted_aadhaar>",
  "otpSystem": "aadhaar"               // "abdm" for mobile OTP fallback
}
// Response: { txnId: "1234567890:20211216223812", message: "OTP sent to ...xxx001" }
```

**Step 3 Request — Enrol by Aadhaar:**
```typescript
// POST /v3/enrollment/enrol/byAadhaar
{
  "txnId": "{{txnId_from_step2}}",
  "scope": ["abha-enrol"],
  "authData": {
    "authMethods": ["otp"],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "<RSA_encrypted_OTP>",
      "mobile": "<RSA_encrypted_mobile>"   // for mobile update during enrollment
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}
// Response includes: ABHANumber, ABHAProfile (name, dob, gender, mobile, address)
```

#### M1 API Flow 2: Mobile-Only ABHA (No Aadhaar — Fallback)

```
POST /v3/enrollment/request/otp    { loginHint: "mobile", otpSystem: "abdm" }
POST /v3/enrollment/auth/byAbdm    { txnId, otpValue (encrypted), scope: ["abha-enrol"] }
POST /v3/enrollment/enrol/abha-address   → Set ABHA address after verification
```

#### M1 API Flow 3: ABHA Verification at Registration Desk

```typescript
// Patient presents ABHA number at screening camp:
// Step 1: Generate OTP for login/verify
// POST /v3/profile/login/request/otp
{
  "scope": ["abha-login", "abha-address-login"],
  "loginHint": "abha-number",
  "loginId": "<RSA_encrypted_14_digit_ABHA>",
  "otpSystem": "abdm"
}

// Step 2: Verify OTP
// POST /v3/profile/login/verify
{
  "scope": ["abha-login", "abha-address-login"],
  "authData": {
    "authMethods": ["otp"],
    "otp": { "txnId": "{{txnId}}", "otpValue": "<encrypted_OTP>" }
  }
}
// Response: { X-token } — user token for fetching profile

// Step 3: Fetch ABHA profile
// GET /v3/profile/account (with X-token header)
// Response: { ABHANumber, name, dob, gender, mobile, address, photo }
```

#### M1 API Flow 4: QR Scan-and-Share (V3 — CRITICAL)

```typescript
// Patient opens ABHA app → scans facility QR code
// ABDM pushes patient profile to your bridge URL:
// POST https://your-bridge.apvisioncare.gov.in/v0.5/hip/patient-share
// (Incoming from ABDM — your HIP bridge must handle this)

interface V3ShareProfilePayload {
  requestId: string
  timestamp: string
  intent: {
    patient: {
      abhaAddress: string       // e.g. patient@abdm
      abhaNumber: string
      name: string
      gender: 'M' | 'F' | 'O'
      yearOfBirth: number
      dayOfBirth: number
      monthOfBirth: number
      address: { district: string; state: string; pincode: string }
      identifiers: Array<{ type: string; value: string }>
    }
    linking: {
      linkToken: string         // ⚠️ V3 — PERSIST THIS TOKEN to DB immediately
    }
  }
  hipId: string
}

// YOUR HANDLER:
async handleShareProfile(payload: V3ShareProfilePayload) {
  // 1. Extract patient data → auto-populate registration form
  // 2. CRITICAL: Save linkToken to abha_link_tokens table with patientId
  //    linkToken expires — must be used for care context linking without OTP
  // 3. Acknowledge within 5 seconds (sync response)
  return { acknowledgement: { status: 'SUCCESS', healthId: payload.intent.patient.abhaAddress } }
}
```

#### M1 API Flow 5: Care Context Linking (After EMR Submission)

```typescript
// After a patient's EMR is submitted and approved, link it as a care context:
// Use the linkToken saved from QR scan (V3 HIP-initiated, no patient OTP required)

// POST https://dev.abdm.gov.in/api/hiecm/gateway/v3/links/link/init
{
  "requestId": "<uuid>",
  "timestamp": "<ISO8601>",
  "link": {
    "accessToken": "{{linkToken_saved_from_QR_scan}}",
    "patient": {
      "referenceNumber": "APVC-PAT-{{patientId}}",
      "display": "{{patient.name}}",
      "careContexts": [
        {
          "referenceNumber": "APVC-EMR-{{emrId}}",
          "display": "Vision Screening - {{campName}} - {{date}}"
        },
        {
          "referenceNumber": "APVC-RX-{{prescriptionId}}",
          "display": "Spectacle Prescription - {{date}}"
        }
      ]
    }
  }
}
```

**Care Context Strategy for AP Vision Care:**
| Care Context Type | Reference Format | Display Label |
|---|---|---|
| Vision Screening Camp | `APVC-EMR-{emrId}` | `Vision Screening - {campName} - {date}` |
| Spectacle Prescription | `APVC-RX-{prescriptionId}` | `Spectacle Prescription - {date}` |
| Tele-consultation | `APVC-TC-{sessionId}` | `Tele-ophthalmology - {ophthalmologistName} - {date}` |
| Specialist Referral | `APVC-REF-{referralId}` | `Referral - {hospitalName} - {date}` |
| Fundus Assessment | `APVC-FUNDUS-{emrId}` | `Retinal Assessment - {campName} - {date}` |

#### M1 Database Schema

```typescript
// New tables required for ABHA M1

@Entity() class AbhaLinkToken {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() patientId: string
  @Column() abhaNumber: string
  @Column() abhaAddress: string
  @Column() linkToken: string           // From V3 QR scan-share; use for HIP linking
  @Column() linkTokenExpiresAt: Date    // Track expiry
  @Column() used: boolean              // Mark after linking
  @CreateDateColumn() createdAt: Date
}

@Entity() class AbhaCareContext {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() patientId: string
  @Column() abhaNumber: string
  @Column() referenceNumber: string    // APVC-EMR-xxx
  @Column() display: string
  @Column() type: 'emr' | 'prescription' | 'teleconsult' | 'referral' | 'fundus'
  @Column() entityId: string           // emrId / prescriptionId / etc.
  @Column() linked: boolean
  @Column({ nullable: true }) linkedAt: Date
  @CreateDateColumn() createdAt: Date
}

@Entity() class AbhaPatientMapping {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ unique: true }) abhaNumber: string
  @Column({ nullable: true }) abhaAddress: string
  @Column() patientId: string          // Local patient UUID
  @Column() verifiedAt: Date
  @Column() verificationMethod: 'aadhaar_otp' | 'mobile_otp' | 'qr_scan'
}
```

#### M1 NestJS Service

```typescript
// services/abha-service/src/m1/abha-m1.service.ts

@Injectable()
export class AbhaM1Service {
  // Fetch + cache RSA public key for encryption
  async getPublicKey(): Promise<string>

  // RSA encrypt sensitive data before API calls
  encryptData(data: string, publicKey: string): string

  // Generate OTP for Aadhaar-based ABHA creation
  async requestAadhaarOtp(aadhaarNumber: string): Promise<{ txnId: string }>

  // Complete ABHA creation after OTP verification
  async enrollByAadhaar(txnId: string, otp: string, mobile?: string): Promise<ABHAProfile>

  // Mobile-only enrollment (no Aadhaar)
  async requestMobileOtp(mobile: string): Promise<{ txnId: string }>
  async verifyMobileAndEnrol(txnId: string, otp: string): Promise<ABHAProfile>

  // Verify existing ABHA at registration
  async requestLoginOtp(abhaNumber: string): Promise<{ txnId: string }>
  async verifyLoginOtp(txnId: string, otp: string): Promise<{ xToken: string }>
  async fetchProfile(xToken: string): Promise<ABHAProfile>

  // QR scan handler — saves linkToken
  async handleShareProfile(payload: V3ShareProfilePayload): Promise<void>

  // Link care context after EMR submission
  async linkCareContext(patientId: string, careContexts: CareContext[]): Promise<void>

  // ABHA address suggestions after enrollment
  async getSuggestions(txnId: string): Promise<string[]>
  async setAbhaAddress(txnId: string, abhaAddress: string): Promise<void>
}
```

---

### 15.4 MILESTONE 2 — HIP: HEALTH INFORMATION PROVIDER (M2)

**What AP Vision Care must implement as HIP:**
- Register as HIP in HFR with unique HIP ID
- Handle ABDM consent notifications (incoming webhooks)
- On consent + data request: produce FHIR R4 bundles for vision care records
- Encrypt FHIR bundles using Fidelius (ECDH + AES-GCM)
- Push encrypted data to the ABDM-provided data push URL
- Handle care context notifications to patients

#### M2 Complete Data Flow

```
1. Patient grants consent via ABHA app
2. ABDM → POST /hip/consent/notification     (to your bridge URL)
   Your HIP: acknowledge within 5s
3. ABDM → POST /hip/health-information/request  (data pull request with consent artefact)
   Your HIP: validate consent artefact, build FHIR bundles, encrypt, push data
4. Your HIP → POST <dataPushUrl>              (encrypted FHIR bundles)
5. ABDM → sends HIU-specific notification that data is available
```

#### M2 Incoming Webhook Handlers (HIP Bridge)

```typescript
// apps/api-gateway/src/hip/hip-bridge.controller.ts
// ABDM POSTs to: https://bridge.apvisioncare.gov.in/hip/...

// Handler 1: Consent notification
@Post('/hip/consent/notification')
async handleConsentNotification(@Body() payload: ConsentNotificationPayload) {
  // Extract: consentId, status ('GRANTED'|'REVOKED'|'EXPIRED'), careContexts
  // If GRANTED: store consent artefact, mark care contexts as consented
  // If REVOKED: stop serving data for this consent
  // Respond synchronously within 5s:
  return { 
    requestId: uuidv4(), 
    timestamp: new Date().toISOString(),
    acknowledgement: { status: 'OK' }
  }
}

// Handler 2: Health information data request
@Post('/hip/health-information/request')
async handleHealthInfoRequest(@Body() payload: HealthInfoRequestPayload) {
  // payload contains: consentId, consentArtefact, dateRange, dataPushUrl,
  //                   keyMaterial { cryptoAlg, curve, dhPublicKey, nonce }
  // Validate consent artefact (check expiry, scope, HIP ID match)
  // Fetch care context data from your DB
  // Convert to FHIR R4 bundles
  // Encrypt using Fidelius
  // Push to dataPushUrl asynchronously
  // Respond with 202 Accepted immediately
  this.hipM2Service.processAndPushAsync(payload)
  return { requestId: uuidv4(), timestamp: new Date().toISOString() }
}

// Handler 3: Patient discovery (V3 — synchronous, must respond in HTTP body)
@Post('/hip/patients/discover')
async handlePatientDiscovery(@Body() payload: PatientDiscoveryPayload) {
  // payload: patient.id (ABHA address), verifiedIdentifiers, unverifiedIdentifiers
  // Search your patient DB by ABHA number or mobile
  const patient = await this.patientService.findByAbhaOrMobile(...)
  // V3: return result synchronously in response body — NOT async callback
  return {
    requestId: uuidv4(),
    timestamp: new Date().toISOString(),
    patient: patient ? {
      referenceNumber: `APVC-PAT-${patient.id}`,
      display: patient.name,
      careContexts: await this.getCareContexts(patient.id),
      matchedBy: ['MOBILE', 'ABHA_NUMBER']
    } : null,
    resp: { requestId: payload.requestId }
  }
}
```

#### M2 FHIR R4 Bundle Construction (Vision Care Records)

The AP Vision Care platform must produce these FHIR bundle types:

**1. OPVision / OP Consultation Bundle (for EMR records)**
```typescript
// FHIR R4 Bundle — OPConsultation profile
const bundle: FHIRBundle = {
  resourceType: 'Bundle',
  id: `APVC-EMR-${emrId}`,
  type: 'document',
  timestamp: emr.createdAt.toISOString(),
  entry: [
    // Composition (mandatory root)
    {
      resource: {
        resourceType: 'Composition',
        status: 'final',
        type: { coding: [{ system: 'http://snomed.info/sct', code: '371530004', display: 'Clinical consultation report' }] },
        subject: { reference: `Patient/APVC-PAT-${patientId}` },
        date: emr.createdAt.toISOString(),
        author: [{ reference: `Practitioner/APVC-OPT-${screeningTeamId}` }],
        title: 'Vision Screening Report',
        section: [{ title: 'Chief Complaint', code: {...}, entry: [{reference: 'Condition/...'}] }]
      }
    },
    // Patient resource
    {
      resource: {
        resourceType: 'Patient',
        id: `APVC-PAT-${patientId}`,
        identifier: [
          { system: 'https://healthid.ndhm.gov.in', value: patient.abhaNumber },
          { system: 'https://apvisioncare.ap.gov.in/patient', value: patientId }
        ],
        name: [{ text: patient.name, family: patient.lastName, given: [patient.firstName] }],
        gender: patient.gender === 'M' ? 'male' : 'female',
        birthDate: patient.dob
      }
    },
    // Observation: Visual Acuity (UCDVA/BCDVA)
    {
      resource: {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '79880-1', display: 'Visual acuity' }] },
        subject: { reference: `Patient/APVC-PAT-${patientId}` },
        component: [
          { code: { coding: [{ code: '251739003', display: 'Right eye visual acuity' }] }, valueString: emr.rightEyeUCDVA },
          { code: { coding: [{ code: '251740001', display: 'Left eye visual acuity' }] }, valueString: emr.leftEyeUCDVA }
        ]
      }
    },
    // Observation: Intraocular Pressure
    { resource: { resourceType: 'Observation', code: { coding: [{ system: 'http://loinc.org', code: '56844-4', display: 'IOP' }] }, valueString: emr.iop } },
    // Condition: Diagnosis (refractive error / DR / glaucoma etc.)
    { resource: { resourceType: 'Condition', code: { coding: [{ system: 'http://snomed.info/sct', code: getSnomedCode(emr.outcome) }] }, subject: { reference: `Patient/APVC-PAT-${patientId}` } } },
    // MedicationRequest (Spectacle Prescription)
    ...(emr.outcome === 'spectacles' ? [buildSpectaclePrescriptionResource(prescription)] : []),
  ]
}
```

**2. Wellness Record Bundle (for screening camp visits)**
```typescript
// FHIR Bundle type: WellnessRecord
// Covers: vision screening observations, IOP, color vision, muscle function test
// Resource types: Observation (visual acuity, IOP), Practitioner, Organization (camp)
```

**3. Diagnostic Report Bundle (for Fundus/Retinal Assessment)**
```typescript
// FHIR Bundle type: DiagnosticReport
// DiagnosticReport.code: { snomed: '252832004' — Fundus photography }
// Includes: DR grade (ETDRS scale), CDR, macular findings as Observation resources
// Media resource for fundus image if captured
```

**4. Prescription Bundle (Spectacle Prescription)**
```typescript
// FHIR Bundle type: Prescription
// MedicationRequest resource with:
// medication.code: SNOMED 57368009 (spectacles)
// dosageInstruction.extension with spherical, cylindrical, axis, add power
// For both eyes — use left/right body site codings
```

#### M2 Fidelius Encryption (ECDH + AES-GCM)

```typescript
// services/abha-service/src/m2/fidelius.service.ts
// Use: npm install node-jose elliptic

async encryptFHIRBundle(
  fhirBundle: FHIRBundle,
  requesterPublicKey: string,  // ECDH public key from consent request
  requesterNonce: string,
  hipNonce: string,
): Promise<EncryptedData> {
  // 1. Generate ephemeral ECDH key pair (Curve25519 or P-256)
  const ephemeralKeyPair = generateECDHKeyPair()
  // 2. Key agreement: ECDH with requester's public key
  const sharedSecret = ecdh(ephemeralKeyPair.privateKey, requesterPublicKey)
  // 3. Derive key: HKDF(sharedSecret, XOR(requesterNonce, hipNonce))
  const aesKey = hkdf(sharedSecret, xorNonces(requesterNonce, hipNonce))
  // 4. Encrypt with AES-256-GCM
  const { ciphertext, iv } = aesGcmEncrypt(JSON.stringify(fhirBundle), aesKey)
  return {
    contentEncryptionAlgorithm: 'AES/GCM/NoPadding',
    keyMaterial: {
      cryptoAlg: 'ECDH',
      curve: 'Curve25519',
      dhPublicKey: { keyValue: ephemeralKeyPair.publicKey, expiry: '', parameters: '' },
      nonce: hipNonce
    },
    data: ciphertext
  }
}
```

#### M2 Data Push

```typescript
// After encryption, push to ABDM-provided URL:
// POST {payload.dataPushUrl}
{
  "pageNumber": 0,
  "pageCount": 1,
  "transactionId": "{{transactionId_from_request}}",
  "entries": [
    {
      "content": "<base64_encoded_encrypted_fhir>",
      "media": "application/fhir+json",
      "checksum": "<sha256_of_plaintext>",
      "careContextReference": "APVC-EMR-{{emrId}}"
    }
  ],
  "keyMaterial": { /* ephemeral key material from Fidelius */ }
}
```

---

### 15.5 MILESTONE 3 — HIU: HEALTH INFORMATION USER (M3)

**What AP Vision Care must implement as HIU:**
- Initiate consent requests to fetch patient's prior health records from other facilities
- Handle consent grant/deny/expiry callbacks
- Fetch encrypted FHIR data from HIP via ABDM gateway
- Decrypt using Fidelius (reverse of M2)
- Parse and display prior health records in the EMR/screening interface

**Use Case for AP Vision Care (M3):** When a patient presents at a screening camp, optometrists can request their prior health records (diabetic history, previous eye exams, systemic conditions) from other ABDM-linked providers — enabling informed clinical decisions.

#### M3 Consent Request Flow

```typescript
// Step 1: Initiate consent request to ABDM gateway
// POST /v3/consent/requests/init

{
  "requestId": "<uuid>",
  "timestamp": "<ISO8601>",
  "consent": {
    "purpose": { "text": "Vision Care Screening", "code": "PATRQT", "refUri": "http://terminology.hl7.org/CodeSystem/v3-ActReason" },
    "patient": { "id": "patient@abdm" },             // patient's ABHA address
    "hiu": { "id": "APVC-HIU-{{hipId}}" },
    "requester": {
      "name": "Dr. {{optometristName}} — AP Vision Care",
      "identifier": { "type": "REGNO", "value": "{{hprId}}", "system": "https://hpr.ndhm.gov.in" }
    },
    "hiTypes": ["OPConsultation", "DiagnosticReport", "WellnessRecord", "Prescription"],
    "permission": {
      "accessMode": "VIEW",
      "dateRange": { "from": "{{fiveYearsAgo}}", "to": "{{today}}" },
      "dataEraseAt": "{{consentExpiry}}",
      "frequency": { "unit": "HOUR", "value": 1, "repeats": 0 }
    }
  }
}

// Response: { consentRequest: { id: "consent-request-uuid" } }
// Patient receives notification in ABHA app to approve/deny
```

#### M3 Incoming Callbacks (HIU Bridge)

```typescript
// ABDM POSTs consent response to your HIU bridge:
// POST /hiu/consent/notification

interface ConsentNotificationPayload {
  notification: {
    consentRequestId: string
    status: 'GRANTED' | 'DENIED' | 'EXPIRED' | 'REVOKED'
    consentArtefacts?: Array<{ id: string }>  // One artefact per HIP
  }
}

// On GRANTED: trigger health info fetch for each consent artefact
// On DENIED/EXPIRED: notify UI, log the denial

// POST /hiu/health-information/fetch (request data using consent artefact)
{
  "requestId": "<uuid>",
  "timestamp": "<ISO8601>",
  "consent": { "id": "{{consentArtefactId}}" },
  "dateRange": { "from": "...", "to": "..." },
  "dataPushUrl": "https://bridge.apvisioncare.gov.in/hiu/health-information/receive",
  "keyMaterial": {
    "cryptoAlg": "ECDH",
    "curve": "Curve25519",
    "dhPublicKey": { "expiry": "...", "parameters": "", "keyValue": "{{hiuPublicKey}}" },
    "nonce": "{{randomNonce}}"
  }
}
```

#### M3 Data Reception and Decryption

```typescript
// HIU receives encrypted FHIR at your data push URL:
// POST /hiu/health-information/receive

async receiveHealthInfo(payload: HealthInfoReceivePayload) {
  for (const entry of payload.entries) {
    // 1. Decode base64 content
    const encryptedData = Buffer.from(entry.content, 'base64')
    // 2. Decrypt using Fidelius (reverse: use HIU private key + HIP's keyMaterial)
    const fhirJson = await this.fideliusService.decrypt(encryptedData, entry.keyMaterial, this.hiuNonce)
    // 3. Parse FHIR bundle
    const bundle = JSON.parse(fhirJson) as FHIRBundle
    // 4. Extract relevant clinical data for pre-filling EMR
    const priorHistory = await this.fhirParserService.extractForVisionCare(bundle)
    // 5. Store in session cache (Redis) for the active screening session
    await this.redis.setEx(`prior_records:${patientId}`, 3600, JSON.stringify(priorHistory))
    // 6. Notify frontend via WebSocket to refresh EMR pre-fill panel
    this.gateway.sendToRoom(`screening:${screeningTeamId}`, 'prior-records-ready', priorHistory)
  }
}
```

#### M3 FHIR Data Extracted for Vision Care Context

```typescript
// services/abha-service/src/m3/fhir-parser.service.ts
interface PriorHealthSummary {
  // From DiagnosticReport / Observation bundles
  diabetes: { confirmed: boolean; hba1c?: number; lastTestedAt?: string }
  hypertension: { confirmed: boolean; lastBpReading?: string }
  previousEyeConditions: string[]         // e.g. ["Glaucoma", "Cataract"]
  previousSurgeries: string[]
  currentMedications: string[]
  // From prior OPConsultation or Prescription bundles
  existingSpectaclePrescription?: {
    rightEye: { sph: number; cyl: number; axis: number }
    leftEye: { sph: number; cyl: number; axis: number }
    prescribedAt: string
    prescribingProvider: string
  }
  // From WellnessRecord
  previousVisualAcuity?: {
    rightEye: string; leftEye: string; measuredAt: string
  }
}
```

---

### 15.6 ABHA SERVICE — COMPLETE NESTJS MODULE

```typescript
// services/abha-service/src/app.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([AbhaPatientMapping, AbhaLinkToken, AbhaCareContext, ConsentArtefact, HealthInfoRequest]),
    HttpModule,                          // For ABDM API calls
    BullModule.registerQueue({ name: 'fhir-push' }),  // Async data push queue
    BullModule.registerQueue({ name: 'consent-fetch' }),
  ],
  controllers: [
    AbhaEnrollmentController,            // M1: ABHA creation / verification
    HipBridgeController,                 // M2: Incoming ABDM webhooks (discovery, consent, data request)
    HiuBridgeController,                 // M3: Consent init, data fetch, receive
  ],
  providers: [
    AbdmSessionService,                  // Token management + caching
    AbhaM1Service,                       // ABHA creation / QR / care context linking
    AbhaM2HipService,                    // Consent handling, FHIR bundle generation, data push
    AbhaM3HiuService,                    // Consent request, data fetch, FHIR parse
    FhirBundleBuilderService,            // Build FHIR R4 bundles from EMR entities
    FhirParserService,                   // Parse incoming FHIR bundles (M3)
    FideliusService,                     // ECDH + AES-GCM encrypt/decrypt
    HfrRegistrationService,              // Register facilities in Health Facility Registry
  ]
})
export class AbhaModule {}
```

#### ABHA Service API Endpoints

```
// M1 — Enrollment
POST /abha/enroll/request-otp          → Initiate Aadhaar/mobile OTP
POST /abha/enroll/verify-aadhaar       → Complete Aadhaar enrollment
POST /abha/enroll/verify-mobile        → Mobile-only enrollment
GET  /abha/enroll/suggestions          → ABHA address options
POST /abha/enroll/set-address          → Confirm ABHA address
POST /abha/verify/request-otp          → Login OTP for existing ABHA
POST /abha/verify/login                → Verify login OTP → get X-token
GET  /abha/profile                     → Fetch profile (requires X-token)
POST /abha/care-context/link           → Link care context to ABHA

// HIP Bridge (M2 — ABDM calls these)
POST /hip/patients/discover            → Patient discovery (V3 synchronous)
POST /hip/care-contexts/on-add         → Care context notification
POST /hip/consent/notification         → Consent granted/revoked notification
POST /hip/health-information/request   → Data pull request with consent artefact

// HIU (M3 — AP Vision Care initiates these)
POST /hiu/consent/init                 → Start consent request
GET  /hiu/consent/:id/status           → Check consent status
POST /hiu/health-information/fetch     → Pull data after consent granted
POST /hiu/health-information/receive   → Webhook: receive encrypted FHIR
GET  /hiu/prior-records/:patientId     → Get decrypted prior records for EMR
```

---

### 15.7 HFR REGISTRATION SETUP

```typescript
// Each screening camp must be registered as a facility in HFR before M2 goes live

interface HFRRegistration {
  facilityName: string                  // e.g. "AP Vision Care Camp — Anantapur District"
  facilityType: 'Mobile_Health_Camp'
  state: 'Andhra Pradesh'
  district: string
  ownership: 'Government'
  services: ['Ophthalmology', 'Vision Care']
  hipId: string                         // Auto-assigned by HFR — use as X-HIP-ID header
}

// One HIP ID covers all camps in a district (multi-facility single bridge pattern)
// Bridge routes internally by district using X-HIP-ID header value
```

---

### 15.8 SANDBOX → PRODUCTION CHECKLIST

```
M1 Sandbox Certification:
  ☐ Register on sandbox.abdm.gov.in — get clientId + clientSecret
  ☐ Configure bridge URL: PATCH /v3/bridge/url
  ☐ Verify bridge: GET /v3/bridge-services
  ☐ Implement + test all M1 API flows (Aadhaar OTP, mobile OTP, QR scan, care context linking)
  ☐ Pass all NHA M1 test cases
  ☐ Sandbox OTP note: OTPs return in API response (not real SMS) — use value "123456" or from response

M2 Sandbox Certification:
  ☐ Register as HIP in HFR Sandbox
  ☐ Implement /hip/patients/discover (V3 synchronous — no async callback)
  ☐ Implement consent notification handler
  ☐ Implement health information request handler
  ☐ Build FHIR R4 bundles (validate with Inferno test suite before submitting)
  ☐ Implement Fidelius encryption
  ☐ Pass NHA M2 test suite

M3 Sandbox Certification:
  ☐ Register as HIU in HFR Sandbox
  ☐ Implement consent request initiation flow
  ☐ Implement /hiu/health-information/receive webhook
  ☐ Implement Fidelius decryption
  ☐ Implement FHIR parser for all bundle types
  ☐ Pass NHA M3 test suite

Production:
  ☐ Get production clientId + clientSecret from NHA
  ☐ Register HFR facilities in production
  ☐ Update X-CM-ID to "abdm" (not "sbx")
  ☐ Switch base URLs to production endpoints
  ☐ Enable real SMS OTP delivery
  ☐ Security review: RSA encryption, TLS pinning, audit logging for all ABHA data access
```

---

### 15.9 ENVIRONMENT VARIABLES — ABHA ADDITIONS

```bash
# ABDM / ABHA (add to .env.example)
ABDM_CLIENT_ID=<from sandbox.abdm.gov.in>
ABDM_CLIENT_SECRET=<from sandbox.abdm.gov.in>
ABDM_GATEWAY_URL=https://dev.abdm.gov.in/api/hiecm/gateway/v3
ABHA_API_URL=https://abhasbx.abdm.gov.in/abha/api
ABDM_CM_ID=sbx                             # Change to "abdm" for production
ABDM_BRIDGE_URL=https://bridge.apvisioncare.gov.in
ABDM_HIP_ID=APVC-HIP-AP-STATEWIDE          # From HFR registration
ABDM_HIU_ID=APVC-HIU-AP-STATEWIDE          # From HFR registration
ABDM_HFR_CLIENT_ID=<hfr-client-id>
ABDM_HFR_CLIENT_SECRET=<hfr-client-secret>

# Fidelius (ECDH keys for M2/M3 — generate one permanent key pair per environment)
FIDELIUS_HIP_PRIVATE_KEY=<base64-encoded-private-key>
FIDELIUS_HIP_PUBLIC_KEY=<base64-encoded-public-key>
FIDELIUS_HIU_PRIVATE_KEY=<base64-encoded-private-key>
FIDELIUS_HIU_PUBLIC_KEY=<base64-encoded-public-key>
```

---

## 16. GENERATE EVERYTHING IN THIS ORDER

1. **Monorepo root**: `package.json`, `turbo.json`, `.env.example`, `.gitignore`
2. **Shared libs**: `libs/shared-types/`, `libs/shared-dtos/`, `libs/shared-utils/`
3. **Keycloak**: `infra/docker/keycloak/Dockerfile`, `realm-export.json`, `keycloak-setup.sh`
4. **PostgreSQL**: `infra/docker/postgres/init.sql` (all tables, extensions, indexes, ABHA tables)
5. **Docker Compose**: `docker-compose.yml` (all 17+ services including abha-service, networks, volumes)
6. **API Gateway**: Full NestJS app with JWT validation, proxying, Swagger aggregation, HIP/HIU bridge routing
7. **ABHA Service**: Session management → M1 (enrollment, QR, care context) → M2 (HIP bridge, FHIR builder, Fidelius encrypt) → M3 (HIU consent, FHIR parser, Fidelius decrypt)
8. **Each microservice** (repeat for all 11): entities → DTOs → service → controller → module → Dockerfile
9. **Next.js frontend**: Auth config → middleware → all 4 portals → ABHA enrollment UI → prior records panel in EMR
10. **Kubernetes**: namespaces → configmaps → secrets → deployments → services → ingress → HPA → Helm chart
11. **CI/CD**: GitHub Actions workflows
12. **Documentation**: All markdown docs + architecture diagrams + ABHA integration guide + FHIR bundle examples

---

## OUTPUT FORMAT

- Generate each file with its **full path** as a comment header
- Include all `import` statements and configuration
- No placeholder comments like `// TODO` or `// implement this`
- Every endpoint must be fully implemented with error handling
- Every Docker service must have `healthcheck`
- Every Kubernetes deployment must have `livenessProbe` and `readinessProbe`
- All secrets must use environment variables — never hardcoded values

**Start with Step 1 (monorepo root) and proceed sequentially through all 15 steps.**

---

## 16. GOVERNMENT COMPLIANCE & STANDARDS

### 16.1 Healthcare Standards
- ABDM (Latest Version) — ABHA, HIP, HIU, HPR, HFR
- FHIR R4 with NRCeS India profiles
- Health Information Exchange (HIE-CM)
- NDHM interoperability guidelines

### 16.2 Government & Security Standards
- **DPDP Act 2023** — Data Protection and Privacy compliance
- **CERT-In Guidelines** — Incident reporting, vulnerability disclosure
- **STQC Security Audit Readiness** — Pre-certification documentation
- **MeitY Cloud (GI Cloud / NIC Cloud)** — Deployment on government cloud
- **OWASP Top 10** — Mandatory remediation before go-live
- **ISO 27001** — Information security management framework
- **SOC2 Logging Standards** — Audit trail completeness

---

## 17. DATABASE-FIRST ARCHITECTURE (MANDATORY)

> **CRITICAL**: The database is the single source of truth. Generate ALL SQL DDL first, then generate TypeORM entities FROM the schema. Never use `TypeORM synchronize: true`. Never auto-generate schema from entities. Production uses SQL migrations only.

### 17.1 Directory Structure

```
infra/database/
├── schema.sql                  # Master DDL — all tables, types, extensions
├── seed.sql                    # Reference/master data seed
├── views.sql                   # Standard SQL views
├── materialized_views.sql      # Materialized views with refresh schedules
├── procedures.sql              # Stored procedures
├── functions.sql               # PL/pgSQL functions
├── triggers.sql                # Audit, validation, notification triggers
├── indexes.sql                 # All indexes (B-tree, GIST, GIN, partial)
├── partitions.sql              # Table partitioning definitions
└── rollback/                   # Rollback scripts per migration version
    └── V{n}__rollback.sql
```

### 17.2 PostgreSQL Extensions to Enable

```sql
CREATE EXTENSION IF NOT EXISTS postgis;          -- Geospatial queries
CREATE EXTENSION IF NOT EXISTS pgcrypto;         -- AES-256 column encryption
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS pg_trgm;          -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS btree_gin;        -- JSONB + composite indexes
CREATE EXTENSION IF NOT EXISTS pg_stat_statements; -- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS pgaudit;          -- Audit logging
```

### 17.3 Stored Procedures (Generate All)

```sql
-- Patient lifecycle
CALL sp_create_patient(p_name, p_mobile, p_dob, p_gender, p_district, p_mandal, p_village, p_abha_number)
CALL sp_update_patient(p_patient_id, p_fields JSONB)

-- EMR lifecycle
CALL sp_create_emr(p_patient_id, p_camp_id, p_team_id)
CALL sp_submit_emr(p_emr_id, p_emr_data JSONB)        -- runs decision engine, creates outcome records
CALL sp_approve_emr(p_emr_id, p_nodal_officer_id, p_note TEXT)
CALL sp_reject_emr(p_emr_id, p_nodal_officer_id, p_reason TEXT)

-- Clinical workflows
CALL sp_create_referral(p_emr_id, p_hospital_id, p_priority)
CALL sp_create_spectacle_order(p_emr_id, p_prescription_id, p_vendor_id)
CALL sp_complete_teleconsult(p_session_id, p_notes TEXT, p_diagnosis TEXT)

-- Admin & reporting
CALL sp_generate_monthly_report(p_district_id, p_month INT, p_year INT)
CALL sp_archive_old_records(p_cutoff_date DATE)        -- DPDP retention policy
CALL sp_refresh_all_materialized_views()
```

### 17.4 Materialized Views (Auto-refresh every 15 minutes via pg_cron)

```sql
-- mv_state_dashboard       — Statewide KPIs (total screened, spectacles, referrals, SLA status)
-- mv_district_dashboard    — Per-district breakdown of all KPIs
-- mv_disease_hotspots      — District-level disease burden scores with PostGIS geometry
-- mv_vendor_performance    — Vendor SLA compliance, breach count, avg delivery days
-- mv_sla_monitoring        — All open spectacle orders with SLA countdown
-- mv_abdm_statistics       — ABHA creation count, care context links, consent transactions per district
```

### 17.5 Partitioning Strategy

```sql
-- audit_logs: RANGE partition by month (auto-create monthly partitions)
CREATE TABLE audit_logs (...)  PARTITION BY RANGE (created_at);
CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- Generate 3 years of partitions + auto-creation trigger

-- emrs: LIST partition by district (13 districts of Andhra Pradesh)
CREATE TABLE emrs (...) PARTITION BY LIST (district);

-- patient_activity: RANGE partition by year
CREATE TABLE patient_activity (...) PARTITION BY RANGE (activity_year);
```

### 17.6 Triggers

```sql
-- Audit trigger on all clinical tables (emrs, spectacle_orders, referrals, teleconsult_sessions)
-- Fires on INSERT/UPDATE/DELETE → writes before/after JSONB to audit_logs

-- Notification trigger on spectacle_orders status change
-- → calls pg_notify('order_status_change', payload) → NestJS listener → notification service

-- EMR submit trigger: validate required fields, run decision engine function inline
-- SLA breach trigger: on spectacle_orders UPDATE when now() > sla_deadline

-- ABHA linkage trigger: on new emr INSERT with abha_number → enqueue care context linking job
```

### 17.7 Flyway Migration Naming Convention

```
infra/database/migrations/
  V1__initial_schema.sql
  V2__abha_tables.sql
  V3__abdm_tables.sql
  V4__partitioning.sql
  V5__materialized_views.sql
  V6__stored_procedures.sql
  V7__triggers.sql
  V8__indexes.sql
  V9__seed_master_data.sql
```

---

## 18. ABDM ECOSYSTEM — DEDICATED SERVICES

Generate three focused ABDM services in addition to the abha-service from Section 15:

```
services/
├── abdm-service/        # Gateway auth, bridge management, gateway token cache
├── fhir-service/        # FHIR R4 resource management, validation, search
└── consent-service/     # Full consent lifecycle state machine
```

### 18.1 abdm-service Responsibilities
- ABDM gateway session management (V3 token cache in Redis)
- Bridge URL registration and health monitoring
- HPR integration (doctor/optometrist verification via HPR registry)
- HFR integration (facility lookup — hospital, PHC, CHC, medical college)
- Gateway transaction logging to `abdm_gateway_transactions` table
- JWE/JWS security for gateway payloads

### 18.2 fhir-service Responsibilities
- Full FHIR R4 resource CRUD with NRCeS India profile validation
- Resource types: Patient, Practitioner, PractitionerRole, Organization, Location, Encounter, Observation, Condition, Procedure, Medication, DiagnosticReport, Appointment, CarePlan, DocumentReference, ServiceRequest
- FHIR search API (`GET /fhir/R4/{resourceType}?{searchParams}`)
- FHIR Bundle assembly and parsing
- Inferno-compatible validation before any M2 data push
- Resource mappers: EMR entity → FHIR Observation, Prescription → FHIR MedicationRequest, etc.

### 18.3 consent-service Responsibilities
- Consent state machine: REQUESTED → GRANTED | DENIED → EXPIRED | REVOKED
- Consent request initiation (M3 HIU flow)
- Consent artifact storage and validation
- Consent audit trail (every state change logged with timestamp + actor)
- Data sharing authorization checks (called by fhir-service before any record release)
- Record access verification API (used by HIP bridge before pushing data)

### 18.4 ABDM Database Tables (Generate All)

```sql
-- Core ABDM identity tables
abha_profiles           -- abha_number, abha_address, name, dob, gender, mobile, verified_at
abha_addresses          -- Multiple ABHA addresses per profile; preferred flag
abha_linkages           -- patient_id ↔ abha_number mapping with verification method
abha_auth_sessions      -- OTP txnId, x-token, expiry tracking per enrollment session

-- Consent tables
consent_requests        -- requestId, patient_abha, hiu_id, purpose, hi_types, date_range, status
consent_artifacts       -- artefact_id, consent_request_id, hip_id, granted_at, expiry, scope
consent_audit_logs      -- Every consent state transition with actor, timestamp, IP

-- FHIR tables
fhir_resources          -- resource_type, resource_id, version, content JSONB, patient_id
health_information_requests  -- request_id, consent_id, date_range, data_push_url, key_material JSONB
health_information_responses -- transaction_id, request_id, entry_count, push_status, pushed_at

-- Registry tables
hpr_practitioners       -- hpr_id, name, qualification, registration_number, verified_at
hfr_facilities          -- hfr_id, name, type, district, location GEOMETRY, contact, hip_id

-- Audit
abdm_gateway_transactions -- request_id, endpoint, method, status_code, latency_ms, timestamp
abdm_audit_logs           -- All ABDM-related actions with actor, entity, before/after JSONB
```

---

## 19. OFFLINE-FIRST ARCHITECTURE (MANDATORY FOR SCREENING TEAMS)

The screening team PWA must work fully offline in areas with zero connectivity. All data captured offline must sync automatically when connectivity is restored.

### 19.1 Client-Side Storage (IndexedDB via Dexie.js)

```typescript
// apps/web/lib/offline/db.ts
const db = new Dexie('APVisionCareOffline')
db.version(1).stores({
  pendingRegistrations: '++id, patientId, syncStatus, createdAt',
  pendingEmrs:          '++id, emrId, patientId, syncStatus, createdAt',
  draftEmrs:            '++id, emrId, patientId, savedAt',
  masterData:           'key',          // districts, mandals, villages — pre-loaded
  campData:             'campId',       // today's assigned camp + team info
  syncQueue:            '++id, type, payload, retryCount, nextRetryAt',
})
```

### 19.2 Service Worker (next-pwa)

```typescript
// Cache strategy per resource type:
// - Static assets (JS/CSS/fonts): CacheFirst, cache-busted on deploy
// - API GET requests (master data, patient lookup): NetworkFirst with 5s timeout, fallback to cache
// - API POST/PUT (registration, EMR): BackgroundSync queue — store in IndexedDB, sync on reconnect
// - Map tiles: CacheFirst with 7-day TTL
// - ABDM OTP flows: NetworkOnly (always require connectivity)

// Background sync registration:
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-records') {
    event.waitUntil(syncAllPending())
  }
})
```

### 19.3 Synchronization Engine

```typescript
// apps/web/lib/offline/sync-engine.ts
class SyncEngine {
  async syncAll(): Promise<SyncResult> {
    const queue = await db.syncQueue.where('syncStatus').equals('pending').toArray()
    for (const item of queue) {
      try {
        await this.processItem(item)           // POST to API with retry
        await db.syncQueue.update(item.id, { syncStatus: 'synced' })
      } catch (e) {
        await this.scheduleRetry(item)         // Exponential backoff
      }
    }
  }

  // Conflict resolution: server wins for approved records, client wins for drafts
  async resolveConflict(local: EMRDraft, server: EMR): Promise<EMR> {
    if (server.status === 'submitted' || server.status === 'approved') return server
    return mergeDeep(server, local)            // Merge — server fields + any local additions
  }
}
```

### 19.4 Offline Modules to Generate

- **Offline EMR Module**: Full multi-step EMR form works offline; auto-saves to IndexedDB every 30s; submit queued for sync
- **Offline Registration Module**: Patient registration captures all fields; ABHA creation queued (requires connectivity)
- **Draft Preservation**: Unsaved form data survives page refresh, app crash, device restart
- **Auto Recovery**: On connectivity restore, show sync progress indicator; notify team lead on completion

---

## 20. GIS & PUBLIC HEALTH INTELLIGENCE

### 20.1 PostGIS Analytics Queries

```sql
-- Disease heatmap: count EMRs with DR by village point
SELECT v.name, v.location, COUNT(e.id) as dr_count,
       COUNT(e.id) * 1.0 / v.population as prevalence_rate
FROM emrs e JOIN patients p ON e.patient_id = p.id
JOIN villages v ON p.village_id = v.id
WHERE e.diabetic_retinopathy_grade IS NOT NULL
  AND e.created_at >= NOW() - INTERVAL '1 year'
GROUP BY v.name, v.location, v.population;

-- Coverage gap: villages with no camp in last 6 months (within district bounds)
SELECT v.name, v.location, ST_Distance(v.location, nearest_camp.location) as km_to_camp
FROM villages v
CROSS JOIN LATERAL (
  SELECT c.location FROM camps c
  WHERE c.district = v.district AND c.completed_date >= NOW() - INTERVAL '6 months'
  ORDER BY v.location <-> c.location LIMIT 1
) nearest_camp
WHERE nearest_camp.location IS NULL OR ST_Distance(v.location, nearest_camp.location) > 5000;
```

### 20.2 GIS Layers & Maps

| Layer | Geometry | Data Shown |
|---|---|---|
| State | Polygon | Statewide summary KPIs |
| District (13) | Polygon | District-level coverage %, disease burden |
| Mandal | Polygon | Mandal-level screening density |
| Village | Point | Individual village screening status |
| Camp locations | Point | Completed/scheduled/active camps |
| Referral flows | LineString | Patient origin → referral hospital |
| Vendor delivery | Point | Delivery GPS coordinates |

### 20.3 Public Health Dashboards

- **Cataract Hotspots**: Villages with cataract prevalence > state average (color-coded red/amber/green)
- **Diabetic Retinopathy Hotspots**: Correlation with known diabetes burden districts
- **School Coverage**: % of schools within 10km of a completed camp
- **Tribal Coverage**: Scheduled tribe habitations vs. camp reach (PVTG priority)
- **Referral Density**: Heatmap of referral volumes to identify gaps in specialist access

---

## 21. AI/ML PLATFORM

### 21.1 Models to Build & Deploy

| Model | Input Features | Output | Algorithm |
|---|---|---|---|
| Cataract Risk | Age, VA, IOP, diabetes, lens opacity | Risk score 0–1 | XGBoost |
| Diabetic Retinopathy | HbA1c, diabetes duration, VA, fundus | DR grade (ETDRS) | CNN (ResNet-50) |
| Glaucoma | CDR, IOP, age, family history | Risk score | Random Forest |
| Spectacle Demand | District history, seasonal patterns, camp schedule | Monthly demand forecast | LSTM |
| Camp Planning | Village location, population, last visit, disease burden | Optimized camp schedule | OR / greedy |
| Referral Prioritization | Diagnosis severity, wait time, distance | Priority (Critical/High/Routine) | Gradient Boosting |
| Vendor SLA Prediction | Vendor history, order volume, location | Breach probability | Logistic Regression |

### 21.2 MLOps Stack

```
services/ai-analytics-service/
├── models/                    # Trained model artifacts
├── training/                  # Training scripts (Python)
├── serving/                   # FastAPI model serving endpoints
├── mlflow/                    # MLflow tracking server config
├── drift/                     # Data drift detection (Evidently AI)
└── retraining/                # Scheduled retraining Airflow DAGs

# MLflow config: experiment tracking, model registry, artifact store (S3/MinIO)
# A/B testing: shadow mode — new model runs in parallel, compare accuracy before promotion
# Drift detection: trigger retraining when input distribution shifts > 10%
```

---

## 22. NOTIFICATION ENGINE

### 22.1 Multi-Channel, Multi-Provider

```typescript
// services/notification-service/src/providers/

// Priority order: NIC SMS (primary, government) → MSG91 → Kaleyra → Twilio (fallback)
// WhatsApp: Meta Cloud API via MSG91 WhatsApp Business
// Push: Firebase Cloud Messaging (FCM) for Android/iOS apps
// Email: SMTP via NIC email gateway (government) with Nodemailer

interface NotificationJob {
  channel: 'sms' | 'whatsapp' | 'email' | 'push'
  provider?: 'nic' | 'msg91' | 'kaleyra' | 'twilio'  // auto-selected if omitted
  templateId: string
  recipient: { mobile?: string; email?: string; fcmToken?: string }
  variables: Record<string, string>
  priority: 'high' | 'normal' | 'low'
  scheduledAt?: Date
}
```

### 22.2 Notification Templates

| Template ID | Channel | Trigger |
|---|---|---|
| `otp_login` | SMS | Keycloak OTP login |
| `otp_abha_enroll` | SMS | ABHA enrollment |
| `registration_success` | SMS + WhatsApp | Patient registered at camp |
| `spectacle_dispatched` | SMS + WhatsApp | Spectacle order dispatched |
| `spectacle_ready` | SMS | Spectacle ready for delivery |
| `teleconsult_reminder` | SMS + WhatsApp | 30 min before teleconsult |
| `referral_confirmed` | SMS | Referral accepted by hospital |
| `sla_breach_alert` | SMS + Email | Vendor SLA breached → Nodal Officer |
| `consent_request` | Push | ABHA consent request pending |

---

## 23. TELEMEDICINE PLATFORM

### 23.1 WebRTC Architecture

```typescript
// services/teleconsult-service/src/webrtc/

// STUN: Google STUN (dev) + NIC STUN (production)
// TURN: Self-hosted coturn on dedicated VM; credentials rotated every 24h
// Signaling: NestJS WebSocket Gateway (Socket.io)
// Recording: MediaRecorder API → encrypted S3/MinIO with patient consent

interface TeleconsultRoom {
  roomId: string
  patientPeerId: string
  doctorPeerId: string
  turnCredentials: { username: string; credential: string; ttl: number }
  sessionKey: string         // AES-256 key for recording encryption
  consentObtained: boolean   // Patient consent for recording — mandatory
}
```

### 23.2 Teleconsult Features
- Screen sharing for fundus image review (patient-side camera → doctor screen)
- Real-time fundus image upload during session (JPEG, compressed)
- In-session prescription generation with digital signature
- Session recording (consent-gated, stored encrypted, auto-deleted after 90 days)
- Bandwidth-adaptive: 720p → 480p → audio-only fallback

---

## 24. CITIZEN MOBILE APPLICATION (FLUTTER)

### 24.1 Project Structure

```
apps/mobile/
├── lib/
│   ├── main.dart
│   ├── core/
│   │   ├── auth/           # Keycloak PKCE + OTP login
│   │   ├── api/            # Dio HTTP client + interceptors
│   │   └── storage/        # Flutter Secure Storage (tokens)
│   ├── features/
│   │   ├── home/           # Dashboard with personal health summary
│   │   ├── records/        # View EMR history
│   │   ├── prescription/   # View + download PDF spectacle prescription
│   │   ├── spectacle/      # Order tracking with status timeline
│   │   ├── referral/       # Referral status + hospital directions
│   │   ├── teleconsult/    # Book + join WebRTC teleconsult
│   │   └── notifications/  # Push notification inbox
│   └── shared/
│       ├── widgets/
│       └── theme/          # AP government design system colors
├── android/
├── ios/
└── pubspec.yaml
```

### 24.2 Flutter Dependencies
- `flutter_keycloak` / `flutter_appauth` — OIDC/PKCE auth
- `dio` — HTTP client with token refresh interceptor
- `flutter_secure_storage` — encrypted token storage
- `flutter_local_notifications` + `firebase_messaging` — push notifications
- `flutter_webrtc` — teleconsult video calls
- `pdf` + `printing` — spectacle prescription PDF download
- `google_maps_flutter` — delivery tracking map
- `hive` — local data caching

---

## 25. DATA WAREHOUSE & BUSINESS INTELLIGENCE

### 25.1 Architecture

```
infra/analytics/
├── airflow/                   # Apache Airflow DAGs
│   ├── dags/
│   │   ├── etl_daily.py       # Daily ETL: OLTP → analytics cluster
│   │   ├── etl_monthly.py     # Monthly aggregations + report generation
│   │   ├── ml_retrain.py      # Trigger model retraining
│   │   └── abdm_stats.py      # ABDM usage statistics
├── superset/                  # Apache Superset config + dashboards
│   ├── dashboards/
│   │   ├── state_dashboard.json
│   │   ├── district_dashboard.json
│   │   └── vendor_dashboard.json
└── powerbi/                   # Power BI dataset connection config
```

### 25.2 Analytics PostgreSQL Cluster (Separate from OLTP)
- Streaming replication from primary OLTP cluster (read replica promoted for analytics)
- Star schema: `fact_screenings`, `fact_orders`, `fact_referrals` + dimension tables
- Pre-aggregated KPI tables refreshed nightly by Airflow
- Power BI connects via read-only analytics user

### 25.3 KPIs to Track
- **Coverage %**: Screened patients / estimated eligible population per district
- **Disease Burden**: Prevalence rate per 1000 screened per disease type per district
- **Referral Success Rate**: Referrals completed / referrals generated
- **Vendor SLA %**: Orders delivered on time / total orders per vendor
- **ABDM Adoption**: ABHA-linked patients / total registered patients per district

---

## 26. ENTERPRISE MONITORING & OBSERVABILITY

### 26.1 Full Monitoring Stack (Docker Compose + Kubernetes)

```yaml
# infra/monitoring/docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana:latest
    ports: ["3200:3000"]
    volumes: [./grafana/dashboards:/etc/grafana/provisioning/dashboards]

  loki:
    image: grafana/loki:latest
    ports: ["3100:3100"]

  promtail:
    image: grafana/promtail:latest
    volumes: [/var/log:/var/log, ./promtail.yml:/etc/promtail/config.yml]

  alertmanager:
    image: prom/alertmanager:latest
    volumes: [./alertmanager.yml:/etc/alertmanager/alertmanager.yml]

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports: ["16686:16686", "4317:4317"]   # UI + OTLP gRPC

  node-exporter:      # Host metrics
  cadvisor:           # Container metrics
  postgres-exporter:  # PostgreSQL metrics
  redis-exporter:     # Redis metrics
  blackbox-exporter:  # HTTP endpoint probes (uptime monitoring)
```

### 26.2 Prometheus Scrape Targets

| Target | Metrics |
|---|---|
| All NestJS services | HTTP request rate, latency p50/p95/p99, error rate (via `prom-client`) |
| PostgreSQL exporter | Query latency, connections, replication lag, table bloat |
| Redis exporter | Memory usage, hit rate, eviction rate, connected clients |
| Keycloak | Login success/fail rate, session count, token issuance rate |
| Node exporter | CPU, memory, disk I/O, network per node |
| cAdvisor | Per-container CPU, memory, restart count |
| Blackbox exporter | API endpoint availability, SSL cert expiry |
| ABDM gateway | Custom gauge: `abdm_api_latency_ms`, `abdm_consent_count`, `abha_creation_count` |

### 26.3 Grafana Dashboards to Generate

```
infra/monitoring/grafana/dashboards/
├── 01_infrastructure.json      # Node/cluster health
├── 02_kubernetes.json          # Pod status, HPA, resource usage
├── 03_microservices.json       # Per-service RED metrics
├── 04_postgresql.json          # DB performance + replication
├── 05_redis.json               # Cache performance
├── 06_keycloak.json            # Auth metrics
├── 07_business_kpis.json       # Screenings/day, prescriptions, SLA status
├── 08_abdm.json                # ABHA creation, consent, HIE metrics
├── 09_sla_monitoring.json      # Real-time spectacle order SLA countdown
└── 10_security.json            # Failed logins, WAF blocks, audit events
```

### 26.4 Alerting Rules

```yaml
# infra/monitoring/prometheus/alerts.yml
groups:
  - name: infrastructure
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels: { severity: critical }
        annotations: { summary: "Service {{ $labels.job }} is DOWN" }

      - alert: HighCPU
        expr: node_cpu_utilization > 85
        for: 5m
        labels: { severity: warning }

      - alert: DatabaseDown
        expr: pg_up == 0
        for: 30s
        labels: { severity: critical }

      - alert: ReplicationLag
        expr: pg_replication_lag_seconds > 60
        for: 2m
        labels: { severity: warning }

      - alert: SLABreachImminent
        expr: apvc_spectacle_sla_hours_remaining < 4
        for: 0m
        labels: { severity: warning }
        annotations: { summary: "Spectacle order {{ $labels.order_id }} SLA breach in < 4 hours" }

      - alert: ABDMGatewayFailure
        expr: rate(abdm_api_errors_total[5m]) > 0.1
        for: 2m
        labels: { severity: critical }
```

### 26.5 Alert Notification Channels

```yaml
# alertmanager.yml
receivers:
  - name: critical-alerts
    slack_configs:   [{ channel: '#apvc-alerts-critical', api_url: '...' }]
    email_configs:   [{ to: 'spmu-it@ap.gov.in' }]
    webhook_configs: [{ url: 'http://notification-service:3008/webhook/alert' }]
    # → notification-service sends SMS to on-call team + WhatsApp to SPMU

  - name: warning-alerts
    slack_configs:   [{ channel: '#apvc-alerts' }]
    email_configs:   [{ to: 'district-it@ap.gov.in' }]
```

### 26.6 OpenTelemetry Tracing

```typescript
// Each NestJS service instruments with @opentelemetry/auto-instrumentations-node
// Traces exported to Jaeger via OTLP gRPC (port 4317)
// Trace context propagated via W3C TraceContext headers
// Sample 100% of ABDM gateway calls; 10% of other API calls

// Instrumentation in main.ts (before app bootstrap):
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: process.env.JAEGER_OTLP_URL }),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME }),
})
sdk.start()
```

---

## 27. HIGH AVAILABILITY & AUTO-SCALING

### 27.1 Kubernetes Cluster Architecture

```
Production K8s Cluster:
  Control Plane: 3 nodes (HA etcd)
  Worker Nodes:
    - General pool:  4 nodes (8 vCPU, 32GB RAM each)
    - DB pool:       2 nodes (16 vCPU, 64GB RAM, NVMe SSD)
    - AI/GPU pool:   2 nodes (GPU-enabled for model inference)
    - Monitoring:    1 dedicated node
```

### 27.2 HPA for All Services

```yaml
# Generate one HPA per service with these parameters:
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: patient-service-hpa
  namespace: apvisioncare
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: patient-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }
    - type: Resource
      resource:
        name: memory
        target: { type: Utilization, averageUtilization: 75 }
    - type: Pods
      pods:
        metric: { name: http_requests_per_second }
        target: { type: AverageValue, averageValue: "1000" }
```

### 27.3 PostgreSQL High Availability

```yaml
# Use Bitnami PostgreSQL HA Helm chart with:
postgresql-ha:
  postgresql:
    replicaCount: 3           # 1 primary + 2 read replicas
    replicationMode: streaming
    synchronousCommit: "on"   # For patient safety — no data loss
  pgbouncer:
    enabled: true             # Connection pooling
    maxClientConnections: 1000
    defaultPoolSize: 25
  persistence:
    size: 500Gi
    storageClass: premium-ssd
```

### 27.4 Redis High Availability

```yaml
# Redis Sentinel (3 sentinels + 1 primary + 2 replicas)
redis:
  architecture: replication
  sentinel:
    enabled: true
    masterSet: apvc-redis
    quorum: 2
  master:
    persistence: { size: 20Gi }
```

### 27.5 Keycloak Cluster

```yaml
# Keycloak 24.x in cluster mode:
keycloak:
  replicas: 3
  extraEnv:
    KC_CACHE: ispn                   # Infinispan cluster cache
    KC_CACHE_STACK: kubernetes
    JAVA_OPTS_APPEND: >
      -Djgroups.dns.query=keycloak-headless.apvisioncare.svc.cluster.local
```

### 27.6 Database Connection Strategy

```
Application → PgBouncer (transaction pooling) → PostgreSQL Primary (writes)
                                              → Read Replica 1 (analytics queries)
                                              → Read Replica 2 (reporting)
```

---

## 28. DISASTER RECOVERY

### 28.1 Targets
- **RPO**: 15 minutes (maximum data loss window)
- **RTO**: 1 hour (maximum downtime before recovery)

### 28.2 Backup Strategy

```yaml
# PostgreSQL continuous archiving:
# WAL archiving to S3/MinIO every 60s (WAL-E or pgBackRest)
# Daily full backup at 02:00 IST → retained 30 days
# Monthly backup → retained 7 years (DPDP compliance)
# PITR: restore to any point in last 30 days

# Backup validation: weekly automated restore test to DR cluster
# Alerts if backup fails or backup age > 25 hours

# pgBackRest config:
[global]
repo1-type=s3
repo1-s3-bucket=apvc-db-backups
repo1-s3-region=ap-south-1
repo1-retention-full=30
repo1-retention-archive=30
```

### 28.3 DR Architecture

```
Primary Region (GI Cloud / NIC — Hyderabad)
  └── Production K8s cluster + PostgreSQL primary

DR Region (NIC — Delhi or Mumbai)
  └── Standby K8s cluster (scaled down, ready)
  └── PostgreSQL streaming replica (sync delay < 15 min)
  └── Redis replica

Failover:
  - Automatic: if primary unreachable for > 5 min, promote DR replica
  - DNS failover via Route53 or equivalent (TTL 60s)
  - Runbook: docs/dr/failover-runbook.md (generate this document)
```

---

## 29. SECURITY HARDENING

### 29.1 Secrets Management

```yaml
# HashiCorp Vault (deployed on K8s via Vault Helm chart)
# All app secrets injected via Vault Agent sidecar — never in ConfigMaps
# Secret rotation: DB passwords rotated every 90 days automatically
# Vault audit log: every secret access logged

# Sealed Secrets (Bitnami) for K8s secrets in Git
# SonarQube: static code analysis on every PR (quality gate must pass)
# Trivy: container vulnerability scanning in CI pipeline
# OWASP ZAP: automated DAST scan on staging before every production deploy
```

### 29.2 Network Security

```yaml
# WAF: ModSecurity with OWASP Core Rule Set on NGINX ingress
# DDoS: Rate limiting (100 req/min per IP) + connection throttling at ingress
# Network Policies: deny all ingress/egress by default; whitelist only required paths
# TLS: 1.3 minimum; HSTS enabled; certificate auto-renewal via cert-manager
# mTLS: service-to-service communication via Istio or NGINX mTLS (optional but recommended)
```

### 29.3 Compliance Controls

```typescript
// All PII fields encrypted at rest (pgcrypto AES-256):
// patient.mobile, patient.abha_number, patient.aadhaar_hash (SHA-256 — never store plain)
// All API responses mask PII in logs: mobile → +91XXXXXX89, ABHA → XXXX-XXXX-1234

// DPDP Act Compliance:
// - Patient consent recorded before data collection
// - Right to erasure: sp_delete_patient_data() implements soft delete + audit trail
// - Data retention: 7 years for medical records; auto-archive after 10 years
// - Data localization: all data stored in Indian data centers (NIC/GI Cloud)
```

---

## 30. GOVERNMENT REPORTING

### 30.1 Report Schedule

| Report | Frequency | Recipients | Format |
|---|---|---|---|
| Daily Operations Summary | Daily 07:00 IST | District Nodal Officers | PDF + Email |
| Weekly District Dashboard | Monday 08:00 | SPMU + District Officers | PDF + Excel |
| Monthly State Report | 1st of month | SPMU + NHM | PDF + PowerPoint |
| Vendor SLA Report | Monthly | SPMU + Finance | Excel + PDF |
| ABDM Adoption Report | Monthly | SPMU + NHM + NHA | PDF |
| Camp Coverage Report | Weekly | SPMU | PDF + GIS Map |

### 30.2 ABDM-Specific Reports (for NHA submission)

```
- ABHA Creation Count: by district, by method (Aadhaar/mobile/DL)
- ABHA Linked Patients: % of registered patients with linked ABHA
- Consent Transactions: count by type (GRANTED/DENIED/REVOKED)
- Health Information Exchanges: M2 data pushes + M3 data fetches count
- Facility Adoption: % of camps registered as HIP in HFR
- Care Context Links: total care contexts created per month
```

### 30.3 Export Formats

```typescript
// services/reporting-service/src/exporters/
// PDF: Puppeteer (headless Chrome) → HTML template → PDF
// Excel: ExcelJS with AP government branding
// CSV: Papa Parse (streaming for large datasets)
// PowerPoint: pptxgenjs with government slide template
// Open Government Data Format: JSON-LD with schema.org + DCAT metadata
```

---

## 31. MASTER DATA MANAGEMENT

### 31.1 Administrative Hierarchy

```sql
-- Pre-load on seed.sql:
states          (id, name, code)                         -- Andhra Pradesh
districts       (id, state_id, name, code, hq_city)      -- 13 districts
mandals         (id, district_id, name, mandal_type)      -- ~670 mandals
villages        (id, mandal_id, name, population, location GEOMETRY, habitation_type)
```

### 31.2 Healthcare Facility Master

```sql
hospitals       (id, name, type, district_id, hfr_id, location, beds, specialties[])
phcs            (id, name, district_id, mandal_id, hfr_id, location)
chcs            (id, name, district_id, hfr_id, location, ophthal_available)
medical_colleges(id, name, district_id, hfr_id, location, teaching_hospital)
```

### 31.3 Clinical Master Data

```sql
disease_master  (id, name, snomed_code, icd10_code, category)
medicine_master (id, name, generic_name, rxnorm_code, form, strength)
frame_master    (id, type, size, material, cost, vendor_id)
lens_master     (id, type, index, coating, vendor_id, cost_per_pair)
```

---

## 32. PERFORMANCE & SLA TARGETS

### 32.1 Scale Requirements
- **Target population**: All of Andhra Pradesh (~50 million citizens)
- **Concurrent users**: 100,000+ (peak: camp screening days + government reviews)
- **Patient records**: 10 million+ (Year 1 target: 2M screened)
- **Data retention**: 10+ years with legal hold capability

### 32.2 Response Time SLAs

| API Type | Target | Alert Threshold |
|---|---|---|
| Patient registration | < 500ms p95 | > 1s |
| EMR submission | < 800ms p95 | > 2s |
| Dashboard load | < 3s p95 | > 5s |
| Patient search | < 2s p95 | > 3s |
| Report generation | < 60s | > 120s |
| ABDM OTP | < 5s p95 | > 10s |

### 32.3 Availability SLAs

| Component | Availability Target | Max Downtime/Month |
|---|---|---|
| Full Platform | 99.95% | 21 minutes |
| PostgreSQL | 99.99% | 4.3 minutes |
| Keycloak | 99.95% | 21 minutes |
| ABDM Gateway | Per NHA SLA | Per NHA SLA |

---

## 33. FINAL ARCHITECTURE CHECKLIST

The generated solution must satisfy all of the following before marking complete:

```
Infrastructure
  ☐ Production-ready Kubernetes cluster manifests (all 30+ services)
  ☐ PostgreSQL HA cluster (1 primary + 2 replicas + PgBouncer)
  ☐ Redis Sentinel (1 primary + 2 replicas + 3 sentinels)
  ☐ Keycloak cluster (3 replicas, Infinispan cache)
  ☐ Full monitoring stack (Prometheus + Grafana + Loki + Jaeger + AlertManager)
  ☐ HashiCorp Vault for secrets management
  ☐ WAF (ModSecurity) on NGINX ingress
  ☐ DR cluster config with automated failover runbook

Database
  ☐ Database-first: complete schema.sql generated before any entity code
  ☐ All 9 stored procedures implemented
  ☐ All 6 materialized views with pg_cron refresh
  ☐ Partitioning on audit_logs (monthly), emrs (district), patient_activity (yearly)
  ☐ Flyway migrations V1–V9

ABDM
  ☐ M1: All 5 ABHA enrollment flows (Aadhaar OTP, mobile OTP, DL, verification, QR)
  ☐ M2: HIP bridge (discovery sync, consent handler, FHIR push, Fidelius encrypt)
  ☐ M3: HIU consent flow, data fetch, decrypt, FHIR parse → EMR pre-fill
  ☐ All 14 ABDM database tables populated
  ☐ HPR practitioner verification integrated
  ☐ HFR facility registration for all camps

Application
  ☐ 13 NestJS microservices (+ 3 ABDM services = 16 total)
  ☐ Next.js 4 portals with offline PWA for screening team
  ☐ Flutter mobile app (Android + iOS)
  ☐ AI/ML service with 7 models + MLflow
  ☐ GIS layers + PostGIS analytics
  ☐ Data warehouse + Airflow ETL + Superset dashboards

Compliance
  ☐ DPDP Act: consent recording, right to erasure, data localization
  ☐ CERT-In: incident response runbook generated
  ☐ STQC: security test evidence documentation
  ☐ OWASP Top 10: remediation checklist included in docs
  ☐ ISO 27001: audit log completeness verified
  ☐ All PII encrypted at rest (pgcrypto AES-256)
  ☐ All API responses mask PII in logs

Documentation
  ☐ Architecture diagrams (C4 model: Context, Container, Component)
  ☐ Database schema ERD
  ☐ API contracts (OpenAPI 3.1 per service)
  ☐ ABDM integration guide with sandbox test evidence
  ☐ DR failover runbook
  ☐ Security hardening guide
  ☐ Operational runbooks (deploy, rollback, scale, backup/restore)
  ☐ Performance test results (k6 load test scripts + baseline report)
```

**Generate complete source code, infrastructure, database scripts, CI/CD pipelines, monitoring stack, Grafana dashboards, documentation, integration modules, test suites, k6 performance test scripts, and operational runbooks — without any placeholders.**


---

## 34. ENTERPRISE MONITORING & OBSERVABILITY STACK

### 34.1 Monitoring Infrastructure Directory

```
infra/monitoring/
├── prometheus/
│   ├── prometheus.yml              # Global scrape config
│   ├── alerts/
│   │   ├── infrastructure.yml      # CPU, memory, disk, network
│   │   ├── kubernetes.yml          # Pod crash, node NotReady, PVC full
│   │   ├── database.yml            # PostgreSQL down, replication lag, deadlocks
│   │   ├── redis.yml               # Redis down, memory high, evictions
│   │   ├── keycloak.yml            # Login failure spike, session overflow
│   │   ├── business.yml            # SLA breach, ABDM failure, EMR queue depth
│   │   └── security.yml            # Auth failures, WAF blocks, unusual access
│   └── rules/
│       └── recording_rules.yml     # Pre-computed aggregation rules
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/            # Prometheus + Loki auto-provisioned
│   │   └── dashboards/             # All dashboard JSONs below
│   └── dashboards/
│       ├── 01_infrastructure.json
│       ├── 02_kubernetes_cluster.json
│       ├── 03_microservices_red.json
│       ├── 04_postgresql_health.json
│       ├── 05_redis_health.json
│       ├── 06_keycloak_auth.json
│       ├── 07_api_gateway.json
│       ├── 08_business_kpis.json
│       ├── 09_abdm_dashboard.json
│       ├── 10_sla_monitoring.json
│       ├── 11_vendor_dashboard.json
│       ├── 12_security_events.json
│       ├── 13_capacity_planning.json
│       └── 14_dr_status.json
├── loki/
│   └── loki-config.yaml
├── promtail/
│   └── promtail-config.yaml        # Scrape all pod logs + audit logs
├── alertmanager/
│   └── alertmanager.yml            # Routes + receivers (email/SMS/Slack/Teams)
├── exporters/
│   ├── node-exporter/              # Host CPU/memory/disk/network
│   ├── cadvisor/                   # Per-container metrics
│   ├── postgres-exporter/          # PostgreSQL metrics
│   ├── redis-exporter/             # Redis metrics
│   └── blackbox-exporter/          # HTTP uptime probes
├── opentelemetry/
│   └── otel-collector-config.yaml  # Receive OTLP → export to Jaeger + Prometheus
└── jaeger/
    └── jaeger-all-in-one.yaml      # Jaeger deployment (Cassandra backend for prod)
```

### 34.2 Prometheus Scrape Configuration

```yaml
# infra/monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: apvc-production
    region: ap-south-1

scrape_configs:
  # All NestJS microservices (prom-client metrics at /metrics)
  - job_name: microservices
    kubernetes_sd_configs:
      - role: pod
        namespaces: { names: [apvisioncare] }
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep; regex: "true"

  # PostgreSQL
  - job_name: postgresql
    static_configs:
      - targets: [postgres-exporter:9187]

  # Redis
  - job_name: redis
    static_configs:
      - targets: [redis-exporter:9121]

  # Keycloak (built-in /metrics endpoint)
  - job_name: keycloak
    static_configs:
      - targets: [keycloak:8080]
    metrics_path: /metrics

  # Kubernetes nodes
  - job_name: node-exporter
    kubernetes_sd_configs: [{ role: node }]

  # Containers
  - job_name: cadvisor
    kubernetes_sd_configs: [{ role: node }]
    metrics_path: /metrics/cadvisor

  # HTTP blackbox probes
  - job_name: blackbox
    metrics_path: /probe
    params: { module: [http_2xx] }
    static_configs:
      - targets:
          - https://apvisioncare.ap.gov.in/health
          - https://api.apvisioncare.ap.gov.in/health
          - https://auth.apvisioncare.ap.gov.in/health/live
          - https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions  # ABDM gateway probe
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - target_label: __address__
        replacement: blackbox-exporter:9115

  # ABDM custom metrics (published by abdm-service)
  - job_name: abdm-service
    static_configs:
      - targets: [abdm-service:3012]
    metrics_path: /metrics
```

### 34.3 NestJS Service Instrumentation (All 16 Services)

```typescript
// libs/shared-utils/src/telemetry/metrics.module.ts
// Install: prom-client @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node

// Standard metrics exposed on GET /metrics for every service:
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service']
})
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'service'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
})
const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Active DB + Redis connections',
  labelNames: ['type', 'service']
})

// ABDM-specific metrics (published by abdm-service):
const abhaCreationTotal = new Counter({ name: 'abha_creation_total', labelNames: ['method', 'district'] })
const abdmApiLatency = new Histogram({ name: 'abdm_api_latency_ms', labelNames: ['endpoint', 'status'] })
const consentTransactionsTotal = new Counter({ name: 'consent_transactions_total', labelNames: ['type', 'status'] })
const careContextLinksTotal = new Counter({ name: 'care_context_links_total', labelNames: ['type'] })

// Business metrics (published by screening-service):
const emrsSubmittedTotal = new Counter({ name: 'emrs_submitted_total', labelNames: ['district', 'outcome'] })
const slaBreachesTotal = new Counter({ name: 'sla_breaches_total', labelNames: ['vendor_id', 'district'] })
const slaHoursRemaining = new Gauge({ name: 'spectacle_sla_hours_remaining', labelNames: ['order_id', 'vendor_id'] })
```

### 34.4 OpenTelemetry Distributed Tracing

```typescript
// apps/web/instrumentation.ts + services/*/src/main.ts
// Instrument BEFORE app bootstrap — auto-traces HTTP, DB, Redis calls

import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    'ap.district': process.env.DISTRICT_CODE || 'statewide',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.JAEGER_OTLP_URL || 'http://jaeger:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-pg': { enhancedDatabaseReporting: true },
    '@opentelemetry/instrumentation-redis': { dbStatementSerializer: (cmd) => cmd },
    '@opentelemetry/instrumentation-http': { applyCustomAttributesOnSpan: addCustomSpanAttrs },
  })],
  // Sampling: 100% for ABDM calls, 10% for routine APIs, 100% for errors
  sampler: new ParentBasedSampler({ root: new TraceIdRatioBased(0.1) }),
})
sdk.start()
```

### 34.5 Centralized Logging (Loki + Promtail)

```yaml
# infra/monitoring/promtail/promtail-config.yaml
# Collect logs from ALL pods in apvisioncare namespace
# Apply structured label extraction:

pipeline_stages:
  - json:
      expressions:
        level: level
        service: service
        requestId: requestId
        userId: userId
        district: district
        action: action    # For audit logs
  - labels:
      level:
      service:
      district:
  - match:
      selector: '{level="audit"}'
      stages:
        - json:
            expressions: { entityType: entityType, entityId: entityId, actor: performedBy }
        - labels: { entityType:, actor: }
```

**Log sources to collect:**
- All 16 NestJS microservices — structured JSON logs via Winston
- Next.js frontend (server-side) — request logs + error traces
- Keycloak — login/logout/failure events
- PostgreSQL — `pgaudit` extension output (DDL + DML on clinical tables)
- Redis — slow log + keyspace notifications
- NGINX ingress — access log + WAF blocks
- Kubernetes events — pod crash, OOMKill, eviction events

### 34.6 Alerting Rules (Complete)

```yaml
# infra/monitoring/prometheus/alerts/infrastructure.yml
groups:
  - name: infrastructure
    rules:
      - alert: ServiceDown
        expr: up{job="microservices"} == 0
        for: 1m
        labels: { severity: critical, team: platform }
        annotations:
          summary: "Service {{ $labels.service }} is DOWN"
          runbook: "https://docs.apvisioncare.gov.in/runbooks/service-down"

      - alert: HighCPU
        expr: node_cpu_utilization_percent > 85
        for: 5m
        labels: { severity: warning }

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 15
        for: 5m
        labels: { severity: warning }

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels: { severity: critical }

  - name: database
    rules:
      - alert: PostgreSQLDown
        expr: pg_up == 0
        for: 30s
        labels: { severity: critical }

      - alert: ReplicationLag
        expr: pg_replication_lag > 60
        for: 2m
        labels: { severity: warning }

      - alert: HighConnectionCount
        expr: pg_stat_activity_count > 450
        for: 5m
        labels: { severity: warning }

      - alert: SlowQueryDetected
        expr: pg_stat_statements_mean_exec_time_ms > 5000
        for: 2m
        labels: { severity: warning }

  - name: business
    rules:
      - alert: SLABreachImminent
        expr: spectacle_sla_hours_remaining{} < 4
        for: 0m
        labels: { severity: warning, team: operations }
        annotations:
          summary: "Order {{ $labels.order_id }} SLA breach in < 4h (vendor: {{ $labels.vendor_id }})"

      - alert: ABDMGatewayDegraded
        expr: rate(abdm_api_errors_total[5m]) > 0.05
        for: 3m
        labels: { severity: critical, team: abdm }
        annotations:
          summary: "ABDM Gateway error rate elevated — ABHA operations may be failing"

      - alert: EMRQueueDepthHigh
        expr: emr_pending_approval_count > 500
        for: 30m
        labels: { severity: warning, team: clinical }

      - alert: OTPDeliveryFailure
        expr: rate(notification_sms_failure_total[5m]) > 0.1
        for: 2m
        labels: { severity: critical }
        annotations:
          summary: "SMS OTP delivery failing — patient login and ABHA enrollment impacted"

  - name: security
    rules:
      - alert: BruteForceDetected
        expr: rate(keycloak_login_failures_total[5m]) > 10
        for: 1m
        labels: { severity: critical, team: security }

      - alert: UnauthorizedAPIAccess
        expr: rate(http_requests_total{status_code="403"}[5m]) > 50
        for: 2m
        labels: { severity: warning }

      - alert: SSLCertExpiringSoon
        expr: probe_ssl_earliest_cert_expiry - time() < 86400 * 14
        for: 1h
        labels: { severity: warning }
```

### 34.7 AlertManager Routing

```yaml
# infra/monitoring/alertmanager/alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: [alertname, severity, team]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: default
  routes:
    - match: { severity: critical }
      receiver: critical-pagerduty
      continue: true
    - match: { team: abdm }
      receiver: abdm-team
    - match: { team: security }
      receiver: security-team
    - match: { team: operations }
      receiver: operations-team

receivers:
  - name: critical-pagerduty
    webhook_configs:
      - url: http://notification-service:3008/webhook/alert
        # notification-service sends: SMS to on-call, WhatsApp to SPMU, email to district IT
    slack_configs:
      - channel: '#apvc-critical'
        api_url: '{{ env "SLACK_WEBHOOK_URL" }}'
        title: '🔴 CRITICAL: {{ .GroupLabels.alertname }}'

  - name: abdm-team
    email_configs:
      - to: abdm-ops@apvisioncare.gov.in
    webhook_configs:
      - url: http://notification-service:3008/webhook/alert?channel=abdm

  - name: operations-team
    email_configs:
      - to: operations@apvisioncare.gov.in
    slack_configs:
      - channel: '#apvc-operations'

  - name: security-team
    email_configs:
      - to: security@apvisioncare.gov.in
    pagerduty_configs:
      - service_key: '{{ env "PAGERDUTY_SECURITY_KEY" }}'
```

### 34.8 Grafana Dashboard Specifications

**Dashboard: Business KPIs (`08_business_kpis.json`)**
```
Row 1 — Today's Operations
  Stat: Patients Registered Today          (emrs_submitted_total — by hour)
  Stat: EMRs Submitted Today               (counter, green/amber/red threshold)
  Stat: Spectacles Ordered Today
  Stat: Spectacles Delivered Today
  Stat: Active Camps Right Now             (gauge)
  Stat: Teleconsults Completed Today

Row 2 — SLA Health
  Table: Open Orders by SLA Risk           (RED if < 4h, AMBER if < 24h, GREEN otherwise)
  Gauge: Overall SLA Compliance %          (target: > 95%)
  Bar: SLA Breaches by Vendor (last 30d)

Row 3 — Geographic Coverage
  GeoMap: Districts coloured by coverage % (PostGIS → Grafana Geomap panel)
  Bar: Top 5 districts by screenings
  Bar: Bottom 5 districts needing attention
```

**Dashboard: ABDM (`09_abdm_dashboard.json`)**
```
Row 1 — ABHA Activity
  Counter: Total ABHA Created (lifetime)
  Counter: ABHA Created Today
  Pie: Creation Method (Aadhaar OTP / Mobile OTP / DL)
  Counter: Care Contexts Linked

Row 2 — Consent & HIE
  Counter: Consent Requests (M3, 30d)
  Pie: Consent Status (Granted/Denied/Revoked)
  Counter: FHIR Data Pushes (M2, 30d)
  Counter: FHIR Data Fetches (M3, 30d)

Row 3 — ABDM Gateway Health
  Line: ABDM API latency p95 (real-time)
  Stat: ABDM Gateway Uptime
  Bar: ABDM Error Rate by Endpoint
  Table: Last 10 ABDM Gateway Failures
```

**Dashboard: Capacity Planning (`13_capacity_planning.json`)**
```
Row 1 — Current vs Capacity
  Gauge: CPU cluster utilization %
  Gauge: Memory cluster utilization %
  Gauge: PostgreSQL connection pool %
  Gauge: Redis memory %

Row 2 — HPA Activity
  Line: Replica count over time (per service)
  Bar: Scale-up events (last 7d)
  Stat: Current node count / max node count

Row 3 — Growth Trends
  Line: Patient records growth (monthly)
  Line: API request rate (weekly trend)
  Forecast: Storage projection (next 12 months, linear extrapolation)
```

---

## 35. HORIZONTAL SCALING & ELASTIC CAPACITY

### 35.1 HPA for Every Service

```yaml
# Generate one HPA manifest per service.
# Template (apply to all 16 services with appropriate name substitution):

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ SERVICE_NAME }}-hpa
  namespace: apvisioncare
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ SERVICE_NAME }}
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 75
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60        # Scale up fast during camp peaks
      policies:
        - type: Pods; value: 4; periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300       # Scale down conservatively
      policies:
        - type: Percent; value: 25; periodSeconds: 120

# Services requiring HPAs:
# api-gateway, web, patient-service, emr-service, screening-service,
# teleconsult-service, referral-service, spectacle-service, vendor-service,
# notification-service, abdm-service, fhir-service, consent-service,
# ai-analytics-service, reporting-service, audit-service
```

### 35.2 Cluster Autoscaler

```yaml
# infra/kubernetes/cluster-autoscaler/
# Supports: GKE (gke.io/cluster-autoscaler), EKS (cluster-autoscaler), bare metal (Karpenter)

# Node pools:
# General pool:    t3.2xlarge (8 vCPU, 32GB)  min:4  max:20
# Database pool:   r6i.4xlarge (16 vCPU, 128GB, NVMe) min:2  max:4
# AI/GPU pool:     g4dn.xlarge (1x T4 GPU)  min:0  max:4  (scale-to-zero when idle)
# Monitoring pool: t3.xlarge   min:1  max:2  (no autoscale — always on)

# Karpenter provisioner (bare metal / on-prem equivalent):
apiVersion: karpenter.sh/v1alpha5
kind: Provisioner
metadata:
  name: apvc-general
spec:
  requirements:
    - key: karpenter.sh/capacity-type
      operator: In; values: [on-demand]     # Government: no spot instances
  limits:
    resources:
      cpu: "160"                            # 20 x 8 vCPU max
      memory: 640Gi
  ttlSecondsAfterEmpty: 120               # Remove idle nodes after 2 min
```

### 35.3 NGINX Ingress — Load Balancing & Rate Limiting

```yaml
# infra/kubernetes/ingress/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: apvc-ingress
  namespace: apvisioncare
  annotations:
    nginx.ingress.kubernetes.io/upstream-hash-by: "$cookie_session_id"  # Session affinity
    nginx.ingress.kubernetes.io/rate-limit: "100"                        # 100 req/s per IP
    nginx.ingress.kubernetes.io/rate-limit-burst-multiplier: "5"
    nginx.ingress.kubernetes.io/limit-connections: "20"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"                  # Fundus image upload
    nginx.ingress.kubernetes.io/enable-modsecurity: "true"              # WAF
    nginx.ingress.kubernetes.io/enable-owasp-core-rules: "true"
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.3"
    nginx.ingress.kubernetes.io/hsts: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts: [apvisioncare.ap.gov.in, api.apvisioncare.ap.gov.in, auth.apvisioncare.ap.gov.in]
      secretName: apvc-tls
  rules:
    - host: apvisioncare.ap.gov.in
      http:
        paths:
          - path: /; pathType: Prefix
            backend: { service: { name: web; port: { number: 3100 } } }
    - host: api.apvisioncare.ap.gov.in
      http:
        paths:
          - path: /; pathType: Prefix
            backend: { service: { name: api-gateway; port: { number: 3000 } } }
    - host: auth.apvisioncare.ap.gov.in
      http:
        paths:
          - path: /; pathType: Prefix
            backend: { service: { name: keycloak; port: { number: 8080 } } }
```

### 35.4 Database Scaling Architecture

```
                    ┌─────────────────────────────────┐
                    │         PgBouncer                │
                    │   (Transaction pooling, :5432)   │
                    │   maxClientConn: 2000            │
                    │   defaultPoolSize: 25            │
                    └──────────┬──────────────┬────────┘
                               │              │
                    ┌──────────▼──────┐  ┌────▼──────────────┐
                    │  Primary (R/W)  │  │  Read Replica 1   │
                    │  Writes + OLTP  │  │  Analytics queries │
                    │  Reads          │  │  Dashboard queries │
                    └──────────┬──────┘  └────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Read Replica 2    │
                    │   Reporting queries │
                    │   Export jobs       │
                    └─────────────────────┘

Streaming replication: synchronous_commit = on (primary → replica 1)
                       synchronous_commit = remote_apply (replica 2, async)
Automatic failover:    Patroni + etcd (promotes replica 1 if primary fails)
```

### 35.5 Performance Testing Framework

```
infra/performance/
├── k6/
│   ├── scenarios/
│   │   ├── 01_smoke.js            # 10 users, 1 min — baseline sanity
│   │   ├── 02_load_1000.js        # 1,000 users, 10 min
│   │   ├── 03_load_5000.js        # 5,000 users, 15 min
│   │   ├── 04_load_10000.js       # 10,000 users, 20 min
│   │   ├── 05_stress_50000.js     # 50,000 users, 10 min (stress test)
│   │   ├── 06_spike_100000.js     # 0→100,000 in 60s (camp day simulation)
│   │   └── 07_soak_24h.js         # 1,000 users, 24 hours (memory leak detection)
│   ├── shared/
│   │   ├── auth.js                # Keycloak login helper
│   │   └── thresholds.js          # SLA threshold definitions
│   └── reports/                   # k6 HTML reports + Grafana k6 dashboard
├── jmeter/
│   └── abdm_load_test.jmx         # ABDM API load test (OTP → enroll → link)
└── locust/
    └── ai_inference_load.py       # AI model inference throughput test
```

```javascript
// infra/performance/k6/scenarios/06_spike_100000.js
import http from 'k6/http'
import { thresholds } from '../shared/thresholds.js'

export const options = {
  scenarios: {
    camp_day_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      stages: [
        { duration: '60s', target: 1000 },   // Camp morning surge
        { duration: '300s', target: 1000 },  // Sustained peak
        { duration: '60s', target: 100 },    // Wind down
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],         // 95th percentile < 500ms
    http_req_failed: ['rate<0.01'],           // < 1% error rate
    'http_req_duration{endpoint:emr}': ['p(95)<800'],
    'http_req_duration{endpoint:search}': ['p(95)<2000'],
  },
}

export default function () {
  // Simulate screening team workflow:
  // 1. Authenticate (Keycloak OTP)
  // 2. Search patient by ABHA / mobile
  // 3. Submit EMR
  // 4. Check spectacle order status
}
```

---

## 36. DISASTER RECOVERY — FULL RUNBOOK

### 36.1 DR Architecture

```
PRIMARY REGION (NIC Cloud — Hyderabad)
  K8s cluster (production)
  PostgreSQL primary + 2 replicas
  Redis Sentinel cluster
  Keycloak 3-replica cluster
  All 16 microservices

DR REGION (NIC Cloud — Delhi/Mumbai)
  K8s cluster (standby — all deployments scaled to 0 normally)
  PostgreSQL streaming replica (sync lag < 15 min = RPO target)
  Redis replica
  Keycloak single replica (scales up on DR activation)
  DNS TTL: 60 seconds (for fast failover)
```

### 36.2 Backup Schedule

```yaml
# pgBackRest configuration (generate infra/backup/pgbackrest.conf)
[global]
repo1-type=s3
repo1-s3-bucket=apvc-db-backups-{{ env }}
repo1-s3-region=ap-south-1
repo1-s3-key={{ vault:secret/backup/s3-key }}
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass={{ vault:secret/backup/passphrase }}
repo1-retention-full=30          # 30 daily full backups
repo1-retention-archive=30       # 30 days WAL archives (PITR)
repo1-retention-archive-type=incr

[apvisioncare]
pg1-path=/var/lib/postgresql/data
pg1-port=5432

# Backup schedule (cron in Kubernetes CronJob):
# Full backup:      Daily at 02:00 IST
# WAL archive:      Continuous (every WAL segment = ~16MB = every few minutes)
# Backup verify:    Weekly automated restore test to DR cluster
# Monthly backup:   Retained 7 years (DPDP compliance)

# Backup monitoring:
# Alert if: last_full_backup_age > 25 hours
# Alert if: WAL archive gap > 30 minutes
# Alert if: backup size < 80% of previous (indicates data loss or truncation)
```

### 36.3 Failover Runbook (`docs/dr/failover-runbook.md` — generate this file)

```markdown
# DR Failover Runbook — AP Vision Care Platform

## Automatic Failover (Patroni)
Patroni monitors PostgreSQL primary health.
If primary unreachable for > 30 seconds:
  1. Patroni promotes replica 1 to primary
  2. Updates etcd leader key
  3. PgBouncer reconnects automatically
  4. Notification sent to ops team

## Manual DR Activation (Full Region Failover)
Trigger: Primary region NIC Cloud unavailable > 15 minutes

Step 1: Confirm outage
  ssh ops@monitoring.apvisioncare.gov.in
  kubectl --context=primary get nodes   # Should fail

Step 2: Promote DR PostgreSQL replica
  kubectl --context=dr exec -it postgres-0 -- patronictl failover --master <primary>

Step 3: Scale up DR Kubernetes workloads
  kubectl --context=dr scale deployment --all --replicas=2 -n apvisioncare

Step 4: Update DNS
  # Route53 / NIC DNS — switch A record for apvisioncare.ap.gov.in to DR load balancer IP
  # TTL is 60s — expect < 2 min for propagation globally

Step 5: Validate
  curl https://apvisioncare.ap.gov.in/health
  curl https://api.apvisioncare.ap.gov.in/health
  # Run smoke test suite

Step 6: Notify stakeholders
  # Automated: AlertManager sends email + SMS to SPMU + NHM contacts
  # Manual: Call NIC NOC + NHA ABDM team (ABDM bridge URL may need update)

## Recovery (Return to Primary)
After primary region is restored:
  1. Resync PostgreSQL: pgbackrest restore on primary from DR
  2. Re-establish streaming replication
  3. Validate data integrity (row counts + last EMR ID comparison)
  4. Switch DNS back to primary
  5. Scale DR cluster back to standby
  Estimated time: 2–4 hours
```

---

## 37. SECURITY HARDENING — COMPLETE IMPLEMENTATION

### 37.1 HashiCorp Vault Integration

```yaml
# infra/kubernetes/vault/vault-helm-values.yaml
vault:
  server:
    ha:
      enabled: true
      replicas: 3
      raft:
        enabled: true
    auditStorage:
      enabled: true
      size: 10Gi
  injector:
    enabled: true   # Vault Agent sidecar for secret injection

# Secret paths (generate all):
# secret/apvisioncare/db/patient-service       → DATABASE_URL
# secret/apvisioncare/db/emr-service           → DATABASE_URL
# secret/apvisioncare/keycloak/client-secret   → KEYCLOAK_CLIENT_SECRET
# secret/apvisioncare/abdm/credentials         → ABDM_CLIENT_ID, ABDM_CLIENT_SECRET
# secret/apvisioncare/sms/providers            → all SMS API keys
# secret/apvisioncare/fidelius/keys            → HIP/HIU ECDH key pairs
# secret/apvisioncare/backup/passphrase        → pgBackRest encryption

# Vault Agent annotation (add to every Deployment):
vault.hashicorp.com/agent-inject: "true"
vault.hashicorp.com/role: "{{ service-name }}"
vault.hashicorp.com/agent-inject-secret-db: "secret/apvisioncare/db/{{ service-name }}"
```

### 37.2 Security Scanning in CI/CD

```yaml
# .github/workflows/security-scan.yml
# Runs on every PR and every deploy to staging

jobs:
  trivy-scan:
    # Container vulnerability scanning — block if CRITICAL CVEs found
    run: trivy image --exit-code 1 --severity CRITICAL $IMAGE_TAG

  sonarqube:
    # Static code analysis — quality gate: 0 blocker issues, coverage > 70%
    run: sonar-scanner -Dsonar.qualitygate.wait=true

  owasp-zap:
    # DAST — runs against staging after every deploy
    run: zap-baseline.py -t https://staging-api.apvisioncare.gov.in -r zap-report.html
    # Block deploy to prod if any HIGH/CRITICAL findings

  secret-scan:
    # Detect secrets accidentally committed
    run: truffleHog --regex --entropy=False git file://./
```

### 37.3 Network Policies (Zero-Trust)

```yaml
# Default deny all — then whitelist only required paths
# infra/kubernetes/network-policies/default-deny.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: apvisioncare
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]

# Example whitelist: patient-service can only talk to postgres-main and api-gateway
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: patient-service-policy
spec:
  podSelector:
    matchLabels: { app: patient-service }
  ingress:
    - from:
        - podSelector: { matchLabels: { app: api-gateway } }
      ports: [{ port: 3001 }]
  egress:
    - to:
        - podSelector: { matchLabels: { app: postgres-main } }
      ports: [{ port: 5432 }]
    - to:
        - podSelector: { matchLabels: { app: redis } }
      ports: [{ port: 6379 }]
```

### 37.4 PII Protection in Logs

```typescript
// libs/shared-utils/src/logging/pii-filter.ts
// Applied as Winston transform on ALL services — never logs raw PII

const PII_PATTERNS = [
  { field: 'mobile',      replace: (v: string) => `+91XXXXXX${v.slice(-2)}` },
  { field: 'abhaNumber',  replace: (v: string) => `XXXX-XXXX-${v.slice(-4)}` },
  { field: 'aadhaar',     replace: (_: string) => '[AADHAAR_REDACTED]' },
  { field: 'email',       replace: (v: string) => `${v[0]}***@${v.split('@')[1]}` },
]

// Also: mask all request body fields named 'otp', 'password', 'token', 'secret'
// Audit logs store hashed identifiers (SHA-256) for correlation without exposing PII
```

---

## 38. PUBLIC HEALTH SURVEY MODULE

```
services/survey-service/
├── src/
│   ├── entities/
│   │   ├── Survey.ts               # Survey definition (title, type, questions JSONB)
│   │   ├── SurveyResponse.ts       # Respondent answers JSONB + location
│   │   └── SurveyAssignment.ts     # Which team covers which area
│   ├── controllers/
│   │   └── survey.controller.ts
│   └── modules/
│       └── survey.module.ts
```

**Survey Types:**

| Type | Target | Key Questions | Output |
|---|---|---|---|
| Community Survey | Village population sample | Visual complaints, last eye exam, awareness of services | Prevalence estimates |
| Household Screening | All households in mandal | Functional blindness, unmet spectacle need, diabetes status | Coverage gap map |
| School Screening | Students 6–18 | Distance vision, near vision, spectacle use | School-wise refractive error burden |
| Industrial Screening | Factory workers | Screen time, near work hours, protective eyewear use | Occupational eye health risk |
| Tribal Screening | PVTG / ST habitations | Cataract prevalence, access barriers, last treatment | Tribal blindness burden |

**Offline-capable**: All 5 survey types work offline via the screening team PWA. Results sync to server on connectivity restoration with deduplication.

---

## 39. MASTER DATA — COMPLETE SEED DATA REQUIREMENTS

```sql
-- Generate complete seed.sql with:

-- 1. Andhra Pradesh administrative hierarchy
INSERT INTO states VALUES ('AP', 'Andhra Pradesh', 'TG');
-- 13 districts with HQ cities and district codes
-- ~670 mandals with district mapping
-- ~28,000 villages with mandal mapping, population, ST/SC %, coordinates

-- 2. Healthcare facilities (from HFR public data)
-- All government hospitals, PHCs, CHCs, medical colleges in AP
-- Each with: HFR ID, coordinates, specialties, beds, ophthal_available flag

-- 3. Clinical master data
-- Disease master: 50+ eye conditions with SNOMED + ICD-10 codes
-- Medicine master: common ophthalmic drugs with RxNorm codes
-- Frame master: 20 standard government-supplied frame types
-- Lens master: 10 lens types (single vision, bifocal, progressive) with costs

-- 4. Reference data
-- AP government holidays calendar (for SLA calculation — exclude holidays)
-- State-level disease burden benchmarks (for AI model baselines)
-- District population denominators (for coverage % calculation)
```

---

## 40. UPDATED GENERATION ORDER (FINAL)

Generate the complete platform in this exact sequence:

```
Phase 1 — Foundation
  1.  Monorepo root (package.json, turbo.json, .env.example, .gitignore)
  2.  Shared libs (shared-types, shared-dtos, shared-utils + telemetry + pii-filter)
  3.  Keycloak (Dockerfile, realm-export.json, keycloak-setup.sh)

Phase 2 — Database (Database-First — ALL SQL before any application code)
  4.  schema.sql          — all tables, types, extensions, constraints, FKs
  5.  indexes.sql         — all B-tree, GIST, GIN, partial indexes
  6.  partitions.sql      — audit_logs (monthly), emrs (district), patient_activity (yearly)
  7.  views.sql           — standard SQL views
  8.  materialized_views.sql — all 6 MVs with refresh schedule comments
  9.  procedures.sql      — all 9 stored procedures
  10. functions.sql       — PL/pgSQL helper functions
  11. triggers.sql        — audit, notification, SLA breach, ABHA linkage triggers
  12. seed.sql            — master data (districts, mandals, villages, facilities, clinical masters)
  13. Flyway migrations   — V1 through V9

Phase 3 — Infrastructure
  14. docker-compose.yml  — all 19+ services (add abha, fhir, consent, monitoring, survey)
  15. All 16 service Dockerfiles

Phase 4 — Backend Services (entities generated FROM database schema)
  16. API Gateway
  17. patient-service
  18. emr-service
  19. screening-service
  20. teleconsult-service
  21. referral-service
  22. spectacle-service
  23. vendor-service
  24. notification-service
  25. ai-analytics-service
  26. reporting-service
  27. audit-service
  28. abdm-service         (M1 + M2 + M3 — see Section 15)
  29. fhir-service         (FHIR R4 resource management)
  30. consent-service      (consent lifecycle state machine)
  31. survey-service       (public health surveys)

Phase 5 — Frontend
  32. Next.js web app      (4 portals + offline PWA + ABHA enrollment UI)
  33. Flutter mobile app   (Android + iOS)

Phase 6 — Infrastructure as Code
  34. Kubernetes manifests (all 19 deployments + services + ingress + HPAs)
  35. Helm chart
  36. HashiCorp Vault config
  37. Network policies
  38. Cluster autoscaler

Phase 7 — Monitoring Stack
  39. Prometheus config + all alert rules
  40. Grafana dashboards (all 14 JSON files)
  41. Loki + Promtail config
  42. AlertManager routing + receivers
  43. OpenTelemetry collector config
  44. Jaeger deployment

Phase 8 — Data & Analytics
  45. Airflow DAGs (ETL daily, monthly, ML retrain, ABDM stats)
  46. Superset dashboard configs
  47. Analytics DB star schema

Phase 9 — CI/CD & Testing
  48. GitHub Actions workflows (CI, deploy-staging, deploy-prod, security-scan)
  49. k6 load test scenarios (all 7 scenarios)
  50. Smoke test suite

Phase 10 — Documentation
  51. C4 architecture diagrams (Context, Container, Component — Mermaid)
  52. Database ERD (Mermaid)
  53. ABDM integration guide
  54. DR failover runbook
  55. Security hardening guide
  56. Operational runbooks (deploy, rollback, scale, backup/restore, incident response)
  57. STQC audit readiness checklist
  58. Performance baseline report template
```

---

## FINAL OUTPUT REQUIREMENTS

```
Every generated file must:
  ☐ Begin with full file path as comment header
  ☐ Include all import statements — no implicit dependencies
  ☐ Zero placeholder comments (no // TODO, // implement this, // add logic here)
  ☐ Every API endpoint: fully implemented with validation + error handling + Swagger decorators
  ☐ Every Docker service: healthcheck defined
  ☐ Every K8s Deployment: livenessProbe + readinessProbe + resource limits + HPA
  ☐ All secrets: from environment variables or Vault — never hardcoded
  ☐ All PII: encrypted at rest (pgcrypto) + masked in logs (PII filter)
  ☐ All ABDM calls: use V3 APIs only — V0.5 and V1.0 are rejected
  ☐ All FHIR bundles: validated against NRCeS India profiles before push
  ☐ All SQL: database-first — entities generated FROM schema, never the reverse
  ☐ TypeORM synchronize: false in all environments
  ☐ All materialized views: refresh scheduled via pg_cron
  ☐ All services: OpenTelemetry instrumented + prom-client metrics on /metrics
  ☐ Grafana dashboards: provisioned automatically (no manual import)
  ☐ AlertManager: all critical alerts route to SMS + email + Slack
  ☐ k6 performance tests: all 7 scenarios pass SLA thresholds before prod deploy
  ☐ DR runbook: complete step-by-step with commands (no narrative-only sections)
```

**Generate the complete AP Vision Care platform — 57 documentation files, 16 microservices, 4 frontend portals, 1 Flutter app, full Kubernetes cluster, complete monitoring stack, database-first PostgreSQL with all stored procedures/views/triggers, ABDM M1/M2/M3 V3 integration, and all operational runbooks — entirely without placeholders.**
