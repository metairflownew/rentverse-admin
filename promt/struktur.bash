src/
├── core/                       # Shared logic (Axios, Base Types)
│   └── http-client.ts          # Setup Axios instance
│
├── features/                   # FOLDER UTAMA
│   ├── auth/                   # Feature 1: Login & Identitas
│   │   ├── domain/             # Entities & Interfaces Auth
│   │   │   ├── user.entity.ts
│   │   │   └── auth.repository.ts
│   │   ├── data/               # API Call Auth
│   │   │   └── auth.repository.impl.ts
│   │   └── presentation/       # UI Login
│   │       ├── hooks/
│   │       └── components/
│   │
│   └── approval/               # Feature 2: Admin Approval
│       ├── domain/             # Entities & Interfaces Approval
│       │   ├── candidate.entity.ts   # User yang belum diapprove
│       │   └── approval.repository.ts
│       ├── data/               # API Call Approval
│       │   └── approval.repository.impl.ts
│       └── presentation/       # UI Admin Dashboard
│           ├── hooks/
│           ├── components/
│           └── ApprovalPage.tsx
│
└── App.tsx                     # Routing antar feature