import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Loading } from "@/components/Loading";

export default function Team() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the full team management page
    navigate("/team-management", { replace: true });
  }, [navigate]);

  return <Loading message="Loading team management..." />;
}
