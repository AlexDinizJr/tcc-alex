export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 border border-gray-700">
      <div className="text-4xl text-blue-400 mb-4">{icon}</div>
      <h4 className="font-semibold text-white text-lg mb-2">{title}</h4>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
