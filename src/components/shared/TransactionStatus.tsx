// const TransactionStatus = ({ hash, status }: { hash: string; status: 'pending' | 'success' | 'error' }) => {
//   return (
//     <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900">
//       <div className={`
//         w-2 h-2 rounded-full
//         ${status === 'pending' && 'animate-pulse bg-yellow-500'}
//         ${status === 'success' && 'bg-green-500'}
//         ${status === 'error' && 'bg-red-500'}
//       `} />
//       <span className="text-sm text-gray-400 font-mono">{hash}</span>
//     </div>
//   );
// };