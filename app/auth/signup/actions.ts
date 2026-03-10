// app/(auth)/register/actions.ts
'use server';

import { container } from '@/di/container';
import { redirect } from 'next/navigation';

export async function registerAction(formData: FormData) {
  const input = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const useCase = container.registerUserUseCase();
  const result = await useCase.execute(input);

  if (!result.success) {
    // In real app: return { error: result.error } and show on form
    return { error: result.error };
  }

  // Success → redirect to login or dashboard
  // You can also auto-sign-in here with signIn('credentials', ...)
  redirect('/login?registered=true');
}