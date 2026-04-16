import { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/axios";
import { FiUser } from "react-icons/fi";

/* ---------- Constants ---------- */

const STATES_AND_UTS = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const GENDERS = ["Male", "Female", "Other"];
const CATEGORIES = ["General", "SC", "ST", "OBC"];

/* ---------- Component ---------- */

const SettingsGeneral = ({ profile, setProfile }) => {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await api.put("/users/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(form);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mt-5 mb-15">
        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
          <FiUser className="text-neutral-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <p className="text-sm text-neutral-400">
            This information helps us recommend the right schemes
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />

          <SearchableInput
            label="Gender"
            value={form.gender}
            options={GENDERS}
            placeholder="Type or select gender"
            listId="gender-list"
            onChange={(e) => handleChange("gender", e.target.value)}
          />
        </div>

        {/* State */}
        <SearchableInput
          label="State / Union Territory"
          value={form.state}
          options={STATES_AND_UTS}
          placeholder="Type to search state"
          listId="states-list"
          onChange={(e) => handleChange("state", e.target.value)}
        />

        {/* Divider */}
        <div className="h-px bg-neutral-800" />

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Annual Income (₹)"
            type="number"
            value={form.income}
            onChange={(e) => handleChange("income", e.target.value)}
          />

          <SearchableInput
            label="Category"
            value={form.category}
            options={CATEGORIES}
            placeholder="Type or select category"
            listId="category-list"
            onChange={(e) => handleChange("category", e.target.value)}
          />
        </div>

        {/* Action */}
        <div className="pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsGeneral;

/* ---------- Inputs ---------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs text-neutral-400 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2.5 rounded-lg
                 bg-neutral-900 border border-neutral-700
                 text-sm text-neutral-200
                 focus:outline-none focus:border-white transition"
    />
  </div>
);

const SearchableInput = ({
  label,
  value,
  options,
  placeholder,
  listId,
  onChange,
}) => (
  <div>
    <label className="block text-xs text-neutral-400 mb-1">
      {label}
    </label>
    <input
      list={listId}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg
                 bg-neutral-900 border border-neutral-700
                 text-sm text-neutral-200
                 focus:outline-none focus:border-white transition"
    />
    <datalist id={listId}>
      {options.map((opt) => (
        <option key={opt} value={opt} />
      ))}
    </datalist>
  </div>
);
