// Font Awesome 設定
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// 防止 Font Awesome 圖標在 Next.js 中閃爍
config.autoAddCss = false;

// 導入固態圖標
import { 
  faSearch, 
  faUser, 
  faCalendarDays, 
  faGlobe, 
  faChevronLeft, 
  faChevronRight,
  faHome,
  faNewspaper,
  faLandmark,
  faChartLine,
  faLaptopCode,
  faCircleExclamation,
  faShareNodes,
  faCopy,
  faArrowRight,
  // 新增缺少的圖標
  faClock,
  faTags,
  faEnvelope,
  faArrowUp,
  faUserCircle,
  faGear,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

// 導入品牌圖標
import {
  faFacebookF,
  faXTwitter,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

// 將圖標添加到庫中以便全局使用
library.add(
  faSearch,
  faUser,
  faCalendarDays,
  faGlobe,
  faChevronLeft,
  faChevronRight,
  faHome,
  faNewspaper,
  faLandmark,
  faChartLine,
  faLaptopCode,
  faCircleExclamation,
  faShareNodes,
  faCopy,
  faArrowRight,
  // 新增缺少的圖標
  faClock,
  faTags,
  faEnvelope,
  faArrowUp,
  faUserCircle,
  faGear,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  // 品牌圖標
  faFacebookF,
  faXTwitter,
  faLinkedinIn
);