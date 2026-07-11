const stats = [
  { label: "Doanh thu thang nay", value: "-" },
  { label: "So sach", value: "-" },
  { label: "So nguoi dung", value: "-" },
  { label: "So librarian", value: "-" },
];

export default function Overall() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800">Tong quan</h1>
      <p className="mt-1 text-sm text-gray-500">
        Tinh trang thu vien tinh den hom nay
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-800">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
