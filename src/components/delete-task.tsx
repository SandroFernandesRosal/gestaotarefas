'use client'

import { useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation'

const DeleteTask = ({ id }: { id: string }) => {
  const [error, setError] = useState('');
  const token = Cookie.get('token');
  const [success, setSuccess] = useState('');
  const router = useRouter()

  const handleDeleteTask = async () => {
    try {
      if (!token) {
        setError('Você precisa estar logado como administrador!');
        return;
      }

      const response = await fetch(`/api/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await response.json();

      if (response.ok) {
        setSuccess('Tarefa excluída com sucesso!');
        router.push('/')
        window.location.href = '/'
        
      }
    } catch {
      setError('Erro de comunicação com a API');
    }
  };

  return (
    <>
      {success !== '' && <p className="text-green-500">{success}</p>}
      {error !== '' && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleDeleteTask}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Deletar
      </button>
    </>
  );
};

export default DeleteTask;
