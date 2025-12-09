import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, updateClient } from '../../store/clientsSlice';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

// Validation schema
const clientSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  company: yup.string(),
  address: yup.string(),
  website: yup.string().url('Must be a valid URL'),
});

function ClientFormModal({ isOpen, onClose, client = null }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.clients);
  
  const isEditMode =!!client;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: client || {},
  });

  useEffect(() => {
    if (client) {
      reset(client);
    } else {
      reset({});
    }
  }, [client, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await dispatch(updateClient({ id: client.id, data })).unwrap();
        toast.success('Client updated successfully');
      } else {
        await dispatch(createClient(data)).unwrap();
        toast.success('Client created successfully');
      }
      onClose();
      reset();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Client' : 'Add New Client'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          required
        />

        <Input
          label="Phone"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Input
          label="Company"
          {...register('company')}
          error={errors.company?.message}
        />

        <Input
          label="Address"
          {...register('address')}
          error={errors.address?.message}
        />

        <Input
          label="Website"
          type="url"
          {...register('website')}
          error={errors.website?.message}
          helperText="e.g., https://example.com"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {isEditMode ? 'Update Client' : 'Create Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ClientFormModal;
