import { translations } from '@/constants/translations';
import { useSettings } from '@/context/SettingsContext';

export const useTranslation = () => {
  const { language } = useSettings();
  return translations[language];
};
