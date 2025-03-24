import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RideRequestForm from './rideRequestForm';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) {
    redirect('/login');
  }

  return <RideRequestForm token={token.value} />;
}

