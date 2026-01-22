import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageCard from "../../components/page-card";
import ProfileDataField from "../../components/profile-data-field";
import type { UserProfile } from "../../types/user-profile";
import { getUserProfile } from "../../services/api/users-api";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserProfile(Number(id));
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <PageCard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-black/60">Loading...</div>
        </div>
      </PageCard>
    );
  }

  if (!user) {
    return (
      <PageCard>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-lg text-black/60">User not found</div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
          >
            Go back
          </button>
        </div>
      </PageCard>
    );
  }

  return (
    <PageCard>
      <div className="w-full max-w-2xl px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-base text-black/60 mt-1">{user.email}</p>
        </div>

        {/* Personal Data Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-black mb-4">
            Personal data
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <ProfileDataField label="Phone number" value={user.phoneNumber} />
            <ProfileDataField
              label="Birth date"
              value={`${String(user.birthDay).padStart(2, "0")}.${String(user.birthMonth).padStart(2, "0")}.${user.birthYear}`}
            />
          </div>
          <div className="mt-6">
            <ProfileDataField
              label="Residential address"
              value={
                user.addressStreet
                  ? `${user.addressStreet} ${user.addressNumber}${user.addressApartment ? "/" + user.addressApartment : ""}, ${user.addressPostalCode} ${user.addressCity}${user.addressState ? ", " + user.addressState : ""}, ${user.addressCountry}`
                  : "No address provided"
              }
            />
          </div>
        </div>

        {/* Company Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-black mb-4">
            In the company
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <ProfileDataField
              label="Employee since"
              value={
                user.employeeSince
                  ? new Date(user.employeeSince).toLocaleDateString("pl-PL")
                  : "N/A"
              }
            />
            <ProfileDataField
              label="Last modification"
              value={
                user.lastModification
                  ? new Date(user.lastModification).toLocaleDateString("pl-PL")
                  : "N/A"
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <ProfileDataField
              label="Branches"
              value={
                user.branches.length > 0
                  ? user.branches
                  : "No branches assigned"
              }
            />
            <ProfileDataField
              label="Departments"
              value={
                user.departments.length > 0
                  ? user.departments
                  : "No departments assigned"
              }
            />
          </div>
          <div className="mt-6">
            <ProfileDataField
              label="System roles"
              value={
                user.systemRoles.length > 0
                  ? user.systemRoles
                  : "No system roles assigned"
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            type="button"
            onClick={() => {
              navigate(`/user-competency-profile/${user.userId}`);
            }}
            className="w-full h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
          >
            View competency profile
          </button>
          <button
            type="button"
            onClick={() => {
              // TODO: Implement block account
              console.log("Block account");
            }}
            className="w-full h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99]"
          >
            Block account
          </button>
        </div>
      </div>
    </PageCard>
  );
}
