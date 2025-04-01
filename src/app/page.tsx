"use client";
import { Button } from "@/components/ui/button";
import SetCookieButton from "./components/setCookieButton";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Login from "./login/page";
import GETJWT from "./components/server_action/getUserInfo";
import Loading from "./components/loading";
import { Checkbox, Snackbar } from "@mui/material";
import Card from "./components/card";
import { useRouter } from "next/navigation";
import _ from "lodash";
import DateComponent from "./components/date";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addNew, FETCH_TAGS, USER_TODO } from "./graphql/mutations/mutations";

type user = {
  id: string;
  username: string;
};
export type todo = {
  description: string;
  id: string;
  isDone: boolean;
  priority: number;
  taskName: string;
  cancelled: boolean;
  createdAt: string;
  tag: tag;
  user: user;
};
type tag = {
  name: string;
  id: string;
};
export type Response = {
  userTodo: {
    code: string;
    message: string;
    success: boolean;
    todos: todo[];
    user: user;
  };
};
type form = {
  taskName: string;
  description: string;
  tagId: string;
  priority: number;
};
export default function Home() {
  const { data, error: errorTAGS, loading: loadingTAGS } = useQuery(FETCH_TAGS);
  const [addTodo, { loading: addNewLoading, error: addNewError }] =
    useMutation(addNew);
  const [userTodo, { error, loading: uselessLoadingfku }] =
    useMutation(USER_TODO);
  const [alert, setAlert] = useState(false);
  const router = useRouter();
  const [isUserLoggedin, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<Response>();
  const [refresh, setRefresh] = useState(false);
  const [groupOne, setGroupOne] = useState<todo[]>([]);
  const [groupTwo, setGroupTwo] = useState<todo[]>([]);
  const [groupThree, setGroupThree] = useState<todo[]>([]);
  const [tags, setTags] = useState<tag[]>([]);
  const [form, setForm] = useState<form>({
    taskName: "",
    description: "",
    tagId: "",
    priority: 5,
  });

  useEffect(() => {
    const checking = async () => {
      const userloggedin = await GETJWT();
      setIsUserLoggedIn(!!userloggedin);
      if (!userloggedin) {
        router.push("/login");
        return;
      }

      try {
        const res = await userTodo({ variables: { jwt: userloggedin } });
        const todos: todo[] = res.data.userTodo.todos;
        const group1 = todos.filter(
          (todo) => todo.isDone === true && todo.cancelled === false
        );
        const group2 = todos.filter(
          (todo) => todo.isDone !== true && todo.cancelled === false
        );
        const group3 = todos.filter((todo) => todo.cancelled === true);
        setGroupOne(group1);
        setGroupTwo(group2);
        setGroupThree(group3);
        setResponse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setAlert(true);
        setLoading(false);
      }
    };
    checking();
  }, [refresh]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  useEffect(() => {
    if (data) {
      setTags(data.tag.tags);
    }
  }, [data]);
  const addNewTask = async () => {
    const jwt = await GETJWT();
    if (!jwt) return;
    try {
      const res = await addTodo({ variables: { ...form, jwt } });
      console.log(res);
      if (res.data) {
        setRefresh((p) => !p);
      }
    } catch (err) {
      console.error(err, "aldaa");
    }
  };
  console.log(form);
  return loading ? (
    <div className="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen">
      {!!error ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!error && alert}
          message={error && error.message}
        />
      ) : (
        <div className="min-h-screen bg-secondary w-full flex flex-col items-center p-10 ">
          <div className="bg-background shadow-2xl">
            <div className="p-7 flex justify-between">
              <div className=" ">
                <div> Тавтай морил </div>
                <span className=" font-bold text-xl">
                  {response?.userTodo.user.username}
                </span>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <Button disabled={addNewLoading}>
                        {addNewLoading ? <Loading /> : "Даалгавар нэмэх"}
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>
                      Та шинэ даалгавар нэмэх гэж байна!
                    </DialogTitle>
                    <div>
                      <Label htmlFor="taskName">Даалгаврын нэр?</Label>
                      <Input
                        id="taskName"
                        onChange={(e) =>
                          setForm((prev) => {
                            return {
                              ...prev,
                              taskName: e.target.value,
                            };
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Тайлбар</Label>
                      <Textarea
                        id="description"
                        onChange={(e) =>
                          setForm((prev) => {
                            return {
                              ...prev,
                              description: e.target.value,
                            };
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-evenly">
                      {[...Array(5)].map((a, i) => (
                        <div key={i} className="flex">
                          <Checkbox
                            checked={i + 1 === form.priority}
                            onChange={(e) =>
                              setForm((prev) => {
                                return {
                                  ...prev,
                                  priority: i + 1,
                                };
                              })
                            }
                          />
                          <Label>{i + 1}</Label>
                        </div>
                      ))}
                    </div>
                    <div>
                      {loadingTAGS ? (
                        <Loading />
                      ) : (
                        <Select
                          onValueChange={(e) => {
                            setForm((prev) => {
                              return {
                                ...prev,
                                tagId: e,
                              };
                            });
                          }}
                          value={form.tagId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tag сонгоно уу!" />
                          </SelectTrigger>
                          <SelectContent className="w-[200px]">
                            {tags.map((tag) => (
                              <SelectItem key={tag.id} value={tag.id}>
                                {tag.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <DialogClose asChild>
                      <div>
                        <Button disabled={addNewLoading} onClick={addNewTask}>
                          {addNewLoading ? <Loading /> : "Нэмэх"}
                        </Button>
                      </div>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <DateComponent />
              </div>
            </div>
            <div className=" flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold">
                Дуусаагүй даалгаварууд
              </div>

              <div className="flex flex-wrap justify-center h-1/2 gap-8 p-7">
                {groupTwo.length > 0 ? (
                  groupTwo.map((todo) => (
                    <Card key={todo.id} todo={todo} setRefresh={setRefresh} />
                  ))
                ) : (
                  <div className="">Хүлээгдэж байгаа даалгавар алга!</div>
                )}
              </div>
            </div>
            <div className=" flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold">Дууссан даалгаварууд</div>
              <div className="flex flex-wrap justify-center h-1/2 gap-8 p-7">
                {groupOne.length > 0 ? (
                  groupOne.map((todo) => (
                    <Card key={todo.id} todo={todo} setRefresh={setRefresh} />
                  ))
                ) : (
                  <div className="">Одоогоор дууссан даалгавар алга!</div>
                )}
              </div>
            </div>
            <div className=" flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold">
                Цуцласан даалгаварууд
              </div>
              <div className="flex flex-wrap justify-center h-1/2 gap-8 p-7">
                {groupThree.length > 0 ? (
                  groupThree.map((todo) => (
                    <Card key={todo.id} todo={todo} setRefresh={setRefresh} />
                  ))
                ) : (
                  <div className="">Одоогоор цуцласан даалгавар алга!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
