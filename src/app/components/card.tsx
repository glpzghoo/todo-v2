"use client";
import { Checkbox, Snackbar, Button as Muibutton } from "@mui/material";
import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import { gql, useMutation, useQuery } from "@apollo/client";
import GETJWT from "./server_action/getUserInfo";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "./loading";
import { BsTag } from "react-icons/bs";
import { TbCancel } from "react-icons/tb";
import LinearProgress from "@mui/material/LinearProgress";
import {
  CANCEL_GUEST_TODO,
  CANCEL_TODO,
  DONE_GUEST_TODO,
  EDIT_GUEST_TODO,
  FETCH_TAGS,
  FETCH_TODOS,
  UPDATE_STATUS,
  UPDATE_TODO,
} from "../graphql/mutationsQueries/mutations";
import { calculateTime } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { form, tag, todo } from "@/lib/responses";
import { Button } from "@/components/ui/button";

export default function Card({
  todo,
  setRefresh,
}: {
  todo: todo;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    data: GuestTodos,
    error: errorGuestTodosQuery,
    loading: loadingGuestTodosQuery,
  } = useQuery(FETCH_TODOS);
  const { data, error: errorTAGS, loading: loadingTAGS } = useQuery(FETCH_TAGS);
  // const createdAt = new Date(todo.createdAt).toISOString().split("T")[0];
  // console.log(typeof todo.createdAt);
  const [alert, setAlert] = useState(false);
  const [tags, setTags] = useState<tag[]>([]);

  const router = useRouter();
  const [updateStatus, { loading, error }] = useMutation(UPDATE_STATUS);
  const [updateTodo, { loading: loadingUpdateTodo, error: errorUpdateTodo }] =
    useMutation(UPDATE_TODO);
  const [
    editGuestTodo,
    { loading: loadingUpdateGuestTodo, error: errorUpdateGuestTodo },
  ] = useMutation(EDIT_GUEST_TODO);
  const [
    CancelGuestTodo,
    { loading: loadingCancelGuestTodo, error: errorCancelGuestTodo },
  ] = useMutation(CANCEL_GUEST_TODO);
  const [cancelTodo, { loading: loadingCancelTodo, error: errorCancelTodo }] =
    useMutation(CANCEL_TODO);
  const [
    doneGuestTodo,
    { loading: loadingDoneGuestTodo, error: errorDoneGuestTodo },
  ] = useMutation(DONE_GUEST_TODO);
  const [form, setForm] = useState<form>({
    taskName: todo.taskName,
    description: todo.description,
    tagId: todo.tag.id,
    priority: todo.priority,
    id: todo.id,
  });
  const handleStatus = async () => {
    const jwt = await GETJWT();
    if (!jwt) {
      router.push("/login");
    }
    try {
      const res = await updateStatus({
        variables: { jwt: jwt, todoId: todo.id },
      });
      if (res.data) {
        setRefresh((p) => !p);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAlert(true);
    }
  };
  const cancelTodoButton = async () => {
    const jwt = await GETJWT();
    if (!jwt) return;
    try {
      const res = await cancelTodo({ variables: { id: todo.id, jwt } });
      if (res.data) {
        setRefresh((p) => !p);
      }
    } catch (er) {
      console.error(er, "aldaa");
    }
  };
  const editTodo = async () => {
    const jwt = await GETJWT();
    if (!jwt) return;
    try {
      const res = await updateTodo({ variables: { ...form, jwt } });
      if (res.data) {
        setRefresh((prev) => !prev);
      }
    } catch (err) {
      console.error(err, "aldaa");
    }
  };
  const editGuestTod = async () => {
    try {
      const res = await editGuestTodo({
        variables: { ...form },
        refetchQueries: [{ query: FETCH_TODOS }],
      });
    } catch (err) {
      console.error(err, "aldaa");
    }
  };
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
  // console.log(form);
  return (
    <div
      className={`card w-48  md:w-72 lg:w-80 bg-base-100 card-xs max-h-96 overflow-hidden shadow-md  transition-all duration-300 p-6 rounded-2xl relative ${
        todo.isDone || todo.cancelled
          ? `bg-muted text-gray-500 cursor-not-allowed`
          : `hover:shadow-2xl `
      }`}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={
          (!!error ||
            !!errorCancelTodo ||
            !!errorCancelGuestTodo ||
            !!errorUpdateGuestTodo ||
            !!errorTAGS) &&
          alert
        }
        message={
          (error && error.message) ||
          (errorCancelTodo && errorCancelTodo.message) ||
          (errorCancelGuestTodo && errorCancelGuestTodo.message) ||
          (errorTAGS && errorTAGS.message)
        }
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={loadingGuestTodosQuery}
        message={"Түр хүлээнэ үү!"}
      />
      <div className="card-body flex flex-col gap-4">
        <div>
          <h2 className="card-title font-extrabold text-xl">{todo.taskName}</h2>
          <div className=" text-xs text-gray-400">
            {calculateTime(todo.createdAt)}
          </div>
        </div>
        <p>{todo.description}</p>
        <div className="absolute bottom-2 left-4 text-gray-400 text-xs flex items-center gap-1">
          <BsTag />
          <div>{todo.tag.name}</div>
        </div>
        <div
          title={`"Хэр чухал даалгавар вэ?" хэмжээс`}
          className="pt-4 absolute left-0 right-0 bottom-0 w-full"
        >
          <LinearProgress
            color={
              todo.priority === 1
                ? "inherit"
                : todo.priority === 2
                ? "error"
                : todo.priority === 3
                ? "secondary"
                : todo.priority === 4
                ? "primary"
                : "success"
            }
            variant="determinate"
            value={todo.priority * 20}
            sx={{ bgcolor: "pink", borderColor: "green" }}
          />
        </div>
        {!todo.cancelled ? (
          <div
            onClick={async () => {
              if (todo?.user) {
                handleStatus();
              } else {
                await doneGuestTodo({
                  variables: { id: todo.id },
                  refetchQueries: [{ query: FETCH_TODOS }],
                });
              }
            }}
            className="absolute bottom-2 right-2 text-2xl cursor-pointer"
          >
            {todo.isDone ? (
              <div className="text-green-400 text-lg">
                <LuCircleCheck title="Дууссан даалгавар" />
              </div>
            ) : loadingDoneGuestTodo ? (
              <div className="text-xs">
                <Loading />
              </div>
            ) : (
              <div
                data-cy="done-guest-todo-button"
                className=" text-green-400 text-sm"
              >
                Дуусгах!
              </div>
            )}
          </div>
        ) : (
          <TbCancel className="absolute bottom-2 right-2 text-2xl" />
        )}
        {!todo.isDone && !todo.cancelled && (
          <>
            <div
              onClick={async () => {
                if (todo.user) {
                  cancelTodoButton();
                } else {
                  await CancelGuestTodo({
                    variables: { id: todo.id },
                    refetchQueries: [{ query: FETCH_TODOS }],
                  });
                }
              }}
              className="absolute top-2 right-2 text-2xl cursor-pointer"
            >
              {todo.cancelled ? (
                <div className="text-green-400 text-lg">
                  <LuCircleAlert title="Цуцласан" />
                </div>
              ) : loadingCancelGuestTodo ? (
                <div className="text-xs">
                  <Loading />
                </div>
              ) : (
                <div className=" text-sm">
                  {/* 2 */}
                  {loadingCancelTodo ? (
                    <div className="text-xs">
                      <Loading />
                    </div>
                  ) : (
                    <TbCancel
                      className="cursor-pointer text-2xl"
                      title="Засах"
                    />
                  )}
                </div>
              )}
            </div>
            <Dialog>
              <DialogTrigger className="flex justify-center" asChild>
                <Muibutton data-cy="todo-zasah-tocch" sx={{ color: "red" }}>
                  Засах
                </Muibutton>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  Даалгавар {todo.taskName} -г засах гэж байна!
                </DialogTitle>
                <div>
                  <Label htmlFor="taskName">Даалгаврын нэр?</Label>
                  <Input
                    data-cy="zochnii-todo-ner-zasah"
                    onChange={(e) => {
                      setForm((prev) => {
                        return {
                          ...prev,
                          taskName: e.target.value,
                        };
                      });
                    }}
                    value={form.taskName}
                    id="taskName"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Тайлбар</Label>
                  <Textarea
                    data-cy="zochnii-todo-desc-zasah"
                    onChange={(e) => {
                      setForm((prev) => {
                        return {
                          ...prev,
                          description: e.target.value,
                        };
                      });
                    }}
                    id="description"
                    value={form.description}
                  />
                </div>
                <div className="">
                  <div>Хэр чухал вэ?</div>
                  <div className="flex justify-evenly">
                    {[...Array(5)].map((a, i) => (
                      <div key={i} className="flex">
                        <Checkbox
                          data-cy="zochnii-todo-prio-solih"
                          onChange={() => {
                            setForm((p) => {
                              return {
                                ...p,
                                priority: i + 1,
                              };
                            });
                          }}
                          checked={i + 1 === form.priority}
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
                      value={form.tagId}
                      onValueChange={(e) => {
                        setForm((p) => {
                          return {
                            ...p,
                            tagId: e,
                          };
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          data-cy="zohcnii-todo-tag-solih-trigger"
                          placeholder="Tag сонгоно уу!"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-[200px]">
                        {tags.map((tag) => (
                          <SelectItem
                            data-cy="zochnii-todo-tag-solih"
                            key={tag.id}
                            value={tag.id}
                          >
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <DialogClose asChild>
                  <div className="w-full">
                    <Button
                      data-cy="zochnii-todo-solih-tovch"
                      disabled={
                        form.taskName.length < 5 ||
                        form.description.length < 5 ||
                        loadingUpdateTodo
                      }
                      onClick={() => {
                        if (todo?.user !== undefined) {
                          editTodo();
                        } else {
                          editGuestTod();
                        }
                      }}
                      className="w-full bg-red-500"
                    >
                      {loadingUpdateTodo || loadingUpdateGuestTodo ? (
                        <Loading />
                      ) : (
                        "Засах"
                      )}
                    </Button>
                  </div>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* <div className="flex justify-between">
        <div className="font-bold"></div>
        <div>{todo.priority}</div>
      </div>
      <div className="flex flex-col">
        <div>Дэлгэрэнгүй: </div>
        <div></div>
      </div>
     */}
    </div>
  );
}
