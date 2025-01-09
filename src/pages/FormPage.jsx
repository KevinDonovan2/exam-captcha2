import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const FormPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const n = parseInt(data.number, 10);
    if (n >= 1 && n <= 1000) {
      navigate(`/sequence/${n}`);
    } else {
      alert('Veuillez entrer un nombre entre 1 et 1000.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Entrer un nombre</h1>
      <div className="mb-4">
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">
          Nombre (1-1000) :
        </label>
        <input
          id="number"
          type="number"
          {...register('number', { required: true, min: 1, max: 1000 })}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Soumettre
      </button>
    </form>
  );
};

export default FormPage;
