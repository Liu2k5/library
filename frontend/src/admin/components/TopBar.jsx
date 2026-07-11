export default function TopBar({ user, onLogout }) {
  // Lay chu cai dau cua ten de hien avatar, vi du "Tuan Nguyen" -> "TN"
  const initials = (user?.fullName || "?")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    // flex + justify-between: chao ben trai, avatar+logout ben phai
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <h2 className="text-lg font-semibold text-gray-800">
        Hello, Admin {user?.fullName || "..."}
      </h2>

      <div className="flex items-center gap-3">
        {/* avatar tron, mau xanh dong bo voi sidebar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
          {initials}
        </div>
        <button
          onClick={onLogout}
          className="rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
        >
          Dang xuat
        </button>
      </div>
    </header>
  );
}
