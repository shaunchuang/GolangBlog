"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/api';

// ...existing code...

const CategoryEdit = () => {
  const params = useParams();
  const id = params?.id as string | number; // Ensure id is explicitly typed as string or number
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await categoryService.getCategoryById(id);
      setCategory(response.data);
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleSave = async () => {
    if (category) {
      await categoryService.updateCategory(id, category);
      router.push('/admin/categories');
    }
  };

  return (
    <div>
      {/* ...existing code... */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default CategoryEdit;
