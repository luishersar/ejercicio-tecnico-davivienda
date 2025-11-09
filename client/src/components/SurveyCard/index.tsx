// src/components/SurveyCard/index.jsx

export default function SurveyCard({ title, responses, onEdit, onStats, onDelete }: {
    title: string,
    responses: any,
onEdit: any,
onStats: any,
onDelete: any,
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      <p className="text-sm text-gray-500">
        {responses} respuesta{responses !== 1 ? "s" : ""}
      </p>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Editar
        </button>

        <button
          onClick={onStats}
          className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition"
        >
          Ver estadísticas
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
