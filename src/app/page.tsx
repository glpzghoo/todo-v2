"use client";
import { gql, useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import _ from "lodash";
import { Status, todo } from "@prisma/client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const GET_TODOS = gql`
  query gettodo {
    alltodos {
      id
      name
      status
      updatedAt
    }
  }
`;
const addtodo = gql`
  mutation addtodo($name: String!, $status: String!) {
    addNew(name: $name, status: $status) {
      id
      name
    }
  }
`;
const edittodoopoooo = gql`
  mutation edittodo($id: ID!, $status: String, $name: String) {
    edittodo(id: $id, status: $status, name: $name) {
      name
    }
  }
`;
const deleteTodooo = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;
const STATUSES = [
  { name: "Төлөвлөж байгаа", status: Status.TODO },
  { name: "Одоо хийж байгаа", status: Status.INPROGRESS },
  { name: "Дууссан", status: Status.DONE },
  { name: "Больсон", status: Status.BLOCKED },
];
export default function Home() {
  const { data, error, loading } = useQuery(GET_TODOS);
  const [addNew, { loading: loading2, error: error2 }] = useMutation(addtodo);
  const [edittodo, { loading: loading3, error: error3 }] =
    useMutation(edittodoopoooo);
  const [deleteTodo, { loading: loading4, error: error4 }] =
    useMutation(deleteTodooo);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("TODO");
  const [id, setId] = useState("");
  if (loading) return <div>Түр хүлээнэ үү!</div>;
  if (error) return <div>Алдаа гарлааа</div>;
  // const statusss = [
  //   { type: "Төлөвлөж байгаа" },
  //   { type: "Одоо хийж байгаа" },
  //   { type: "Дууссан" },
  //   { type: "Больсон" },
  // ];
  // const todos = data.alltodos.some((todo: todo) => todo.status === "TODO");
  // const blocked = data.alltodos.some((todo: todo) => todo.status === "BLOCKED");
  // const inprogress = data.alltodos.some(
  //   (todo: todo) => todo.status === "INPROGRESS"
  // );
  // const done = data.alltodos.some((todo: todo) => todo.status === "DONE");
  // const Status = Object.keys(statusss);
  const all = _.groupBy(data.alltodos, "status");
  // console.log(Status);

  const addNewTodo = async () => {
    try {
      await addNew({
        variables: { name, status },
        refetchQueries: [{ query: GET_TODOS }],
      });
    } catch (err) {
      console.error(err, "aldaa");
    }
  };
  const editTodo = async () => {
    try {
      await edittodo({
        variables: { name, status, id },
        refetchQueries: [{ query: GET_TODOS }],
      });
    } catch (err) {
      console.error(err, "aldaa");
    }
  };
  const deleteTodobutton = async () => {
    try {
      await deleteTodo({
        variables: { id },
        refetchQueries: [{ query: GET_TODOS }],
      });
    } catch (err) {
      console.error(err, "aldaa");
    }
  };
  console.log({ name, status });
  return (
    <div className="">
      <div>
        <Dialog>
          <DialogTrigger>
            <div className=" text-foreground">Todo нэмэх</div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Та шинэ todo нэмэх гэж байна</DialogTitle>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Нэр</Label>
                <Input onChange={(e) => setName(e.target.value)} id="name" />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Select onValueChange={(e) => setStatus(e)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Статусаа сонгоно уу!">
                      {status === "TODO"
                        ? "Төлөвлөж байгаа"
                        : "Одоо хийж байгаа"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">Төлөвлөж байгаа</SelectItem>
                    <SelectItem value="INPROGRESS">Одоо хийж байгаа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogClose asChild>
                <Button onClick={addNewTodo} disabled={!name || loading2}>
                  Нэмэх
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        {/* <div></div> */}
      </div>
      <div className="w-8/10 h-8/10 fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-800 flex justify-evenly items-center rounded-2xl">
        {STATUSES.map((type) => (
          <div
            key={type.name}
            className="w-[24%] h-9/10 bg-accent rounded-2xl shadow-2xl"
          >
            <div className="p-4 font-semibold">{type.name}</div>
            <div className="flex flex-col items-center justify-center gap-5 whitespace-pre-wrap">
              {all[type.status]?.length ? (
                all[type.status].map((ty: todo) => (
                  <Dialog key={ty.id}>
                    <DialogTrigger className=" border w-[78%] px-6 rounded-2xl shadow-lg">
                      <div
                        className=""
                        key={ty.id}
                        onClick={() => {
                          setId(ty.id);
                        }}
                      >
                        {ty.name}
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Todo засах</DialogTitle>
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="name">Нэр</Label>
                          <Input
                            defaultValue={ty.name}
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                          />
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                          <Select
                            defaultValue={ty.status}
                            onValueChange={(e) => setStatus(e)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Статусаа сонгоно уу!">
                                {status === "TODO"
                                  ? "Төлөвлөж байгаа"
                                  : "Одоо хийж байгаа"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((typ, i) => (
                                <SelectItem
                                  key={type.name + i}
                                  value={typ.status}
                                >
                                  {typ.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogClose asChild>
                          <div className="flex justify-between">
                            <Button
                              onClick={deleteTodobutton}
                              className="bg-red-500"
                            >
                              Устгах
                            </Button>
                            <Button onClick={editTodo} disabled={loading3}>
                              {loading3 ? "Уншиж байна!" : "Засах"}
                            </Button>
                          </div>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <div>Хоосон байн</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
