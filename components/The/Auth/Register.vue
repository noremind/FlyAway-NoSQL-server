<template>
	<section class="register">
		<div class="register__wrapper">
			<img
				class="register__logo"
				src="@/assets/image/logo/FlyAway-logo.png"
				alt="FlyAway"
			/>

			<h4 class="register__title">Регистрация</h4>

			<form class="register__form">
				<UiInput
					placeholder="Введите имя"
					label="Ваше имя*"
					v-model.trim="name"
				></UiInput>

				<UiInput
					label="Ваш email*"
					placeholder="mail@example.com"
					v-model.trim="email"
				></UiInput>

				<UiInput
					label="Пароль*"
					placeholder="Минимум 6 символов"
					v-model.trim="password"
					type="password"
				></UiInput>

				<UiInput
					label="Повторите пароль*"
					placeholder="Пароль еще раз"
					v-model.trim="passwordConfirm"
					type="password"
				></UiInput>

				<p class="register__error" v-if="!!errorMessage">
					{{ errorMessage }}
				</p>

				<UiButton
					label="Зарегистрироваться"
					class="register__btn button-primary"
					:disabled="!disabledBtn"
					:is-loading="isLoading"
					@click="postSignUp"
				></UiButton>
			</form>
		</div>
	</section>
</template>

<script setup>
const emit = defineEmits(["nextStep"])
const userStore = useAuthStore()

const name = ref("")
const email = ref("")
const password = ref("")
const passwordConfirm = ref("")

const errorMessage = ref("")
const isLoading = ref(false)

const disabledBtn = computed(() => {
	const isValidEmail =
		email.value.includes("@") &&
		email.value.includes(".") &&
		email.value.split(".").pop().length >= 2

	return (
		name.value.length > 1 &&
		name.value.length < 50 &&
		isValidEmail &&
		password.value.length >= 6 &&
		password.value === passwordConfirm.value
	)
})

const postSignUp = () => {
	if (disabledBtn.value) {
		isLoading.value = true
		useApi()
			.client({
				url: "/auth/register",
				method: "post",
				data: {
					name: name.value,
					email: email.value,
					password: password.value,
				},
			})
			.then((res) => {
				userStore.setToken(res.token)
				userStore.setUserData(res.user)
				isLoading.value = false
				emit("nextStep")
			})
			.catch((res) => {
				errorMessage.value = res?.message || "Не удалось зарегистрироваться"
				isLoading.value = false
			})
	}
}

watch(
	() => [name.value, email.value, password.value, passwordConfirm.value],
	() => {
		if (errorMessage.value) errorMessage.value = ""
	},
)
</script>

<style lang="scss" scoped>
.register {
	&__wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 26px;
		padding: 40px 0 60px 0;
	}
	&__title {
		font-size: 32px;
		font-weight: 700;
		margin: 16px 0;
	}
	&__form {
		max-width: 352px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	&__error {
		font-size: 12px;
		color: $orange-200;
	}
	&__logo {
		width: 64px;
	}
}
</style>
