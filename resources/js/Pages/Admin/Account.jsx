import AdminLayout from '../../Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from '../Profile/Partials/UpdatePasswordForm';

export default function Account() {
    const { auth } = usePage().props;

    return (
        <AdminLayout>
            <Head title="Gestionar cuenta" />

            <h1 className="text-2xl font-bold text-brand-navy">Gestionar cuenta</h1>
            <p className="mt-1 text-gray-600">Administra los datos de acceso de tu cuenta.</p>

            <div className="mt-6 max-w-xl space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Cuenta
                    </h2>
                    <p className="mt-2 font-medium text-brand-navy">{auth.user.name}</p>
                    <p className="text-sm text-gray-600">{auth.user.email}</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                    <UpdatePasswordForm />
                </div>
            </div>
        </AdminLayout>
    );
}
