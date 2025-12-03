import { useEffect, useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { Todo } from "@/utils/Interfaces/Todo";
import type { FormData } from "@/utils/Interfaces/FormData";
import { FormSchema } from "@/utils/ValidationSchemas/FormSchema";
import { TodoContext } from "@/context/TodoContext";
import editIcon from "@/assets/icons/edit.svg";
import deleteIcon from "@/assets/icons/delete.svg";
import circleIcon from "@/assets/icons/circle.svg";
import filledCircleIcon from "@/assets/icons/filledCircle.svg";

const Todos = () => {
  const editRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue } = useForm<FormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });
  const context = useContext(TodoContext);
  const { todos, setTodos } = context || { todos: [], setTodos: () => {} };
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos") || "[]";
    setTodos(JSON.parse(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editTodo) {
      setValue("taskName", editTodo.taskName);
    }
  }, [editTodo, setValue]);

  const handleCompleteTodo = (id: string) => {
    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo: Todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
    setIsEditing(true);
  };

  const handleSaveEditTodo = (data: FormData) => {
    if (!isEditing) return;
    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === editTodo?.id) {
        return { ...todo, taskName: data.taskName };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setEditTodo(null);
    setIsEditing(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        editRef.current &&
        !editRef.current.contains(e.target as HTMLElement)
      ) {
        handleSubmit(handleSaveEditTodo)();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRef, editTodo]);

  return (
    <ol className="w-[70%] max-[510px]:w-[90%] max-w-[455px] space-y-[27px]">
      {todos.map((todo: Todo) => (
        <li
          key={todo.id}
          className="w-full text-[1rem] text-white flex justify-between items-center border border-[#c2b39a] p-3"
        >
          {(isEditing && editTodo?.id) === todo.id ? (
            <form
              onSubmit={handleSubmit(handleSaveEditTodo)}
              className="w-full"
            >
              <div ref={editRef} className="w-full">
                <input
                  type="text"
                  {...register("taskName")}
                  className="w-full bg-transparent border-none outline-none ring-0"
                />
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {todo.isCompleted ? (
                  <img
                    onClick={() => handleCompleteTodo(todo.id)}
                    src={filledCircleIcon}
                    alt="filledCircle"
                    className="cursor-pointer"
                  />
                ) : (
                  <img
                    onClick={() => handleCompleteTodo(todo.id)}
                    src={circleIcon}
                    alt="circle"
                    className="cursor-pointer"
                  />
                )}
                <p className={`${todo.isCompleted ? "line-through " : ""}`}>
                  {todo.taskName.length > 35
                    ? todo.taskName.slice(0, 35) + "..."
                    : todo.taskName}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button>
                  <img
                    src={editIcon}
                    alt="edit"
                    onClick={() => handleEditTodo(todo)}
                    className="cursor-pointer"
                  />
                </button>
                <button>
                  <img
                    src={deleteIcon}
                    alt="delete"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="cursor-pointer"
                  />
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Todos;
