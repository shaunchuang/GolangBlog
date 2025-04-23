"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tagService } from '@/services/tagService';
import { Tag } from '@/types/api';

const TagEdit = () => {
  const params = useParams();
  const id = params?.id as string | number; // Ensure id is explicitly typed as string or number
  const router = useRouter();
  const [tag, setTag] = useState<Tag | null>(null);

  useEffect(() => {
    const fetchTag = async () => {
      if (id) {
        const response = await tagService.getTagById(id);
        setTag(response.data);
      }
    };

    fetchTag();
  }, [id]);

  const handleSave = async () => {
    if (tag) {
      await tagService.updateTag(id, tag);
      router.push('/admin/tags');
    }
  };

  return (
    <div>
      <h1>Edit Tag</h1>
      {/* form elements to edit the tag */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TagEdit;
