import { create } from 'zustand';

// Initial Mock Data
const initialDocuments = [
  {
    id: 'doc-1',
    type: 'KTP',
    category: 'Identitas',
    description: 'KTP Asli',
    url: 'https://images.unsplash.com/photo-1620601951563-149eb5681156?q=80&w=600&auto=format&fit=crop', // Dummy placeholder
    status: 'Verified',
    uploadDate: '2023-01-15T10:00:00Z',
    validityPeriod: 'Seumur Hidup',
  },
  {
    id: 'doc-2',
    type: 'Kartu Keluarga',
    category: 'Identitas',
    description: 'KK Terbaru',
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
    status: 'Verified',
    uploadDate: '2023-01-15T10:30:00Z',
    validityPeriod: 'Seumur Hidup',
  },
  {
    id: 'doc-3',
    type: 'SK CPNS',
    category: 'Kepegawaian',
    description: 'SK Pengangkatan CPNS',
    url: 'https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=600&auto=format&fit=crop',
    status: 'Pending',
    uploadDate: '2024-03-01T08:15:00Z',
    validityPeriod: 'Selamanya',
  },
  {
    id: 'doc-4',
    type: 'Ijazah Terakhir',
    category: 'Pendidikan',
    description: 'Ijazah S1 Teknik Informatika',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
    status: 'Rejected',
    rejectionReason: 'Pindaian kurang jelas, harap upload ulang',
    uploadDate: '2024-04-10T14:20:00Z',
    validityPeriod: 'Selamanya',
  }
];

export const documentCategories = [
  {
    name: 'Identitas',
    types: ['KTP', 'Kartu Keluarga', 'NPWP', 'Akta Kelahiran']
  },
  {
    name: 'Kepegawaian',
    types: ['SK CPNS', 'SK PNS', 'SK Pangkat Terakhir', 'SK Jabatan', 'Karis/Karsu']
  },
  {
    name: 'Pendidikan',
    types: ['Ijazah Terakhir', 'Transkrip Nilai', 'Ijazah SD', 'Ijazah SMP', 'Ijazah SMA']
  },
  {
    name: 'Kompetensi',
    types: ['Sertifikat Diklat PIM', 'Sertifikat Teknis', 'Sertifikat Seminar']
  }
];

export const useDossierStore = create((set, get) => ({
  documents: initialDocuments,
  addDocument: (doc) => set((state) => ({ 
    documents: [
      {
        ...doc,
        id: `doc-${Date.now()}`,
        status: 'Pending',
        uploadDate: new Date().toISOString(),
      },
      ...state.documents
    ] 
  })),
  removeDocument: (id) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== id)
  })),
  getDocumentsByCategory: (categoryName) => {
    return get().documents.filter(doc => doc.category === categoryName);
  },
  getStats: () => {
    const docs = get().documents;
    return {
      total: docs.length,
      verified: docs.filter(d => d.status === 'Verified').length,
      pending: docs.filter(d => d.status === 'Pending').length,
      rejected: docs.filter(d => d.status === 'Rejected').length,
    }
  }
}));
