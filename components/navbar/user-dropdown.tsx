'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';

export const UserDropdown = () => {
    const { data: session, status } = useSession();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
        queryClient.removeQueries({ queryKey: ['cart'] });
    };

    return (
        <div className="relative group">
            <div className="p-2.5 text-slate-600 group-hover:text-primary-900 rounded-full shadow-sm bg-white border border-slate-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer">
                <User className="w-5 h-5" />
            </div>

            <div className="absolute right-0 top-full pt-5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
                <div className="bg-white rounded-xl shadow-xl shadow-slate-900/5 border border-slate-100 p-1.5">
                    <ul className="flex flex-col text-sm font-medium text-slate-600">
                        {status === 'authenticated' && (
                            <>
                                <li>
                                    <Link href="/settings" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                                        Akun Saya
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/orders" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                                        Pesanan Saya
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/library" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                                        Library Saya
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                                        Dashboard
                                    </Link>
                                </li>
                            </>
                        )}

                        <div className="my-1 border-t border-slate-100" />

                        <li>
                            {status === 'authenticated' && session?.user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full text-left text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors font-medium cursor-pointer"
                                >
                                    Log Out
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex w-full text-left text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors font-medium"
                                >
                                    Log In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};