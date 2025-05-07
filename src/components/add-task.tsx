'use client'
import { useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation'

const AddTask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla a abertura do modal
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = Cookie.get('token'); // Pega o token do cookie
  const router = useRouter()

  // Função para abrir o modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para enviar a tarefa para a API
  const handleAddTask = async () => {
    try {
      

      if (!token) {
        setError('Você precisa estar logado como administrador!');
        return;
      }

      const response = await fetch('/api/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
        }),
       
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Tarefa criada com sucesso!');
        router.push('/')
        window.location.href = '/'
        
        closeModal(); // Fecha o modal após sucesso
      } else {
        setError(data.error || 'Erro ao criar tarefa');
       
      }
    } catch {
      setError('Erro de comunicação com a API');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pb-5">
      
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Adicionar Tarefa
        </button>
     

      {/* Mensagens de erro ou sucesso */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-5">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Adicionar Tarefa</h2>

            {/* Formulário do modal */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED')}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="IN_PROGRESS">Em progresso</option>
                  <option value="COMPLETED">Concluída</option>
                </select>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Adicionar Tarefa
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;
