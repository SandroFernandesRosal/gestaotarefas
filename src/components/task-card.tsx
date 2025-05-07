
import React from 'react';
import EditTask from './edit-task';
import DeleteTask from './delete-task';
import Cookie from 'js-cookie';

interface TaskCardProps {
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  id: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description, status, id }) => {
  const token = Cookie.get('token');
  const statusColor = {
    PENDING: 'bg-yellow-200',
    IN_PROGRESS: 'bg-blue-300',
    COMPLETED: 'bg-green-300',
  };

  return (
    <div className={`bg-white text-black p-4 rounded-lg shadow-md bg-${statusColor[status]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-2 flex items-center justify-center">
        <span className={`  border-[1px] border-zinc-400  px-3 py-1 text-sm font-semibold rounded-full ${statusColor[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      {token && 
      <div className='flex justify-center gap-4 pt-3'>
        <EditTask taskId={id} currentDescription={description} currentTitle={title} currentStatus={status}/> <DeleteTask id={id}/>
      </div>}
      
    </div>
  );
};

export default TaskCard;
