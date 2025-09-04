import { mockUsers } from "../mockdata/mockUsers";
import UserCard from "../components/UserCard";

export default function Users() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuários</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
