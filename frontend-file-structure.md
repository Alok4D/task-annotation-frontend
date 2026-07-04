taskfusion-frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       └── error.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   │
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   │
│   │   │   ├── annotate/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   │
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── Board.tsx
│   │   │   ├── Column.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── DeleteTaskDialog.tsx
│   │   │   ├── DateSelector.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── Tag.tsx
│   │   │
│   │   └── annotation/
│   │       ├── Canvas.tsx
│   │       ├── Polygon.tsx
│   │       ├── ImageSlider.tsx
│   │       ├── Toolbar.tsx
│   │       ├── UploadBox.tsx
│   │       ├── AnnotationSidebar.tsx
│   │       └── PolygonItem.tsx
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── authApi.ts
│   │   │   ├── authSlice.ts
│   │   │   └── authTypes.ts
│   │   │
│   │   ├── tasks/
│   │   │   ├── taskApi.ts
│   │   │   ├── taskSlice.ts
│   │   │   └── taskTypes.ts
│   │   │
│   │   └── annotations/
│   │       ├── annotationApi.ts
│   │       ├── annotationSlice.ts
│   │       └── annotationTypes.ts
│   │
│   ├── services/
│   │   └── baseApi.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   └── provider.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useModal.ts
│   │   └── useOutsideClick.ts
│   │
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── formatDate.ts
│   │   ├── storage.ts
│   │   └── validators.ts
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── constants/
│   │   ├── api.ts
│   │   ├── routes.ts
│   │   ├── priority.ts
│   │   └── queryKeys.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── task.ts
│   │   ├── annotation.ts
│   │   └── common.ts
│   │
│   ├── providers/
│   │   ├── ReduxProvider.tsx
│   │   └── ThemeProvider.tsx
│   │
│   └── middleware.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── eslint.config.mjs
└── postcss.config.mjs