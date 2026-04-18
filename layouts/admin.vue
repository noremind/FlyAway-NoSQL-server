<template>
  <div class="admin-layout">
    <TheAdminLayoutAside class="admin-layout__aside" />
    <button
      v-if="isNavOpen"
      class="admin-layout__overlay"
      type="button"
      aria-label="Закрыть меню"
      @click="closeNav"
    ></button>

    <div class="admin-layout__main">
      <TheAdminLayoutHeader class="admin-layout__header" />
      <main class="admin-layout__content">
        <div class="admin-layout__content-inner">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const isNavOpen = useState("admin-nav-open", () => false);

const closeNav = () => {
  isNavOpen.value = false;
};

watch(
  () => route.fullPath,
  () => {
    closeNav();
  },
);
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  background:
    linear-gradient(180deg, rgba($red-500, 0.05) 0, rgba($red-500, 0) 180px),
    #fafafb;

  &__aside {
    position: relative;
    z-index: 20;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 15;
    border: 0;
    background: rgba(32, 36, 38, 0.34);
  }

  &__main {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  &__content {
    width: 100%;
    max-width: 1360px;
    margin: 0 auto;
    padding: 32px 32px 44px;
  }

  &__content-inner {
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: adminAppear 0.24s ease;
  }
}

@keyframes adminAppear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.admin-form),
:deep(.tour-editor__card),
:deep(.partner-profile),
:deep(.partner-profile__empty),
:deep(.admin-contacts),
:deep(.admin-list__item),
:deep(.admin-dashboard__panel) {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba($red-500, 0.1);
  border-radius: 8px;
  box-shadow: 0 20px 48px rgba(32, 36, 38, 0.09);
}

:deep(.admin-form),
:deep(.tour-editor__card),
:deep(.partner-profile),
:deep(.partner-profile__empty),
:deep(.admin-contacts) {
  padding: 24px;
}

:deep(.admin-form .input__wrapper),
:deep(.tour-editor__card .input__wrapper),
:deep(.partner-profile .input__wrapper),
:deep(.admin-contacts .input__wrapper) {
  min-height: 48px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid rgba($surface-300, 0.9);
  border-radius: 26px;
  box-shadow: 0 10px 22px rgba(32, 36, 38, 0.07);
}

:deep(.admin-form .textarea__wrapper),
:deep(.tour-editor__card .textarea__wrapper),
:deep(.partner-profile .textarea__wrapper),
:deep(.admin-contacts .textarea__wrapper) {
  border: 1px solid rgba($surface-300, 0.9);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(32, 36, 38, 0.07);
}

:deep(.admin-form .select),
:deep(.tour-editor__card .select),
:deep(.partner-profile .select) {
  background: transparent;
}

:deep(.admin-form .select__wrapper),
:deep(.tour-editor__card .select__wrapper),
:deep(.partner-profile .select__wrapper) {
  border-radius: 26px;
  box-shadow: 0 10px 22px rgba(32, 36, 38, 0.07);
}

@media (max-width: 1024px) {
  .admin-layout {
    grid-template-columns: 1fr;

    &__content {
      padding: 16px 18px 30px;
    }
  }
}

@media (max-width: 520px) {
  .admin-layout {
    &__content {
      padding: 12px 12px 22px;
    }
  }

  :deep(.admin-form),
  :deep(.partner-profile),
  :deep(.partner-profile__empty),
  :deep(.admin-contacts) {
    padding: 16px;
  }
}
</style>
