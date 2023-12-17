<template>
  <div>
    <h1 class="text-2xl">Choose the right verb and conjugate it</h1>
    <p>Starting from a verb translated in italian write the verb in its base, past and participle forms.</p>
  </div>

  <div class="mt-8 space-y-3">
    <UButton label="Start" @click="start()" />

    <div class="mt-4 mb-3 text-xl">
      {{ translatedVerb }}
    </div>
    <div class="grid grid-cols-3 gap-4">
      <span>Base Form</span>
      <span>Past Simple</span>
      <span>Past Participle</span>
      <UInput :color="inputBaseColor" variant="outline" placeholder="base form" v-model="base" />
      <UInput :color="inputPastColor" variant="outline" placeholder="past simple" v-model="past" />
      <UInput :color="inputParticipleColor" variant="outline" placeholder="past participle" v-model="participle" />
    </div>

    <div>
      <UButton label="Check it" @click="check" :disabled="base.length == 0 || past.length == 0 || participle.length == 0" />
      <UButton color="gray" class="ml-2" label="Help" @click="suggest" :disabled="!translatedVerb" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { extractTranslations, validate, validation, findByTranslation } = useVerbs();

const translations = ref<string[]>([]);
const translatedVerb = ref('');
const base = ref('');
const past = ref('');
const participle = ref('');

const resetValidation = () => {
  validation.value = {
    base: null,
    past: null,
    participle: null,
  };
  inputBaseColor.value = inputColor('base');
  inputPastColor.value = inputColor('past');
  inputParticipleColor.value = inputColor('participle');
}

const inputBaseColor = ref('primary');
const inputPastColor = ref('primary');
const inputParticipleColor = ref('primary');

const inputColor = (verbType: 'base' | 'past' | 'participle') => {
  switch (validation.value?.[verbType]) {
    case true:
      return 'green';
    case false:
      return 'red';
    default:
      return 'primary';
  }
}

const start = () => {
  base.value = '';
  past.value = '';
  participle.value = '';
  resetValidation();
  translations.value = shuffle(extractTranslations());
  next();
}

const next = () => {
  const nextValue = translations.value.shift();
  if (nextValue === undefined) {
    start();

    return;
  }

  translatedVerb.value = translations.value.shift() as string;
}

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const check = () => {
  validate(translatedVerb.value, base.value, past.value, participle.value);
  inputBaseColor.value = inputColor('base');
  inputPastColor.value = inputColor('past');
  inputParticipleColor.value = inputColor('participle');
}

const suggest = () => {
  const verb = findByTranslation(translatedVerb.value);
  if (!verb) {
    return;
  }

  if (!validation.value?.base) {
    base.value = verb.base;
    check();

    return;
  }

  if (!validation.value?.past) {
    past.value = Array.isArray(verb.past) ? verb.past[0] : verb.past;
    check();

    return;
  }

  if (!validation.value?.participle) {
    participle.value = Array.isArray(verb.participle) ? verb.participle[0] : verb.participle;
    check();

    return;
  }
}

</script>

