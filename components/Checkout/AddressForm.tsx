"use client";
import { Address, District } from "@/hooks/useCheckout";

interface Props {
  addressForm: any;
  setAddressForm: (data: any) => void;
  addressErrors: any;
  setAddressErrors: (data: any) => void;
  districts: District[];
  districtLoading: boolean;
}

export default function AddressForm({
  addressForm,
  setAddressForm,
  addressErrors,
  setAddressErrors,
  districts,
  districtLoading,
}: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Name"
        value={addressForm.name}
        onChange={(e) => {
          setAddressForm({ ...addressForm, name: e.target.value });
          setAddressErrors({ ...addressErrors, name: "" });
        }}
        className={`border p-3 rounded w-full ${
          addressErrors.name ? "border-red-500" : "border-gray-300"
        }`}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={addressForm.phone}
        onChange={(e) => {
          setAddressForm({ ...addressForm, phone: e.target.value });
          setAddressErrors({ ...addressErrors, phone: "" });
        }}
        className={`border p-3 rounded w-full ${
          addressErrors.phone ? "border-red-500" : "border-gray-300"
        }`}
      />
      <textarea
        placeholder="Address"
        value={addressForm.address}
        onChange={(e) => {
          setAddressForm({ ...addressForm, address: e.target.value });
          setAddressErrors({ ...addressErrors, address: "" });
        }}
        className="border p-3 rounded w-full"
        rows={3}
      />
      <input
        type="text"
        placeholder="Zone"
        value={addressForm.zone}
        onChange={(e) => {
          setAddressForm({ ...addressForm, zone: e.target.value });
        }}
        className="border p-3 rounded w-full"
      />
      <select
        value={addressForm.district}
        onChange={(e) =>
          setAddressForm({ ...addressForm, district: e.target.value })
        }
        className="border p-3 rounded w-full"
      >
        <option value="">
          {districtLoading ? "Loading districts..." : "Select District"}
        </option>
        {districts.map((district) => (
          <option key={district.id} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
  );
}
