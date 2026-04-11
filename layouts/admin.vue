<template>
  <div class="admin-layout">
    <TheAdminLayoutAside class="admin-layout__aside" />

    <div class="admin-layout__main">
      <TheAdminLayoutHeader class="admin-layout__header" />
      <main class="admin-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
  background: $surface-150;

  &__aside {
    position: sticky;
    top: 0;
    height: 100vh;
  }

  &__main {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 5;
  }

  &__content {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 28px;
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

@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: 1fr;

    &__aside {
      position: static;
      height: auto;
    }

    &__content {
      padding: 16px;
    }
  }
}
</style>
