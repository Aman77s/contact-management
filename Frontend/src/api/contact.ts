import type { ParsedQs } from 'qs';
import instance from './axios';

type ContactInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  extra_fields?: ParsedQs;
};

export const getAllContacts = (search?: string) => instance.get('/contact', {params: search ? { search } : {},});
export const deleteContact = (id: number) => instance.delete(`/contact/${id}`);
export const createContact = (data: ContactInput) => instance.post('/contact', data);
export const updateContact = (id: number, data: ContactInput) => instance.put(`/contact/${id}`, data);
export const importContact = (file : File) => {
  const  formData = new FormData()

  formData.append('file', file)
  return instance.post('/contact/import', formData, {
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })

}

