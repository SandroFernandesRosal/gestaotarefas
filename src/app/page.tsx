'use client'
import { useState, useEffect } from 'react';
import TaskCard from '@/components/task-card';
import AddTask from '@/components/add-task';
import Cookie from 'js-cookie';


interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('all');
  const token = Cookie.get('token');

  
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tarefas') 
      const data = await response.json();
      setTasks(data); 
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  
  useEffect(() => {
    fetchTasks();
  }, []);

  
  const filteredTasks = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className="min-h-screen bg-zinc-300 py-8 px-4 text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Gestão de tarefas</h1>

      {token && <AddTask />}
        
        <div className="mb-4 text-center flex flex-wrap justify-center gap-3">
          <button
            className="bg-white px-4 py-2  rounded-full cursor-pointer border-[1px] border-zinc-400"
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className="bg-yellow-200 px-4 py-2  rounded-full cursor-pointer border-[1px] border-zinc-400"
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className="bg-blue-200 px-4 py-2  rounded-full cursor-pointer border-[1px] border-zinc-400"
            onClick={() => setFilter('IN_PROGRESS')}
          >
            In Progress
          </button>
          <button
            className="bg-green-200 px-4 py-2  rounded-full cursor-pointer border-[1px] border-zinc-400"
            onClick={() => setFilter('COMPLETED')}
          >
            Completed
          </button>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              id={task.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
