<template>
  <footer class="footer">
    <div class="footer__wrapper">
      <nuxt-link to="/">
        <img
          class="footer__logo"
          src="@/assets/image/logo/sapartime-logo.png"
          alt="Sapartime"
        />
      </nuxt-link>

      <div class="footer__box">
        <ul
          class="footer__list"
          v-for="section in footerList"
          :key="section.id"
        >
          <li
            v-for="list in section.list"
            :key="list"
            class="footer__list-item"
          >
            <nuxt-link class="footer__link" :to="list.link">
              <UiIcons
                size="size-24"
                v-if="list.icon"
                :icon="list.icon"
              ></UiIcons>
              <p class="footer__list-text">{{ list.name }}</p>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
const footerList = reactive([
  {
    id: 1,
    list: [
      {
        name: "О нас",
        icon: "",
        link: "",
      },
      {
        name: "Локации",
        icon: "",
        link: "",
      },
      {
        name: "Способы оплаты",
        icon: "",
        link: "",
      },
      {
        name: "Контакты",
        icon: "",
        link: "",
      },
    ],
  },
  {
    id: 2,
    list: [
      {
        name: "Партнеры",
        icon: "",
        link: "",
      },
      {
        name: "Полезные ссылки",
        icon: "",
        link: "",
      },
      {
        name: "FAQ",
        icon: "",
        link: "",
      },
      {
        name: "Политика конфиденциальности",
        icon: "",
        link: "",
      },
    ],
  },
  {
    id: 2,
    list: [
      {
        name: "@sapartime.kz",
        icon: "instagram",
        link: "",
      },
      {
        name: "sapartime@gmail.com",
        icon: "email",
        link: "",
      },
      {
        name: "@sapartime.kz",
        icon: "tiktok",
        link: "",
      },
    ],
  },
  {
    id: 3,
    list: [
      {
        name: "г. Алматы, ул. Такая, офис 67",
        icon: "location",
        link: "",
      },
      {
        name: "+7 777 (700) 77 77",
        icon: "phone",
        link: "",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
.footer {
  background-color: $surface-900;
  &__wrapper {
    max-width: 1240px;
    width: 100%;
    margin: 0 auto;
    padding: 40px 24px 100px 24px;
  }
  &__box {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  &__logo {
    margin: 46px 0;
    cursor: pointer;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__list-item {
    color: $white;
  }
  &__link {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-top: 12px;
  }
}

@media (max-width: 768px) {
  .footer {
    &__wrapper {
      padding: 16px 24px 40px 24px;
    }
    &__box {
      flex-wrap: wrap;
    }
    &__list-item {
      margin-top: 12px;
    }
  }
}
</style>
