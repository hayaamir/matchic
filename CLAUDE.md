# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (Next.js + Turbopack)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Prisma migrations
npx prisma migrate dev
npx prisma studio
```

There are no test commands configured in this project.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19**
- **Prisma** — ORM + PostgreSQL database
- **NextAuth v5** — authentication (Credentials provider, JWT strategy)
- **next-intl** — i18n (Hebrew `he` default, English `en`)
- **Tailwind CSS 4** + Shadcn-style UI components in `components/ui/`
- **React Hook Form** + **Zod** — form validation
- **Radix UI** primitives

## Architecture

### Frontend → Backend Flow

Data access goes through Server Actions and DAL functions:
- `lib/actions/[domain].actions.ts` — Server Actions (form submissions, mutations)
- `lib/dal/[domain]/[action].dal.ts` — Data Access Layer (raw Prisma queries)
- Pages are `async` and call DAL functions directly for initial data

### Authentication

- **`auth.ts`** — NextAuth config with Credentials provider + PrismaAdapter
- **`auth.config.ts`** — Edge-safe config (no Prisma) used in middleware
- **`middleware.ts`** — NextAuth + next-intl combined middleware; all routes are protected by default
- In Server Actions: `const session = await auth(); if (!session?.user?.id) return { error: "..." }`

### Routing

All pages live under `app/[locale]/` for i18n. Locales: `he` (default, RTL) and `en`.

### Data Model (prisma/schema.prisma)

| Model | Key Fields |
|---|---|
| `User` | `email` (unique), `password`, `firstName`, `lastName` |
| `Candidate` | `firstName`, `lastName`, `gender`, `idNumber` (unique), `sector`, `status` |
| `CandidateImage` | `candidateId`, `url`, `format` |
| `UserCandidate` | Junction: `userId` ↔ `candidateId` |

### Validation

Two parallel validation layers:
1. **Frontend**: Zod schemas in `lib/schema.ts` used with React Hook Form (`zodResolver`)
2. **Backend**: Zod `safeParse` inside Server Actions before DAL calls

Keep both in sync when changing data shapes.

## Environment Variables

Required in `.env.local`:
```
NEXTAUTH_SECRET=
DATABASE_URL=
AUTH_SECRET=
```

---

## Coding Style

> This section documents the author's consistent patterns. When writing new code, match these exactly.
> Lines marked **[?]** are uncertain — the author should verify.

---

### 1. Function Definitions

**Components** → always `export const` arrow functions:
```typescript
export const GenderFilter = () => {
  return <div>...</div>;
};
```

**DAL functions** → `export async function` (named, not arrow):
```typescript
export async function getCandidates(userId: string, { gender, limit, cursor }: { ... }) {
  return prisma.userCandidate.findMany({ ... });
}
```

**Server Actions** → `export const` async arrow:
```typescript
export const createCandidateAction = async (prevState: unknown, formData: FormData) => {
  // ...
};
```

**Pages / Layouts** → `const` arrow + separate `export default` (never inline `export default function`):
```typescript
const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  // ...
};
export default Home;
```

**Utilities** → `export const` arrow everywhere. Exception: `lib/utils.ts` uses `export function cn(...)` — this is shadcn's generated file, never touch it.

**Rule**: Never mix — DAL is always named async function, actions always arrow async, components/pages always `const` arrow.

---

### 2. Type Definitions

**Always `type`, never `interface`** (except `.d.ts` module augmentation):
```typescript
// Correct
export type SelectOption = {
  value: string;
  label: string;
};

// Wrong — don't use interface
export interface SelectOption { ... }
```

**Exception** — only `interface` inside `declare module` augmentations:
```typescript
declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}
```

**Zod-derived types** — always use `z.infer`:
```typescript
export type Gender = z.infer<typeof zGender>;
export type CandidateFormValues = z.infer<typeof candidateFormSchema>;
```

**Props types** — inline `type`, named `[Component]Props`:
```typescript
type CandidateCardProps = {
  fullName: string;
  status: CandidateStatus;
  createdAt: number;
  img?: string;
};
```

---

### 3. DAL File Structure

Location: `lib/dal/[domain]/[verb][Entity].dal.ts`

```typescript
import "server-only";                         // always first
import { prisma } from "@/lib/prisma";        // always @/ alias
import type { Candidate } from "@prisma/client"; // type imports after value imports

export async function createCandidate(userId: string, data: { ... }) {
  const existing = await prisma.candidate.findUnique({ where: { idNumber: data.idNumber } });
  if (existing) throw new Error("CANDIDATE_ALREADY_EXISTS");  // SCREAMING_SNAKE_CASE code

  return prisma.candidate.create({ data: { ...data, userCandidates: { create: { userId } } } });
}
```

**Rules:**
- `import "server-only"` is always the first line
- Throw errors with string codes in `SCREAMING_SNAKE_CASE`: `throw new Error("SOME_ERROR_CODE")`
- Return Prisma results directly — no wrapper objects
- Inline parameter object types, not separate `type Params = { ... }`
- No try/catch inside DAL — let errors bubble to the action

---

### 4. Server Action File Structure

Location: `lib/actions/[domain].actions.ts`

```typescript
"use server";                                  // always first line
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createCandidate } from "@/lib/dal/candidates/createCandidate.dal";

const createSchema = z.object({ ... });       // inline schema, not imported from lib/schema.ts

export const createCandidateAction = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "לא מורשה" };   // auth check always first

  const validated = createSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  try {
    const candidate = await createCandidate(session.user.id, validated.data);
    revalidatePath("/candidates");
    return { success: true, id: candidate.id };
  } catch (e) {
    if (e instanceof Error && e.message === "CANDIDATE_ALREADY_EXISTS") {
      return { error: { idNumber: ["מועמד עם תעודת זהות זו כבר קיים"] } };
    }
    return { error: "שגיאת שרת" };
  }
};
```

**Rules:**
- `"use server"` is always the first line
- Auth check before everything else, return early if not authenticated
- Validate with `safeParse`, never `parse`
- Catch DAL errors by checking `e instanceof Error && e.message === "CODE"`
- Return shapes: `{ error: string }`, `{ error: { field: string[] } }`, `{ success: true, ...data }`
- Call `revalidatePath()` after successful mutations
- Function suffix: always `Action` (e.g., `createCandidateAction`)

---

### 5. Error Handling

**DAL** — throws with string codes, no try/catch:
```typescript
if (existing) throw new Error("CANDIDATE_ALREADY_EXISTS");
```

**Actions** — catches and maps to user-facing messages:
```typescript
} catch (e) {
  if (e instanceof Error && e.message === "CANDIDATE_ALREADY_EXISTS") {
    return { error: { idNumber: ["מועמד עם תעודת זהות זו כבר קיים"] } };
  }
  return { error: "שגיאת שרת" };
}
```

**Zod validation** — always `safeParse`, return field errors:
```typescript
const validated = schema.safeParse(Object.fromEntries(formData));
if (!validated.success) return { error: validated.error.flatten().fieldErrors };
```

**Auth guard** — early return, not exception:
```typescript
if (!session?.user?.id) return { error: "לא מורשה" };
```

---

### 6. Naming Conventions

**Files:**
| Type | Pattern | Example |
|---|---|---|
| Component | `PascalCase.tsx` | `CandidateCard.tsx` |
| Page/Layout | `page.tsx` / `layout.tsx` | Next.js convention |
| DAL | `camelCase.dal.ts` | `getCandidates.dal.ts` |
| Action | `domain.actions.ts` | `candidates.actions.ts` |
| Schema | `schema.ts` | `lib/schema.ts` |
| Types | `types.ts` | `components/CandidateForm/types.ts` |
| Barrel | `index.ts` | `components/form-fields/index.ts` |
| Utility | `camelCase.ts` | `zodUnionToOptions.ts` |

**Identifiers:**
| Type | Pattern | Example |
|---|---|---|
| Component | `PascalCase` | `GenderFilter`, `CandidateCard` |
| Function / variable | `camelCase` | `getCandidates`, `userId` |
| Server Action | `camelCaseAction` | `createCandidateAction` |
| Zod enum schema | `z` + `PascalCase` | `zGender`, `zCandidateStatus` |
| Zod table schema | `z` + `EntityName` + `Table` | `zCandidatesTable` |
| Form schema | `entity` + `FormSchema` | `candidateFormSchema` |
| Props type | `ComponentName` + `Props` | `CandidateCardProps` |

---

### 7. Imports

**Order:**
```typescript
// 1. Directives (must be first line, no imports above)
"use server"
// or
"use client"

// 2. React / Next.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// 3. External libraries
import { z } from "zod";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";

// 4. Internal — absolute @/ imports
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCandidate } from "@/lib/dal/candidates/createCandidate.dal";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

// 5. Relative — same-directory imports
import { BasicDetails } from "./BasicDetails";
```

**Rules:**
- Always use `@/` alias — never `../../` relative paths for cross-directory imports
- Relative `./` only for same-directory imports (e.g., sub-components)
- Blank line between each group
- `import type` for type-only imports from external packages

---

### 8. Barrel Files (index.ts)

Used in `components/form-fields/` and `components/CandidateForm/`. Pattern:
```typescript
export { InputFormField } from "./InputFormField";
export { SelectFormField } from "./SelectFormField";
// export { TextareaFormField } from "./TextareaFormField";  // disabled, not deleted
```

**Rules:**
- Named exports only, no default re-exports
- Comment out unused exports instead of deleting them
- Cross-directory re-exports are allowed (e.g., `export { ImageUpload } from "../ui/Imageupload"`)

---

### 9. Zod Schema Patterns

**Shared enums** in `lib/schema.ts` — use `z.union` of `z.literal`, not `z.enum`:
```typescript
// Correct
export const zGender = z.union([z.literal("male"), z.literal("female")]);

// Wrong — don't use z.enum for shared types
export const zGender = z.enum(["male", "female"]);
```

**Table schemas** in `lib/schema.ts` — describe the full DB shape:
```typescript
export const zCandidatesTable = z.object({
  firstName: z.string().min(2, "at least 2 min"),
  gender: zGender,
  idNumber: z.string().length(9).regex(/^\d+$/, { message: "ID number must contain exactly 9 digits" }),
  // ...
});
```

**Form schemas** in component `types.ts` — derive from table schemas using `.pick()` / `.extend()`:
```typescript
export const candidateFormSchema = zCandidatesTable
  .pick({ firstName: true, lastName: true, gender: true, idNumber: true, phone: true, dateOfBirth: true })
  .extend({ sector: zSector.optional(), status: zCandidateStatus.optional() });

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;
```

**Action-local schemas** — inline inside the action file, same `z.union([z.literal(...)])` style:
```typescript
const createSchema = z.object({
  firstName: z.string().min(2, "שדה חובה"),
  gender: z.union([z.literal("male"), z.literal("female")]),
  // ...
});
```

**`z.enum` is never used in TypeScript code.** It appears only in `prisma/schema.prisma` (which is not TypeScript). In all `.ts` / `.tsx` files — `lib/schema.ts`, action files, component types — use exclusively `z.union([z.literal(...)])`.

---

### 10. React Component Patterns

**Standard component:**
```typescript
"use client";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  return <header>{title}</header>;
};
```

**Generic form field:**
```typescript
export const InputFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: InputFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

**useActionState for server actions:**
```typescript
const [state, dispatch, isPending] = useActionState(createCandidateAction, null);
```

---

### What Looks Like My Code vs. Claude's Code

**Confirmed patterns:**
- `lib/dal/` structure: one file per operation, `export async function`, `"server-only"`, throw string codes
- `lib/actions/`: `"use server"`, early auth return, `safeParse`, catch by error code
- Component/page arrow functions: `const X = () => {}` + separate `export default X` for pages
- Zod: `z.union([z.literal(...)])` everywhere in TypeScript — `z.enum` only in Prisma schema file
- `type` over `interface` everywhere (except `.d.ts` augmentation)
- `@/` alias exclusively
- `export function cn(...)` in `lib/utils.ts` — intentional shadcn convention, don't touch

**Known bugs in the codebase to fix when encountered:**
- `export default function Login()` in `app/[locale]/login.tsx` — should be `const Login = () => {}; export default Login`
- `const questionnaire = () => {}` — component name must be PascalCase: `const Questionnaire`
- Any `z.enum(...)` in `.ts`/`.tsx` files — replace with `z.union([z.literal(...)])`
