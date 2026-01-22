import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageCard from "../../components/page-card";
import ProfileDataField from "../../components/profile-data-field";
import type { UserProfile } from "../../types/user-profile";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulating API call with mock data
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // Mock data for demonstration
        const mockUser: UserProfile = {
          userId: Number(id),
          firstName: "Bartosz",
          lastName: "Waclawiak",
          email: "bartosz.waclawiak@company.com",
          phoneNumber: "+48 123 456 789",
          birthDate: "10.03.2004",
          address: "Sportowa 14, 50-139 Wrocław",
          employeeSince: "20.11.2022",
          lastModification: "11.04.2024",
          branches: ["Wrocław"],
          departments: ["Marketing", "IT"],
          systemRoles: ["Admin", "Employee"],
        };
        setUser(mockUser);
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
            <ProfileDataField label="Birth date" value={user.birthDate} />
          </div>
          <div className="mt-6">
            <ProfileDataField
              label="Residential address"
              value={user.address}
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
              value={user.employeeSince}
            />
            <ProfileDataField
              label="Last modification"
              value={user.lastModification}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <ProfileDataField label="Branches" value={user.branches} />
            <ProfileDataField label="Departments" value={user.departments} />
          </div>
          <div className="mt-6">
            <ProfileDataField label="System roles" value={user.systemRoles} />
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
