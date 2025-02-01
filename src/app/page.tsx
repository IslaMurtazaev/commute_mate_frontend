import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RidesList from '../components/rides-list';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) {
    redirect('/login');
  }

  return <RidesList />;
}
