import React from "react";

type MainContainerProps = {
  children: React.ReactNode;
};

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.627 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconProperty = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1V9.75z" />
  </svg>
);

const IconDispute = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a7 7 0 11-14 0 7 7 0 0114 0zM12 8v4" />
  </svg>
);

const IconPayout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4m0-8c2.21 0 4 1.79 4 4m-4-8v2m0 12v2m-6-6H4m16 0h-2" />
  </svg>
);

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a2 2 0 012-2h12a2 2 0 012 2v1.5H6a2 2 0 00-2 2V7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10.5A2 2 0 016 8.5h14v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
    <circle cx="16.5" cy="12" r="1" fill="currentColor" />
  </svg>
);

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : null;
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const navClass = (path: string) => {
    const active = currentPath === path || currentPath.startsWith(path);
    return `flex items-center gap-3 px-3 py-2 rounded ${active ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <a href="/profile" className="flex items-center gap-3">
            <div className="rounded-full bg-red-600 text-white w-10 h-10 flex items-center justify-center font-semibold">
              {userName ? userName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{userName || "Admin"}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </a>
        </div>

        <nav className="p-4 space-y-2">
          <a href="/users" className={navClass("/users")}>
            <IconUser />
            <span className="text-sm font-medium">User</span>
          </a>

          <a href="/properties" className={navClass("/properties")}>
            <IconProperty />
            <span className="text-sm font-medium">Property</span>
          </a>

          <a href="/disputes" className={navClass("/disputes")}>
            <IconDispute />
            <span className="text-sm font-medium">Disputes</span>
          </a>

          <a href="/payouts" className={navClass("/payouts")}>
            <IconPayout />
            <span className="text-sm font-medium">Payouts</span>
          </a>

          <a href="/wallet" className={navClass("/wallet")}>
            <IconWallet />
            <span className="text-sm font-medium">Wallet</span>
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </header>

        <section>
          {children}
        </section>
      </main>
    </div>
  );
};

export default MainContainer;
