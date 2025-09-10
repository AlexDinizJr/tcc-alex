import { mockUsers } from "../mockdata/mockUsers";

/**
 * Simula login de usuário
 * @param {Object} param0 { email, password }
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function loginUser({ email, password }) {
  await new Promise((res) => setTimeout(res, 300));

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (user) {
    const { ...userData } = user;
    return { success: true, user: userData };
  } else {
    return { success: false, error: "E-mail ou senha incorretos" };
  }
}

/**
 * Simula recuperação de senha
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function recoverPassword(email) {
  await new Promise((res) => setTimeout(res, 300));

  const userExists = mockUsers.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!userExists) {
    return;
  }
  return;
}

/**
 * Simula cadastro de usuário
 * @param {Object} userData
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function signupUser(userData) {
  await new Promise((res) => setTimeout(res, 300));

  const exists = mockUsers.some(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (exists) {
    return { success: false, error: "E-mail já cadastrado" };
  }

  const newUser = {
    id: Date.now(),
    ...userData,
  };

  mockUsers.push(newUser);
  const { ...publicUser } = newUser;
  return { success: true, user: publicUser };
}
