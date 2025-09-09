import { FaStar } from "react-icons/fa";

export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-300 text-center py-8">
        Nenhuma avaliação ainda. Seja o primeiro a avaliar!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-700 pb-6 last:border-b-0 bg-gray-900 p-4 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {review.user.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-100">{review.user}</h4>
                <p className="text-sm text-gray-400">{review.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <FaStar />
              <span className="font-semibold text-gray-100">{review.rating}</span>
            </div>
          </div>
          <p className="text-gray-300">{review.comment}</p>
          {review.helpful !== undefined && (
            <div className="mt-3 text-sm text-gray-400">
              {review.helpful} pessoa(s) acharam esta avaliação útil
            </div>
          )}
        </div>
      ))}
    </div>
  );
}