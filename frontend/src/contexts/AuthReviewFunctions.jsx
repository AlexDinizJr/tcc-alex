export const addOrUpdateReview = (mediaItem, rating, comment, user, updateUser) => {
  if (!user) return { success: false, error: "Usuário não autenticado" };
  
  const updatedUser = { ...user };
  const existingReviewIndex = updatedUser.reviews.findIndex(
    review => review.mediaId === mediaItem.id
  );
  
  if (existingReviewIndex >= 0) {
    updatedUser.reviews[existingReviewIndex] = {
      ...updatedUser.reviews[existingReviewIndex],
      rating,
      comment,
      date: new Date().toISOString()
    };
  } else {
    const newReview = {
      id: Date.now(),
      mediaId: mediaItem.id,
      userId: user.id,
      rating,
      comment,
      date: new Date().toISOString(),
      title: mediaItem.title
    };
    updatedUser.reviews = [...updatedUser.reviews, newReview];
  }
  
  updateUser(updatedUser);
  return { 
    success: true, 
    review: existingReviewIndex >= 0 
      ? updatedUser.reviews[existingReviewIndex] 
      : updatedUser.reviews[updatedUser.reviews.length - 1]
  };
};

export const getUserReview = (mediaId, user) => {
  if (!user) return null;
  return user.reviews.find(review => review.mediaId === mediaId) || null;
};

export const removeReview = (mediaId, user, updateUser) => {
  if (!user) return { success: false, error: "Usuário não autenticado" };
  
  const updatedUser = { ...user };
  updatedUser.reviews = updatedUser.reviews.filter(
    review => review.mediaId !== mediaId
  );
  
  updateUser(updatedUser);
  return { success: true };
};