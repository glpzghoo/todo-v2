"use client";
import { Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginResponse } from "../login/page";
import setCookie from "../components/server_action/setCookie";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "../components/loading";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, RESIGSTER } from "../graphql/mutationsQueries/mutations";
import Link from "next/link";

export default function Register() {
  const [newUser, { loading, error }] = useMutation(RESIGSTER);
  const router = useRouter();
  const [registerResponse, setResponse] = useState<loginResponse>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  const handleRegister = async () => {
    try {
      const response = await newUser({
        variables: { username, password },
      });
      if (response.data) {
        setResponse(response.data);
      }
    } catch (err) {
      console.error(err, "aldaa");
    } finally {
      setAlert(true);
    }
  };
  useEffect(() => {
    if (registerResponse) {
      router.push("/login");
    }
  }, [registerResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!error && alert}
        message={error && error.message}
      />
      <div className="flex flex-col w-4/5 sm:w-2/5 xl:w-1/5 gap-8 p-15 bg-secondary shadow-2xl rounded-lg">
        <div className=" font-semibold text-2xl">Бүртгүүлэх</div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
          <Input
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                username.length > 7 &&
                password.length > 7
              ) {
                handleRegister();
              }
            }}
            min={8}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">Нууц үг</Label>
          <Input
            min={8}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                username.length > 7 &&
                password.length > 7
              ) {
                handleRegister();
              }
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            id="password"
            type="password"
          />
        </div>
        <div className=" flex justify-center">
          <Button
            onClick={handleRegister}
            disabled={username.length < 8 || password.length < 8 || loading}
            className={`w-full ${
              username.length < 8 ||
              (password.length < 8 &&
                `bg-secondary text-foreground cursor-not-allowed`)
            }`}
          >
            {loading ? <Loading /> : "Нэвтрэх"}
          </Button>
        </div>
        <Link href={`/login`}>Нэвтрэх</Link>
      </div>
    </div>
  );
}
