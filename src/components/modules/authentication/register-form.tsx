"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  password: z.string().min(8, "Minimum length is 8"),
  role: z.enum(["student", "tutor"]),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", role: "student" as "student" | "tutor" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account...");
      try {
        const { data, error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          role: value.role,
        } as any);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        toast.success("Account created! Please login.", { id: toastId });
        router.push("/login");
      } catch (err) {
        toast.error("Something went wrong.", { id: toastId });
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join SkillBridge as a student or tutor</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input type="text" id={field.name} name={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input type="email" id={field.name} name={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input type="password" id={field.name} name={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel>I am a</FieldLabel>
                  <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as "student" | "tutor")}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button form="register-form" type="submit" className="w-full">Register</Button>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">Login</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
