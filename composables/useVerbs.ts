import { verbsList } from '~~/config/verbs';

interface ValidationInfo {
  base: boolean | null,
  past: boolean | null,
  participle: boolean | null,
}

export const useVerbs = () => {
  const verbs = ref(verbsList);
  const validation = ref<ValidationInfo>();

  const extractTranslations = () => {
    const translations: string[] = [];
    verbs.value.forEach(v => {
      translations.push(...v.translation.it);
    });

    return translations;
  };

  const validate = (translation: string, base: string, past: string, participle: string) => {
    validation.value = {
      base: false,
      past: false,
      participle: false,
    };

    const validVerbs = verbsList.filter(v => v.translation.it.includes(translation));

    if (validVerbs.length === 0) {
      return validation;
    }

    base = base.trim().toLowerCase();
    past = past.trim().toLowerCase();
    participle = participle.trim().toLowerCase();

    for (const v of validVerbs) {
      const baseResult = base.trim().toLowerCase() === v.base;
      const pastResult = Array.isArray(v.past) ? v.past.includes(past) : past === v.past;
      const participleResult = Array.isArray(v.participle) ? v.participle.includes(participle) : participle === v.participle;
      if (baseResult || pastResult || participleResult) {
        validation.value = {
          base: baseResult,
          past: pastResult,
          participle: participleResult,
        }

        break;
      }
    }

    return validation;
  };

  const findByTranslation = (translation: string) => verbsList.find(v => v.translation.it.includes(translation));

  return {
    verbs,
    validation,
    extractTranslations,
    validate,
    findByTranslation,
  };
}
