# আমাদের গল্প (Amader Golpo)

বাংলা গল্প, কবিতা ও সাহিত্যের প্রিমিয়াম ফুল-স্ট্যাক ওয়েব প্ল্যাটফর্ম।

## টেক স্ট্যাক

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion
- **UI:** shadcn/ui (Radix), Lucide Icons, Hind Siliguri ফন্ট
- **Backend:** Next.js Server Actions, NextAuth v5
- **Database:** Supabase PostgreSQL + Prisma ORM
- **Storage:** Supabase Storage (ছবি আপলোড)
- **Editor:** TipTap Rich Text Editor
- **Validation:** Zod

## বৈশিষ্ট্য

- ব্যবহারকারী নিবন্ধন ও লগইন (Credentials + optional Google OAuth)
- Admin ও User ভূমিকা
- গল্প লেখা, খসড়া, প্রকাশ, সম্পাদনা, মুছে ফেলা
- মন্তব্য (নেস্টেড রিপ্লাই)
- লাইক ও বুকমার্ক
- অনুসন্ধান ও ফিল্টার
- অ্যাডমিন প্যানেল
- ডার্ক/লাইট মোড
- বাংলা তারিখ ও সংখ্যা ফরম্যাট

## ইনস্টলেশন

### ১. প্রয়োজনীয় সফটওয়্যার

- Node.js 20+
- npm
- Supabase অ্যাকাউন্ট

### ২. প্রজেক্ট সেটআপ

```bash
cd "amader golpo cursor"
npm install
cp .env.example .env
```

### ৩. Supabase সেটআপ

1. [supabase.com](https://supabase.com) এ নতুন প্রজেক্ট তৈরি করুন
2. **Database → Connection string** থেকে:
   - `DATABASE_URL` = Transaction pooler (port 6543, `?pgbouncer=true`)
   - `DIRECT_URL` = Session pooler (port 5432)
3. **Settings → API** থেকে:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Storage** এ `uploads` বাকেট তৈরি করুন (Public)
5. Storage Policy যোগ করুন:

```sql
-- Authenticated users can upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- Public read
CREATE POLICY "Public read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'uploads');
```

### ৪. Environment Variables

`.env` ফাইলে সেট করুন:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
AUTH_SECRET=  # openssl rand -base64 32
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### ৫. ডাটাবেস মাইগ্রেশন

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

**বিদ্যমান ডাটাবেসে username যোগ করতে** (আগে থেকে users টেবিল থাকলে):

```bash
npx prisma db push
npm run db:seed
```

অথবা Supabase SQL Editor এ `prisma/migrate-username.sql` চালান।

### ৬. ডেভেলপমেন্ট সার্ভার

```bash
npm run dev
```

ব্রাউজারে খুলুন: [http://localhost:3000](http://localhost:3000)

**ডিফল্ট অ্যাডমিন (সিড পর):**
- ইমেইল: `admin@amadergolpo.com`
- পাসওয়ার্ড: `admin123456`

## Vercel এ ডিপ্লয়

1. GitHub এ রিপোজিটরি পush করুন
2. [vercel.com](https://vercel.com) এ Import করুন
3. Environment Variables যোগ করুন (`.env.example` অনুযায়ী)
4. Build Command: `npm run build`
5. Deploy করুন

**মহत्वপূর্ণ:** Vercel এ `AUTH_URL` আপনার প্রোডাকশন URL সেট করুন।

## প্রজেক্ট স্ট্রাকচার

```
src/
├── app/                    # Next.js App Router পেজ
│   ├── (auth)/             # লগইন, নিবন্ধন
│   ├── admin/              # অ্যাডমিন প্যানেল
│   ├── categories/         # বিভাগ
│   ├── create/             # নতুন গল্প
│   ├── dashboard/          # ব্যবহারকারী ড্যাশবোর্ড
│   ├── edit/[id]/          # গল্প সম্পাদনা
│   ├── profile/            # প্রোফাইল
│   ├── search/             # অনুসন্ধান
│   └── story/[slug]/       # গল্প বিস্তারিত
├── actions/                # Server Actions
├── components/             # React কম্পোনেন্ট
├── lib/                    # ইউটিলিটি, DB, queries
└── auth.ts                 # NextAuth কনফিগ
prisma/
├── schema.prisma           # ডাটাবেস স্কিমা
└── seed.ts                 # সিড ডেটা
```

## স্ক্রিপ্ট

| কমান্ড | বিবরণ |
|--------|--------|
| `npm run dev` | ডেভ সার্ভার |
| `npm run build` | প্রোডাকশন বিল্ড |
| `npm run db:push` | স্কিমা সিঙ্ক |
| `npm run db:migrate` | মাইগ্রেশন |
| `npm run db:seed` | সিড ডেটা |
| `npm run db:studio` | Prisma Studio |

## লাইসেন্স

MIT
