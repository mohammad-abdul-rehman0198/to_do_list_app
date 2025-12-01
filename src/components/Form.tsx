import { useEffect, useState, useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { Todo } from "@/utils/Interfaces/Todo";
import type { FormData } from "@/utils/Interfaces/FormData";
import { FormSchema } from "@/utils/ValidationSchemas/FormSchema";
import { TodoContext } from "@/context/TodoContext";
import addIcon from "@/assets/icons/add.svg";

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      taskName: "",
    },
  });
  const context = useContext(TodoContext);
  const { todos, setTodos } = context || { todos: [], setTodos: () => {} };
  const [todosSize, setTodosSize] = useState();

  useEffect(() => {
    const fetchTodosSize = () => {
      try {
        const todos = localStorage.getItem("todos") || "[]";
        const parsedTodos = JSON.parse(todos);
        setTodosSize(parsedTodos.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodosSize();
  }, [todos]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      const stored = localStorage.getItem("todos") || "[]";
      const parsedTodos: Todo[] = JSON.parse(stored);
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        taskName: data.taskName,
        isCompleted: false,
      };
      const updatedTodos = [...parsedTodos, newTodo];
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    } catch (error) {
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[70%] max-[510px]:w-[90%] flex items-center gap-3 border-none mt-[38px] mb-5 rounded-[11px] max-w-[455px]"
      >
        <input
          type="text"
          placeholder="Write your next task"
          {...register("taskName")}
          className="w-full bg-[#1f2937] text-white p-3 rounded-[11px] outline-none border-none placeholder:text-sm"
        />

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className=" bg-[#88ab33] border-none cursor-pointer rounded-[11px] py-3 px-2  flex items-center justify-center"
        >
          {isSubmitting ? (
            "Adding..."
          ) : (
            <img src={addIcon} alt="add" className="w-full h-full" />
          )}
        </button>
      </form>

      {errors.taskName && (
        <p className="text-red-500 mt-1 text-sm">{errors.taskName.message}</p>
      )}
      {todosSize === 0 && (
        <div className="w-[70%] max-[510px]:w-[90%] flex flex-col items-center justify-center">
          <p className="text-[16px]">
            Seems lonely in here, what are you up to?
          </p>
        </div>
      )}
    </>
  );
};

export default Form;
