"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import z from "zod";
import { ImSpinner10 } from "react-icons/im";
import Loading from "../components/loading";
import setCookie from "../components/server_action/setCookie";
import { useRouter } from "next/navigation";
import { LOGIN_USER } from "../graphql/mutations/mutations";

type todo = {
  description: string;
  id: string;
  isDone: boolean;
  priority: number;
  taskName: string;
  tag: tag;
};
type tag = {
  name: string;
  id: string;
};
export type loginResponse = {
  loginUser: {
    JWT: string;
    code: string;
    message: string;
    success: boolean;
    user: {
      username: string;
      todo: todo[];
    };
  };
};
export default function Login() {
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const router = useRouter();
  const [loginResponse, setResponse] = useState<loginResponse>();
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
  const handleLogin = async () => {
    try {
      const response = await loginUser({
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
    if (loginResponse) {
      setCookie(loginResponse);
      router.push("/");
    }
  }, [loginResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!error && alert}
        message={error && error.message}
      />
      <div className="flex flex-col w-4/5 sm:w-2/5 xl:w-1/5 gap-8 p-15 bg-secondary shadow-2xl rounded-lg">
        <div className="flex flex-col gap-3">
          <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
          <Input
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
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
          />
        </div>
        <div className=" flex justify-center">
          <Button
            onClick={handleLogin}
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
      </div>
    </div>
  );
}
