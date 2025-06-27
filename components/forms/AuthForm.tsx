"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import FormField from "../shared/FormField";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/actions/user";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();

  const form = useForm({
    defaultValues: { fullname: "", email: "", password: "" },
  });

  const handleSubtmit = async (values: {
    email: string;
    password: string;
    fullname: string;
  }) => {
    const { fullname, email, password } = values;
    try {
      if (type === "sign-up") {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          email,
          fullname,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully!");
        router.push("/sign-in");
      } else {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredentials.user.getIdToken();

        const result = await signIn({ email, idToken });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error: any) {
      toast.success(error.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubtmit)}
        className="flex flex-col items-center gap-9"
      >
        <h1 className="flex items-center gap-2">
          <Image src="/logo.svg" height={40} width={40} alt="logo" />
          <span className="text-3xl font-semibold">PrepWise</span>
        </h1>

        <p className="font-semibold text-2xl">
          Practice job interviews with AI
        </p>

        <div className="w-full sm:w-[486px] flex flex-col gap-5">
          {type == "sign-up" && (
            <FormField
              type="text"
              placeholder="Enter your full name"
              label="Full name"
              control={form.control}
              name="fullname"
            />
          )}

          <FormField
            type="email"
            placeholder="Your email"
            label="Email"
            control={form.control}
            name="email"
          />

          <FormField
            type="password"
            placeholder="Enter your password"
            label="Password"
            control={form.control}
            name="password"
          />
        </div>

        <Button className="w-full bg-primary-200 py-6 px-8 rounded-3xl text-[#020408] text-[16px]">
          {type === "sign-in" ? "Log into your account" : "Create an account"}
        </Button>

        <Link
          href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          className="text-white "
        >
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </Link>
      </form>
    </Form>
  );
};

export default AuthForm;
