import { MOCK_LISTS } from "../mockdata/mockLists";
import { MOCK_REVIEWS } from "../mockdata/mockReviews";

export const loginUser = (userData, setUser) => {
  const userWithCompleteStructure = {
    ...userData,
    bio: userData.bio || '',
    savedMedia: userData.savedMedia || [],
    lists: userData.lists || MOCK_LISTS.filter(list => list.userId === userData.id),
    reviews: userData.reviews || MOCK_REVIEWS.filter(review => review.userId === userData.id),
    favorites: userData.favorites || []
  };
  
  setUser(userWithCompleteStructure);
  localStorage.setItem('user', JSON.stringify(userWithCompleteStructure));
};

export const mockLoginUser = (credentials, mockUsers, login) => {
  const user = mockUsers.find(u => 
    u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    const userWithCompleteData = {
      ...user,
      lists: MOCK_LISTS.filter(list => list.userId === user.id),
      reviews: MOCK_REVIEWS.filter(review => review.userId === user.id)
    };
    
    const { ...userWithoutPassword } = userWithCompleteData;
    login(userWithoutPassword);
    return { success: true, user: userWithoutPassword };
  } else {
    return { success: false, error: 'Credenciais inválidas' };
  }
};

export const logoutUser = (setUser) => {
  setUser(null);
  localStorage.removeItem('user');
};