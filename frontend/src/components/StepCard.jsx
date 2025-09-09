export default function StepCard({ number, title, description }) {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-2xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
        {number}
      </div>
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}