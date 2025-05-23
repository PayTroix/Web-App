import { LeaveRequest } from '@/services/api';
import { ArrowLeft } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

interface LeaveRequestModalProps {
    request: LeaveRequest;
    onClose: () => void;
    onApprove: (id: number) => Promise<void>;
    onDecline: (id: number) => Promise<void>;
    onActionComplete: () => void; // Add this new prop
}

export default function LeaveRequestModal({ request, onClose, onApprove, onDecline, onActionComplete }: LeaveRequestModalProps) {
    const [isActionLoading, setIsActionLoading] = useState(false);
    const totalDays = differenceInDays(new Date(request.end_date), new Date(request.start_date));

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop with blur effect */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative flex items-center justify-center min-h-screen p-4">
                <div className="bg-[#111111] border border-[#333333] rounded-lg p-8 max-w-4xl w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <button
                                onClick={onClose}
                                className="mr-4 text-white hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-2xl font-semibold text-white">Leave Request</h1>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-300">Date Submitted</span>
                            <span className="ml-4 text-white font-medium">
                                {format(new Date(request.created_at), 'MMM dd, yyyy')}
                            </span>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="mb-8 bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                        <div className="flex items-center">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                                <div className="absolute inset-0 bg-blue-600 rounded-full">
                                    <div className="w-full h-full relative flex items-center justify-center text-white text-2xl font-bold">
                                        {request.recipient.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {request.recipient.name}
                                    </h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'approved'
                                        ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                                        : request.status === 'rejected'
                                            ? 'bg-red-400/10 text-red-400 border border-red-400/20'
                                            : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                        }`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="border-t border-[#333333] py-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium mb-2">Position</p>
                                    <p className="text-white text-lg">{request.recipient.position}</p>
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium mb-2">Leave Type</p>
                                    <p className="text-white text-lg capitalize">{request.leave_type}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium mb-2">Total Days</p>
                                    <p className="text-white text-lg">{totalDays} Working Days</p>
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium mb-2">Date Range</p>
                                    <p className="text-white text-lg">
                                        {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reason Section */}
                    <div className="border-t border-[#333333] py-6 mb-8">
                        <p className="text-gray-300 text-sm font-medium mb-3">Reason for Leave</p>
                        <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                            <p className="text-white leading-relaxed">
                                {request.reason}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    {request.status === 'pending' && (
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={async () => {
                                    setIsActionLoading(true);
                                    try {
                                        await onDecline(request.id);
                                        onActionComplete();
                                        onClose();
                                    } finally {
                                        setIsActionLoading(false);
                                    }
                                }}
                                disabled={isActionLoading}
                                className="px-6 py-3 rounded-lg border border-[#333333] text-white hover:bg-[#1A1A1A] 
                                         transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Decline
                            </button>
                            <button
                                onClick={async () => {
                                    setIsActionLoading(true);
                                    try {
                                        await onApprove(request.id);
                                        onActionComplete();
                                        onClose();
                                    } finally {
                                        setIsActionLoading(false);
                                    }
                                }}
                                disabled={isActionLoading}
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 
                                         transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed
                                         flex items-center gap-2 min-w-[100px] justify-center"
                            >
                                {isActionLoading ? (
                                    <div className="scale-[0.35]">
                                        <LoadingSpinner className="!h-4 !w-4" />
                                    </div>
                                ) : (
                                    "Approve"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}