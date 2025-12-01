import { useState } from "react";

import Form from "@/components/Form";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Todos from "@/components/Todos";
import { TodoContext } from "@/context/TodoContext";
import type { Todo } from "@/utils/Interfaces/Todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      <div className="w-full bg-black h-screen overflow-y-auto text-white flex flex-col items-center">
        <Header />
        <HeroSection />
        <Form />
        <Todos />
      </div>
    </TodoContext.Provider>
  );
}

export default App;
