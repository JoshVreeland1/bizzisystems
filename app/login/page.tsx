import { redirect } from "next/navigation";

// Authentication remains entirely inside the existing pilot platform.
// Its server middleware validates session, active profile, and role permissions.
export default function LoginPage() {
  redirect("https://bizzi-pilot-platform.vercel.app/login");
}
