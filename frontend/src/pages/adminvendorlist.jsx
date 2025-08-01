import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminVendorList() {
  const [vendors, setVendors] = useState([]); // initialize as empty array

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/vendors/pending", { withCredentials: true });
        console.log("Vendor API response:", res.data);

      
        if (Array.isArray(res.data)) {
          setVendors(res.data);
        } else if (res.data.vendors && Array.isArray(res.data.vendors)) {
          setVendors(res.data.vendors);
        } else {
          // Fallback to empty array if data shape unexpected
          setVendors([]);
          console.warn("Vendors data not in expected format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setVendors([]); // reset vendors on error to avoid issues
      }
    }
    fetchVendors();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const endpoint = status === "approved"
        ? `http://localhost:5000/api/admin/vendors/${id}/approve`
        : `http://localhost:5000/api/admin/vendors/${id}/reject`;
  
      await axios.put(endpoint, {}, { withCredentials: true });
  
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status } : v))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vendor Approvals</h2>
      {vendors.length === 0 ? (
        <p>No vendors found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id}>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.status}</td>
                <td>
                  <button
                    className="bg-green-500 text-white px-2 py-1 mr-2"
                    onClick={() => updateStatus(vendor._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => updateStatus(vendor._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
