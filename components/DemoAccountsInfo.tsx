import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";

export default function DemoAccountsInfo() {
  return (
    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-amber-600"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 8v4M12 16.5v.01"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-semibold text-amber-900">Demo Accounts Available</p>
      </div>
      <div className="space-y-2 text-sm text-amber-800">
        {Object.entries(DEMO_ACCOUNTS).map(([key, account]) => (
          <div key={key} className="rounded bg-white p-2">
            <p className="font-medium">
              {account.role}
            </p>
            <p className="text-xs text-amber-700">
              Username: <span className="font-mono font-semibold">{account.username}</span>
              {" | "}
              Password: <span className="font-mono font-semibold">{account.password}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
