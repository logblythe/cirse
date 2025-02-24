import { Metadata } from "next";
import LoginForm from "./form";

export const metadata: Metadata = {
  title: "MyCirse | Login",
  description: "Enter your credentials to get started",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between py-24 md:px-24 bg-blue-50 ">
      <div className="flex flex-col w-full lg:w-1/2 max-w-[680px] bg-white  px-8 md:px-16 pt-14 pb-28 rounded-lg mx-auto">
        <h1 className="text-3xl font-bold mb-8 ">Sign in to your account</h1>
        <div className="flex">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
