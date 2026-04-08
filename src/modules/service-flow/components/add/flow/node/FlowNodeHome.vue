<template>
  <v-box padding="6px 16px" class="flow-node flow-node--home">
    <v-box padding="0" direction="row" align="center" gap="8px">
      <v-icon color="white" name="v-home" translate-y="3px" />
      <v-text>Home</v-text>
      <v-box
        padding="0"
        class="flow-node__connector"
        align="center"
        justify="center"
      >
        <span />
      </v-box>
    </v-box>
  </v-box>
</template>

<style lang="scss" scoped>
  .flow-node {
    &--home {
      background-color: #373737;
      padding: 8px 12px;
      border-radius: 12px;
      display: inline-block;
      color: $white;
      font-size: 14px;
    }

    &__connector {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: $white;
      margin-left: auto;
      span {
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: $black;
      }
    }
  }
</style>
