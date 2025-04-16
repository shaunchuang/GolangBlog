import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tagService } from '@/services/tagService';

const TagEdit = () => {
  const params = useParams();
  const id = params?.id as string | number; // Ensure id is explicitly typed as string or number
  const router = useRouter();
  const [tag, setTag] = useState(null);

  useEffect(() => {
    const fetchTag = async () => {
      if (id) {
        const fetchedTag = await tagService.getTagById(id); // Correctly define fetchedTag
        setTag(fetchedTag);
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
