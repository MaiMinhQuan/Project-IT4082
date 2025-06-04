import { toast } from 'react-toastify';

export const notification = {
  success: (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      style: { marginTop: 60 },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      style: { marginTop: 60 },
    });
  },
  warning: (message: string) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 3000,
      style: { marginTop: 60 },
    });
  },
  info: (message: string) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      style: { marginTop: 60 },
    });
  },
};
