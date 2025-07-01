<template>
    <div class="unauthorized-container">
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <RouterLink to="/">Voltar para a Home</RouterLink>
    </div>
</template>

<style scoped>
.unauthorized-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    text-align: center;
}
</style>