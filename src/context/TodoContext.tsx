import { createContext } from "react";

import type { Todo } from "@/utils/Interfaces/Todo";

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoContext = createContext<TodoContextType | null>(null);

export { TodoContext };
