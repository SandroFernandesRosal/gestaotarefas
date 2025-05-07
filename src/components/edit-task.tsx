'use client'

import { useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation'

interface EditTaskProps {
  taskId: string;
  currentTitle: string;
  currentDescription: string;
  currentStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const EditTask = ({ taskId, currentTitle, currentDescription, currentStatus }: EditTaskProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [status, setStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>(currentStatus);
  const [error, setError] = useState('');
  
  const [success, setSuccess] = useState('');
  const token = Cookie.get('token');
  const router = useRouter()

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEditTask = async () => {
    try {
      if (!token) {
        setError('Você precisa estar logado como administrador!');
        return;
      }

      const response = await fetch(`/api/tarefas/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Tarefa atualizada com sucesso!');
        closeModal();
        router.push('/')
        window.location.href = '/'
      } else {
        setError(data.error || 'Erro ao atualizar tarefa');
      }
    } catch {
      setError('Erro de comunicação com a API');
    }
  };

  return (
    <div>
      <button onClick={openModal} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Editar</button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-5">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Editar Tarefa</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-4" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-4" />
            <select value={status} onChange={(e) => setStatus(e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED')} className="w-full p-2 border rounded mb-4">
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em Progresso</option>
              <option value="COMPLETED">Concluída</option>
            </select>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-between">
              {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            </div>
            <div className="flex justify-between">
              <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button onClick={handleEditTask} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;
