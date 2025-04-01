"use client";
import { Button, Snackbar } from "@mui/material";
import { todo } from "../page";
import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import { gql, useMutation } from "@apollo/client";
import GETJWT from "./server_action/getUserInfo";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "./loading";
import { BsTag } from "react-icons/bs";
import { TbCancel } from "react-icons/tb";
import { CANCEL_TODO, UPDATE_STATUS } from "../graphql/mutations/mutations";

export default function Card({
  todo,
  setRefresh,
}: {
  todo: todo;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  // const createdAt = new Date(todo.createdAt).toISOString().split("T")[0];
  // console.log(typeof todo.createdAt);
  const [alert, setAlert] = useState(false);

  const router = useRouter();
  const [updateStatus, { loading, error }] = useMutation(UPDATE_STATUS);

  const [cancelTodo, { loading: loadingCancelTodo, error: errorCancelTodo }] =
    useMutation(CANCEL_TODO);
  const calculateTime = (data: string) => {
    const timeago =
      (new Date().getTime() - new Date(Number(data)).getTime()) / 1000;

    const seconds = 1;
    const minutes = 60 * seconds;
    const hours = 60 * minutes;
    const days = 24 * hours;
    const weeks = 7 * days;
    const months = 30 * days;
    const years = 365 * days;

    if (timeago >= years) {
      return Math.floor(timeago / years) + " жилийн өмнө";
    } else if (timeago >= months) {
      return Math.floor(timeago / months) + " сарын өмнө";
    } else if (timeago >= weeks) {
      return Math.floor(timeago / weeks) + " долоо хоногийн өмнө";
    } else if (timeago >= days) {
      return Math.floor(timeago / days) + " хоногийн өмнө";
    } else if (timeago >= hours) {
      return Math.floor(timeago / hours) + " цагийн өмнө";
    } else if (timeago >= minutes) {
      return Math.floor(timeago / minutes) + " минутын өмнө";
    } else if (timeago >= seconds) {
      return Math.floor(timeago) + " секундийн өмнө";
    } else {
      return "дөнгөж сая";
    }
  };
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
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  return (
    <div
      className={`card w-96 bg-base-100 card-xs shadow-lg p-6 rounded-2xl relative ${
        (todo.isDone || todo.cancelled) &&
        `bg-muted text-gray-500 cursor-not-allowed`
      }`}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={(!!error || !!errorCancelTodo) && alert}
        message={
          (error && error.message) ||
          (errorCancelTodo && errorCancelTodo.message)
        }
      />
      <div className="card-body flex flex-col gap-4">
        <div>
          <h2 className="card-title font-bold">{todo.taskName}</h2>
          <div className=" text-xs text-gray-400">
            {calculateTime(todo.createdAt)}
          </div>
        </div>
        <p>{todo.description}</p>
        <div className="justify-end card-actions">
          {/* {!todo.isDone && <Button className="btn btn-primary">Засах</Button>} */}
        </div>
        <div className="absolute bottom-2 left-4 text-gray-400 text-sm flex items-center gap-1">
          <BsTag />
          <div>{todo.tag.name}</div>
        </div>
        {!todo.cancelled ? (
          <div
            onClick={handleStatus}
            className="absolute bottom-2 right-2 text-2xl cursor-pointer"
          >
            {todo.isDone ? (
              <div className="text-green-400 text-lg">
                <LuCircleCheck title="Дууссан даалгавар" />
              </div>
            ) : loading ? (
              <div className="text-xs">
                <Loading />
              </div>
            ) : (
              <div className=" text-pink-400 text-sm">Дууссан?</div>
            )}
          </div>
        ) : (
          <TbCancel className="absolute bottom-2 right-2 text-2xl cursor-pointer" />
        )}
        {!todo.isDone && !todo.cancelled && (
          <div
            onClick={cancelTodoButton}
            className="absolute top-2 right-2 text-2xl cursor-pointer"
          >
            {todo.cancelled ? (
              <div className="text-green-400 text-lg">
                <LuCircleAlert title="Цуцласан" />
              </div>
            ) : loading ? (
              <div className="text-xs">
                <Loading />
              </div>
            ) : (
              <div className=" text-sm">
                {loadingCancelTodo ? (
                  <div className="text-xs">
                    <Loading />
                  </div>
                ) : (
                  "Цуцлах"
                )}
              </div>
            )}
          </div>
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
