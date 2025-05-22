import { LeaveRequest } from '@/services/api';
import { ArrowLeft } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

interface LeaveRequestModalProps {
    request: LeaveRequest;
    onClose: () => void;
    onApprove: (id: number) => void;
    onDecline: (id: number) => void;
}

export default function LeaveRequestModal({ request, onClose, onApprove, onDecline }: LeaveRequestModalProps) {
    const totalDays = differenceInDays(new Date(request.end_date), new Date(request.start_date));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black border border-neutral-800 rounded-lg p-8 max-w-4xl w-full m-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 mt-6">
                    <div className="flex items-center">
                        <button onClick={onClose} className="mr-4">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-medium">Recipient Leave</h1>
                    </div>
                    <div className="text-gray-400 text-sm">
                        <span>Date Submitted</span>
                        <span className="ml-4">{format(new Date(request.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="mb-8">
                    <div className="">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                            <div className="absolute inset-0 bg-gray-600 rounded-full">
                                <div className="w-full h-full relative flex items-center justify-center bg-blue-600 text-white text-2xl font-bold">
                                    {request.recipient.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center mt-4">
                                <h2 className="text-2xl font-medium mr-3">{request.recipient.name}</h2>
                                <span className={`text-sm -mb-2 ${request.status === 'approved' ? 'text-green-500' :
                                    request.status === 'rejected' ? 'text-red-500' :
                                        'text-yellow-500'
                                    }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="border-t border-gray-800 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-4">
                                <p className="text-gray-400 text-sm mb-1">Position</p>
                                <p>{request.recipient.position}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Leave Type</p>
                                <div className="flex items-center">
                                    <p className="capitalize">{request.leave_type}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <p className="text-gray-400 text-sm mb-1">Total Days</p>
                                <p>{totalDays} Working Days</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Date Range</p>
                                <p>
                                    {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reason Section */}
                <div className="border-t border-gray-800 pb-4 pt-8 mb-8">
                    <p className="text-gray-400 text-sm mb-2">Reason for Leave</p>
                    <p className="italic text-gray-300">
                        {request.reason}
                    </p>
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                    <div className="flex justify-end mt-20">
                        <button
                            onClick={() => onDecline(request.id)}
                            className="px-6 py-2 rounded-md mr-4 border border-gray-700 hover:bg-gray-800"
                        >
                            Decline
                        </button>
                        <button
                            onClick={() => onApprove(request.id)}
                            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}