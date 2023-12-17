<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader class="p-2"/>

    <UContainer class="flex-1 mt-5">
      <NuxtPage/>
    </UContainer>

    <UNotifications />
    <AppFooter />
  </div>
</template>
