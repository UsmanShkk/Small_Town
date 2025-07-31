export default function AdminDashboard() {
  return (
    <>
      <h3 className="text-2xl font-semibold mb-4">Welcome to Admin Panel</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">Users: 100</div>
        <div className="p-6 bg-white shadow rounded-lg">Vendors: 25</div>
        <div className="p-6 bg-white shadow rounded-lg">Orders: 300</div>
      </div>
    </>
  );
}
