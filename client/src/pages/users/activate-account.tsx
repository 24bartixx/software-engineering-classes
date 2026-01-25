import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageCard from "../../components/page-card";
import CustomPassInput from "../../components/custom-pass-input";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import {
  verifyAccount,
  verifyActivateToken,
} from "../../services/api/users-api";

type FieldKey = "password" | "confirmPassword";

export default function ActivateAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<FieldKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        navigate("/failed-activation");
        return;
      }

      try {
        const result = await verifyActivateToken(token);
        console.log(result);
        if (result.expired) {
          navigate("/users/failed-expired-token");
        } else if (!result.valid) {
          navigate("/users/failed-invalid-token");
        }
      } catch (err) {
        navigate("/users/failed-invalid-token");
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, [searchParams, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setFieldError("password");
      setError("Password is required");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{7,})/;
    if (!passwordRegex.test(password)) {
      setFieldError("password");
      setError(
        "Password must be at least 7 characters with one uppercase letter, one lowercase letter, and one digit",
      );
      return;
    }

    if (!confirmPassword.trim()) {
      setFieldError("confirmPassword");
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("confirmPassword");
      setError("Passwords do not match");
      return;
    }

    setError("");
    setFieldError(null);
    setIsSubmitting(true);

    try {
      const token = searchParams.get("token");
      if (!token) {
        setError("Invalid or missing activation token");
        setIsSubmitting(false);
        return;
      }

      await verifyAccount(token, {
        password,
        repeat_password: confirmPassword,
      });

      navigate("/successful-activation");
    } catch (err: any) {
      console.error("Activation error:", err);
      navigate("/failed-activation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingToken) {
    return (
      <PageCard>
        <div className="flex flex-col items-center justify-center w-full px-12 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Verifying activation token...</p>
        </div>
      </PageCard>
    );
  }

  return (
    <PageCard>
      <form onSubmit={onSubmit} className="flex flex-col w-full px-12">
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-2xl">Activate account</h1>

          <p className="text-gray-600 mt-2 mb-6 w-full text-left">
            To activate your account, please set a password.
          </p>

          {error && (
            <div className="w-full pt-6 mb-4">
              <div className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="w-full">
            <CustomPassInput
              label="Password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                if (fieldError === "password") setFieldError(null);
                if (error && fieldError === "password") setError("");
              }}
              placeholder="Enter your password"
              isErr={fieldError === "password"}
            />
          </div>

          <div className="w-full">
            <CustomPassInput
              label="Confirm password"
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                if (fieldError === "confirmPassword") setFieldError(null);
                if (error && fieldError === "confirmPassword") setError("");
              }}
              placeholder="Confirm your password"
              isErr={fieldError === "confirmPassword"}
            />
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full h-11 rounded-xl border-2 border-black bg-white text-black hover:bg-gray-50 active:scale-[0.99]"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Activating..." : "Activate account"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </PageCard>
  );
}
