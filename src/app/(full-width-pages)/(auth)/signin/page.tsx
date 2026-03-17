import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faunatic.id | Sign In",
  description: "Faunatic dashboard authentication",
};

export default function SignIn() {
  return <SignInForm />;
}
