export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8">
        Nenhuma avaliação ainda. Seja o primeiro a avaliar!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {review.user.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{review.user}</h4>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 font-semibold">⭐</span>
              <span className="font-semibold">{review.rating}</span>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          {review.helpful !== undefined && (
            <div className="mt-3 text-sm text-gray-500">
              {review.helpful} pessoa(s) acharam esta avaliação útil
            </div>
          )}
        </div>
      ))}
    </div>
  );
}