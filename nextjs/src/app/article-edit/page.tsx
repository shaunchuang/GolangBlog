import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { articleService } from '@/services/articleService';
import { tagService } from '@/services/tagService';
import { categoryService } from '@/services/categoryService';
import { Tag, Category } from '@/types/api';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// ...existing code...
// 將 useNavigate() 改為 useRouter()，navigate(...) 改為 router.push(...)
// useParams 也改為 next/navigation 版本
// ...existing code...
