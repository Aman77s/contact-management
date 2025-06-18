import { useEffect, useState } from 'react';
import { getAllContacts, deleteContact } from '../api/contact';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  extra_fields?: Record<string, string>;
}

const Dashboard = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
    fetchContacts();
  }, []);

  const fetchContacts = async (searchTerm = '') => {
    try {
      const res = await getAllContacts(searchTerm);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    doc.text('My Contacts', 14, 20 )

  const tableRows = contacts.map((contact, index) => {
      const extra_fields = contact.extra_fields && Object.keys(contact.extra_fields).length > 0
    ? Object.entries(contact.extra_fields)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    : '—';
    return [
        index + 1,
    contact.name,
    contact.email,
    contact.phone,
    contact.address,
   extra_fields
    ]

  })

   


    autoTable(doc, {
    head: [['#', 'Name', 'Email', 'Phone', 'Address', 'Extra Fields']],
    body: tableRows,
    startY: 30,
  });

  doc.save('contacts.pdf');

  }

  const handleDelete = async (id: number) => {
    try {
      await deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
      toast.success('Contact Delete Successfully')
    } catch (err) {
      toast.error('Faild to delete Contact')
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts(search);
  };

 

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Contacts</h2>
         <div className="space-x-2">

      <button
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
             onClick={()=> navigate('/import')}
    >
      Import Contact
    </button>

        <button
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      onClick={handleDownloadPdf}
    >
      Download PDF
    </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate('/contact/create')}
        >
          Add New Contact
        </button>
        </div>
      </div>

      {/* 🔍 Search Form */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* 📋 Contact Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Phone</th>
            <th className="text-left px-4 py-2">Address</th>
            <th className="text-left px-4 py-2 text-center">Extra Field</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id} className="border-t">
              <td className="px-4 py-2">{contact.name}</td>
              <td className="px-4 py-2">{contact.email}</td>
              <td className="px-4 py-2">{contact.phone}</td>
              <td className="px-4 py-2">{contact.address}</td>
<td className="px-4 py-2 text-center">          
{contact.extra_fields && Object.keys(contact.extra_fields).length > 0 ? (
  <ul className="list-disc pl-4 space-y-1">
    {Object.entries(contact.extra_fields).map(([key, value]) => (
      <li key={key}>
        <span className="font-semibold capitalize">{key}:</span> {value}
      </li>
    ))}
  </ul>
) : (
              "—"
)}
</td>


              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => navigate(`/edit/${contact.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
