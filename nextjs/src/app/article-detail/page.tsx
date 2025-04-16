import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import { articleService } from '@/services/articleService';
import { Article } from '@/types/api';
import { useRouter } from 'next/navigation';

// ...existing code from frontend/src/pages/ArticleDetail.tsx...
