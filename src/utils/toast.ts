import toast, { type ToastOptions } from 'react-hot-toast';

type CustomToastOptions = ToastOptions & {
  success?: {
    style?: React.CSSProperties;
  };
  error?: {
    style?: React.CSSProperties;
  };
  loading?: {
    style?: React.CSSProperties;
  };
};

export const toastConfig: CustomToastOptions = {
  duration: 5000,
  position: 'top-right',
  style: {
    background: '#1A1A1A',
    color: '#fff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #2C2C2C',
  },
  success: {
    style: {
      border: '1px solid #059669',
    },
  },
  error: {
    style: {
      border: '1px solid #DC2626',
    },
  },
  loading: {
    style: {
      border: '1px solid #2563EB',
    },
  },
};

export const showToast = {
  success: (message: string) => 
    toast.success(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        ...(toastConfig.success?.style || {}),
      },
    }),
  
  error: (message: string) =>
    toast.error(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        ...(toastConfig.error?.style || {}),
      },
    }),
  
  loading: (message: string) =>
    toast.loading(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        ...(toastConfig.loading?.style || {}),
      },
    })
};