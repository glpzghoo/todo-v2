"use client";
import { Button } from "@/components/ui/button";
import SetCookieButton from "./components/setCookieButton";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Login from "./login/page";
import GETJWT from "./components/server_action/getUserInfo";
import Loading from "./components/loading";
import { Snackbar } from "@mui/material";
import Card from "./components/card";
import { useRouter } from "next/navigation";
import _ from "lodash";
// const allUsers = gql`
//   query allUsers {
//     users {
//       message
//       code
//       success
//       users {
//         id
//         username
//         todo {
//           id
//           description
//           isDone
//           priority
//           taskName
//         }
//       }
//     }
//   }
// `;
const USER_TODO = gql`
  mutation Mutation($jwt: String!) {
    userTodo(jwt: $jwt) {
      message
      success
      todos {
        description
        id
        isDone
        priority
        tag {
          name
          id
        }
        taskName
      }
      user {
        username
        id
      }
    }
  }
`;
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
export default function Home() {
  const [userTodo, { error, loading }] = useMutation(USER_TODO);
  const [alert, setAlert] = useState(false);
  const router = useRouter();
  const [isUserLoggedin, setIsUserLoggedIn] = useState(false);
  const [response, setResponse] = useState<Response>();
  const [todos, setTodos] = useState<todo[]>();

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
        const sort = _.sortBy(todos, "isDone");
        setResponse(res.data);
        setTodos(sort);
      } catch (err) {
        console.error(err);
      } finally {
        setAlert(true);
      }
    };
    checking();
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  console.log(response);
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
        <div className="min-h-screen bg-secondary w-full flex flex-col items-center p-10">
          <div className="bg-background">
            <div className="p-7">
              <div> Тавтай морил </div>
              <span className=" font-bold text-xl">
                {response?.userTodo.user.username}
              </span>
            </div>
            <div className="flex flex-wrap justify-center h-1/2 gap-4 p-7">
              {todos?.map((todo) => (
                <Card key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
