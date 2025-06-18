import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateContact } from '../api/contact';
import axios from '../api/axios'; 
import toast from 'react-hot-toast';
import qs from 'qs';


interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
  extra_fields: string;

}

const EditContact = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Contact>({
    name: '',
    email: '',
    phone: '',
    address: '',
    extra_fields: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the contact to edit
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`/contact/${id}`); 
        const contactData = res.data;

        setForm({
          ...contactData,
          extra_fields: contactData.extra_fields
          ? qs.stringify(contactData.extra_fields)
          : '',
        });

      } catch (err) {
        console.error(err);
        setError('Failed to load contact');
      }
    };
    fetchContact();
  }, [id]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit updated contact using updateContact()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        
        const formattedData = {
      ...form,
      extra_fields: form.extra_fields
      ? qs.parse(form.extra_fields)
      : undefined
    };


      await updateContact(Number(id), formattedData); 
      navigate('/');
      toast.success('Contact update Successfully')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
      toast.error('Faild to update Contact')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Contact</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

                <div>
          <label className="block text-sm font-medium text-gray-700">Extra Field</label>
          <textarea
            name="extra_fields"
            value={form.extra_fields}
            onChange={handleChange}
            rows={2}
            placeholder='Use this type of syntax for adding multiple fields age=23&work=student'
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {loading ? 'Updating...' : 'Update Contact'}
        </button>
      </form>
    </div>
  );
};

export default EditContact;
