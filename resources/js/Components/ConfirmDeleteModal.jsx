import { TrashIcon } from './AdminIcons';

export default function ConfirmDeleteModal({
    show,
    title,
    description,
    confirmLabel = 'Eliminar',
    processing = false,
    onCancel,
    onConfirm,
}) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-red-100 text-brand-red">
                        <TrashIcon className="h-5 w-5" />
                    </span>
                    <div>
                        <h3 className="font-bold text-brand-navy">{title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-full border-2 border-gray-300 px-5 py-2 font-semibold text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-full bg-brand-red px-5 py-2 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Eliminando...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
