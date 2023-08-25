<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Onfly</q-toolbar-title>
        <q-btn v-if="currentPath !== '/login'" label="Sair" @click="goToRoot" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const router = useRouter();
    const currentPath = computed(() => route.path);

    const goToRoot = () => {
      router.push('/');
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goToRoot,
      currentPath,
    };
  },
});
</script>
