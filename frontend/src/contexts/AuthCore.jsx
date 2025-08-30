import { MOCK_LISTS } from "../mockdata/mockLists";
import { MOCK_REVIEWS } from "../mockdata/mockReviews";

export const initializeUser = (storedUser, mockUsers) => {
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    const updatedUser = convertLegacyUserStructure(userData);
    ensureUserDataCompleteness(updatedUser);
    return updatedUser;
  } else {
    return createNewUser(mockUsers);
  }
};

export const ensureUserDataCompleteness = (userData) => {
  if (!userData.lists || userData.lists.length === 0) {
    userData.lists = MOCK_LISTS.filter(list => list.userId === userData.id);
  }
  if (!userData.reviews || userData.reviews.length === 0) {
    userData.reviews = MOCK_REVIEWS.filter(review => review.userId === userData.id);
  }
  if (!userData.savedMedia) userData.savedMedia = [];
  if (!userData.favorites) userData.favorites = [];
  if (!userData.bio) userData.bio = '';
};

export const createNewUser = (mockUsers) => {
  const defaultUser = mockUsers[0];
  return {
    ...defaultUser,
    lists: MOCK_LISTS.filter(list => list.userId === defaultUser.id),
    reviews: MOCK_REVIEWS.filter(review => review.userId === defaultUser.id),
    password: undefined
  };
};

export const convertLegacyUserStructure = (userData) => {
  let reviews = userData.reviews;
  if (reviews && typeof reviews === 'object' && !Array.isArray(reviews)) {
    reviews = Object.entries(reviews).map(([mediaId, rating]) => ({
      id: Date.now() + parseInt(mediaId),
      mediaId: parseInt(mediaId),
      userId: userData.id,
      rating: rating,
      comment: "",
      date: new Date().toISOString()
    }));
  }

  let lists = userData.lists;
  if (lists && Array.isArray(lists)) {
    lists = lists.map(list => ({
      ...list,
    }));
  }

  return {
    ...userData,
    reviews: reviews || [],
    lists: lists || [],
    savedMedia: userData.savedMedia || [],
    favorites: userData.favorites || [],
    bio: userData.bio || ''
  };
};