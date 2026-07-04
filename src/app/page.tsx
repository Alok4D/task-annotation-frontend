import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect the root URL to the tasks dashboard
  redirect('/tasks');
}
