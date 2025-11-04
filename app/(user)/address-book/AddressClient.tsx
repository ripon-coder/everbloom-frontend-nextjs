"use client";

import { useState, useEffect } from "react";
import { MapPin, Trash } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  id: number;
  name: string;
  phone: string;
  zone: string;
  address: string;
  district_id: number;
  district: string;
  type: string;
}

interface District {
  id: number;
  name: string;
  delivery_charge: number;
  information?: string | null;
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setsaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<null | Address>(null);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    zone: "",
    address: "",
    district_id: "",
    type: "",
  });

  // Fetch address list
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/address-book");
        const data = await res.json();

        if (!res.ok || !data.status) {
          setError(data.message || "Failed to fetch addresses");
        } else {
          const mapped: Address[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            phone: item.phone_number,
            zone: item.zone,
            address: item.address,
            district_id: item.district?.id,
            district: item.district?.name || "",
            type: item.type_address,
          }));
          setAddresses(mapped);
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Fetch district list
  useEffect(() => {
    const fetchDistricts = async () => {
      setDistrictLoading(true);
      try {
        const res = await fetch("/api/district-list");
        const data = await res.json();
        if (res.ok && data) {
          setDistricts(data);
        } else {
          console.error("Failed to load districts");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setDistrictLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  // ✅ Save new address
  const addAddress = async () => {
    const { name, phone, zone, address, district_id, type } = newAddress;
    if (!name || !phone || !zone || !address || !district_id || !type) {
      toast.error("Please fill in all fields");
      return;
    }
    setsaveLoading(true);
    try {
      const payload = {
        name,
        phone_number: phone,
        district_id,
        zone,
        address,
        type_address: type,
      };

      const res = await fetch("/api/address-book/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status == 422) {
        setNewAddress((prev) => ({
          ...prev,
          name: "",
          phone: "",
          zone: "",
        }));

        setValidationErrors(data.errors);
        setsaveLoading(false);
        return;
      }

      if (!res.ok) {
        toast.error(data.message || "Failed to save address");
        setsaveLoading(false);
        return;
      }

      const district = districts.find((d) => d.id === Number(district_id));

      const newAddr: Address = {
        id: data.data?.id || addresses.length + 1,
        name,
        phone,
        zone,
        address,
        district_id: Number(district_id),
        district: district?.name || "",
        type,
      };

      setAddresses([newAddr, ...addresses]);
      setNewAddress({
        name: "",
        phone: "",
        zone: "",
        address: "",
        district_id: "",
        type: "",
      });
      setsaveLoading(false);
      setShowModal(false);
    } catch (error) {
      setsaveLoading(false);
      toast.error("Something went wrong while saving address");
    }
  };

  // ✅ Delete address
  const confirmDeleteAddress = async () => {
    if (!deleteConfirm) return;
    setDeleteConfirm(null);
    try {
      const res = await fetch("/api/address-book/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_id: deleteConfirm.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        toast.error(data.message || "Failed to delete address");
      } else {
        setAddresses(addresses.filter((a) => a.id !== deleteConfirm.id));
      }
    } catch (err) {
      toast.error("Something went wrong while deleting");
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white border border-amber-600 p-4 rounded-md animate-pulse flex justify-between items-center">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-3/5 bg-gray-300 rounded"></div>
        <div className="h-3 w-2/5 bg-gray-300 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
        <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-5 w-16 bg-gray-400 rounded mt-2"></div>
      </div>
      <div className="h-6 w-16 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Address Book
        </h1>
        {addresses.length >= 3 && (
          <div className="flex justify-center bg-amber-50 border border-amber-200 rounded-md mb-3">
            <p className="text-sm text-amber-700 px-4 py-2 flex items-center gap-2 text-center">
              ⚠️ You can only save up to 3 addresses in your address book.
              Please delete one before adding a new address.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-amber-400 rounded-md text-center">
            <MapPin className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              No addresses found
            </h2>
            <p className="text-gray-500 mb-4">
              You haven’t added any addresses yet.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition"
            >
              Add New Address
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-amber-600 p-4 rounded-md flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">Name: {addr.name}</p>
                  <p className="text-gray-500 text-sm">Phone: {addr.phone}</p>
                  <p className="text-gray-500 text-sm">
                    Address: {addr.address}
                  </p>
                  <p className="text-gray-500 text-sm">Zone: {addr.zone}</p>
                  <p className="text-gray-500 text-sm">
                    District: {addr.district}
                  </p>
                  <div className="mt-2 inline-block">
                    <span className="text-white text-sm bg-amber-600 px-2 py-1 rounded-sm">
                      {addr.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirm(addr)}
                  className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-50 transition"
                >
                  <Trash className="cursor-pointer hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-6">
            {addresses.length < 3 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition"
              >
                Add New Address
              </button>
            )}
          </div>
        )}

        {/* Add Address Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add New Address
              </h2>

              {/* Loop through all fields in validationErrors */}
              {Object.entries(validationErrors).map(([field, messages]) => (
                <div key={field}>
                  {messages.map((msg, i) => (
                    <p key={i} className="text-red-500 text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              ))}

              {["name", "phone", "zone", "address"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newAddress[field as keyof typeof newAddress]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ))}

              {/* District Dropdown */}
              <select
                value={newAddress.district_id}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, district_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select District</option>
                {districtLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))
                )}
              </select>

              {/* Type Select */}
              <select
                value={newAddress.type}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Location Type</option>
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addAddress}
                  className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Delete
              </h2>
              <p>Are you sure you want to delete this address?</p>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAddress}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
