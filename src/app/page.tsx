"use client";
import { Button } from "@/components/ui/button";
import SetCookieButton from "./components/setCookieButton";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { HiLogout } from "react-icons/hi";
import Login from "./login/page";
import GETJWT from "./components/server_action/getUserInfo";
import Loading from "./components/loading";
import { Checkbox, Snackbar, Button as MuiButton } from "@mui/material";
import Card from "./components/card";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { motion } from "framer-motion";
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
import {
  addNew,
  FETCH_TAGS,
  USER_TODO,
} from "./graphql/mutationsQueries/mutations";
import { form, Response, tag, todo } from "@/lib/responses";
import { Logout } from "./components/server_action/logout";

export default function Home() {
  const { data, error: errorTAGS, loading: loadingTAGS } = useQuery(FETCH_TAGS);
  const [addTodo, { loading: addNewLoading, error: addNewError }] =
    useMutation(addNew);
  const [userTodo, { error, loading: uselessLoading }] = useMutation(USER_TODO);
  const [alert, setAlert] = useState(false);
  const router = useRouter();
  const [isUserLoggedin, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<Response>();
  const [expand1, setExpand1] = useState(false);
  const [expand2, setExpand2] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [groupOne, setGroupOne] = useState<todo[]>([]);
  const [groupTwo, setGroupTwo] = useState<todo[]>([]);
  const [groupThree, setGroupThree] = useState<todo[]>([]);
  const [loggingout, setLogout] = useState(false);
  const [tags, setTags] = useState<tag[]>([]);
  const [form, setForm] = useState<form>({
    taskName: "",
    description: "",
    tagId: "",
    priority: 5,
  });
  useEffect(() => {
    if (response) {
      if (response.userTodo.todos.length > 0) {
        const check = response.userTodo.todos.some(
          (guest: todo) => guest.taskName === form.taskName
        );
        if (check) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      }
    }
  }, [form.taskName]);
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
    setWaiting(true);
    const jwt = await GETJWT();
    if (!jwt) {
      setWaiting(false);
      return;
    }
    try {
      const res = await addTodo({ variables: { ...form, jwt } });
      // console.log(res);
      if (res.data) {
        setRefresh((p) => !p);
      }
    } catch (err) {
      console.error(err, "aldaa");
    } finally {
      setWaiting(false);
    }
  };
  // console.log(form);
  return loading ? (
    <div className="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen bg-secondary w-full flex flex-col items-center p-10 ">
      {!!error ? (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!error && alert}
          message={error && error.message}
        />
      ) : (
        <>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={uselessLoading}
            message={"Ахин татаж байна!"}
          />
          <div className="flex justify-around w-full shadow-2xl bg-background fixed top-0">
            <div className="flex items-center gap-4">
              <div>
                <div> Тавтай морил </div>
                <span className=" font-bold text-xl">
                  {response?.userTodo.user.username}
                </span>
              </div>
              <div
                className=" cursor-pointer"
                onClick={async () => {
                  setLogout(true);
                  await Logout();
                  setLogout(false);
                  setRefresh(!refresh);
                }}
              >
                {loggingout ? <Loading /> : <HiLogout className="text-2xl" />}
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <MuiButton
                sx={{ color: "black" }}
                onClick={() => {
                  setExpand1(!expand1);
                  if (expand2) {
                    setExpand2(false);
                  }
                }}
                className="text-sm"
              >
                Дууссан даалгаварууд
              </MuiButton>
              <MuiButton
                sx={{ color: "black" }}
                onClick={() => {
                  setExpand2(!expand2);
                  if (expand1) {
                    setExpand1(false);
                  }
                }}
                className="text-sm"
              >
                Цуцласан даалгаварууд
              </MuiButton>
            </div>
            <div>
              <DateComponent />
            </div>
          </div>
          <div className="bg-background min-h-screen w-4/5 xl:w-2/3 shadow-2xl flex m-5 flex-col gap-10">
            <div className="p-7 flex justify-end">
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <MuiButton
                        sx={{ color: "black" }}
                        disabled={addNewLoading}
                      >
                        {addNewLoading ? <Loading /> : "Даалгавар нэмэх"}
                      </MuiButton>
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
                      {!isValid && (
                        <div className=" text-xs text-red-500">
                          Ийм нэртэй даалгавар байна!
                        </div>
                      )}
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
                    <div>
                      <div>Хэр чухал вэ?</div>
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
                      <div className="w-full flex justify-center">
                        <MuiButton
                          sx={{ color: "black" }}
                          disabled={
                            addNewLoading ||
                            form.taskName.length < 5 ||
                            form.description.length < 5 ||
                            form.tagId.length < 5
                          }
                          onClick={addNewTask}
                        >
                          {addNewLoading ? <Loading /> : "Нэмэх"}
                        </MuiButton>
                      </div>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* duusaagui daalgavruud */}
            <div className=" flex flex-col flex-wrap items-center justify-center gap-6">
              <div className="lg:text-2xl text-xs font-semibold">
                Таны даалгаварууд
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 transition-all duration-300 justify-items-center gap-8 p-7">
                {groupTwo.length > 0 ? (
                  groupTwo.map((todo) => (
                    <Card key={todo.id} todo={todo} setRefresh={setRefresh} />
                  ))
                ) : (
                  <div className="">Хүлээгдэж байгаа даалгавар алга!</div>
                )}
              </div>
            </div>
            {/* duussan daalgavruud */}
            <div
              className={`${
                !expand1 && !expand2 && `flex justify-center gap-5`
              }`}
            >
              {expand1 && (
                <div className=" flex flex-col flex-wrap items-center justify-center gap-6  transition-all duration-300">
                  <div
                    onClick={() => {
                      setExpand1(!expand1);
                    }}
                    className={`lg:text-2xl text-xs font-semibold cursor-pointer  transition-all duration-300`}
                  >
                    Дууссан даалгаварууд
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    exit={{ opacity: 0, y: 50 }}
                    viewport={{ once: false }}
                    className=" rounded-lg shadow-lg grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-items-center gap-8 p-7"
                  >
                    {groupOne.length > 0 ? (
                      groupOne.map((todo) => (
                        <Card
                          key={todo.id}
                          todo={todo}
                          setRefresh={setRefresh}
                        />
                      ))
                    ) : (
                      <div className="">Одоогоор дууссан даалгавар алга!</div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* tsutslasan daalgavruud */}
              {expand2 && (
                <div className=" flex flex-col transition-all duration-300 flex-wrap  items-center justify-center gap-6">
                  <div
                    onClick={() => {
                      setExpand2(!expand2);
                    }}
                    className={`lg:text-2xl text-xs font-semibold  transition-all duration-300                     cursor-pointer`}
                  >
                    Цуцласан даалгаварууд
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    exit={{ opacity: 0, y: 50 }}
                    viewport={{ once: false }}
                    className=" rounded-lg shadow-lg grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-items-center gap-8 p-7"
                  >
                    {groupThree.length > 0 ? (
                      groupThree.map((todo) => (
                        <Card
                          key={todo.id}
                          todo={todo}
                          setRefresh={setRefresh}
                        />
                      ))
                    ) : (
                      <div className="">Одоогоор цуцласан даалгавар алга!</div>
                    )}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
