<template>
  <v-box
    class="flow-node-placeholder"
    width="250px"
    background="#F0F0F0"
    align="center"
    round="10px"
  >
    <v-icon name="v-placeholder-flow" color="#3A3A3A66" />
    <v-text
      text-align="center"
      font-size="14px"
      font-weight="600"
      color="#3A3A3A66"
      line-height="1.3"
      margin="0.4em 0 0"
    >
      Para criar o fluxo, selecione um card para começar a rota e solte aqui.
    </v-text>
  </v-box>
</template>

<style lang="scss">
  .flow-node-placeholder {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-80%, -50%);
  }
</style>
