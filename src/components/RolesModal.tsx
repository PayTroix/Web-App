import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface RolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    userType: 'recipient' | 'organization' | 'both' | null;
}

export default function RolesModal({ isOpen, onClose, userType }: RolesModalProps) {
    const router = useRouter();

    const handleRoleSelect = (roleType: string) => {
        if (userType === 'recipient' && roleType === 'organization') {
            toast.error('You do not have access to the organization dashboard');
            return;
        }
        if (userType === 'organization' && roleType === 'recipient') {
            toast.error('You do not have access to the recipient dashboard');
            return;
        }

        if (roleType === 'organization') {
            router.push('/dashboard');
        } else {
            router.push('/recipient');
        }
        onClose();
    };

    const roles = [
        {
            id: 'organization',
            name: 'Organization',
            description: 'Create and manage your organization, handle payroll, and manage recipients',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            ),
            disabled: userType === 'recipient'
        },
        {
            id: 'recipient',
            name: 'Recipient',
            description: 'View your payment history and manage your wallet settings',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            ),
            disabled: userType === 'organization'
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-[#111827] rounded-2xl p-8 max-w-3xl w-full mx-4">
                            {/* Header */}
                            <div className="text-center space-y-4 mb-8">
                                <h2 className="text-3xl font-bold text-white">
                                    Choose Your Role
                                </h2>
                                <p className="text-gray-400">
                                    Select how you want to use Paytriox
                                </p>
                            </div>

                            {/* Role Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {roles.map((role) => (
                                    <motion.button
                                        key={role.id}
                                        onClick={() => !role.disabled && handleRoleSelect(role.id)}
                                        whileHover={!role.disabled ? { scale: 1.02 } : {}}
                                        whileTap={!role.disabled ? { scale: 0.98 } : {}}
                                        className={`group relative p-8 rounded-2xl border-2 w-full
                      ${role.disabled
                                                ? 'border-gray-700 opacity-50 cursor-not-allowed'
                                                : 'border-[#2C2C2C] hover:border-blue-500/50 cursor-pointer'
                                            } bg-[#111827] transition-all duration-300`}
                                    >
                                        <div className={`mb-6 ${!role.disabled && 'group-hover:text-blue-400'} text-gray-400`}>
                                            {role.icon}
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-3 text-white">
                                            {role.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {role.description}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}