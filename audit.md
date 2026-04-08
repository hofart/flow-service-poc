# Auditoria: Module Federation HOST Setup

## Contexto
O projeto `flow-service-poc` é uma SPA Vue 3 + Vite que será transformada no **HOST** da federação de módulos. Esta auditoria cobre toda limpeza necessária e o setup completo de Module Federation.

---

## PARTE 1 — LIMPEZA

### 1.1 Remover dependência não utilizada: `vue-i18n`

**Arquivo:** `package.json`

```diff
- "vue-i18n": "10",
```

**Motivo:** O projeto usa `i18next-vue` como solução de i18n. `vue-i18n` nunca é importado em nenhum arquivo de produção.

---

### 1.2 Remover `useSeach.ts` (hook virá do remote)

**Arquivo a deletar:** `src/shared/hooks/useSeach.ts`

**Arquivo a atualizar:** `src/modules/service-flow/hooks/useServiceFlowsList.ts`

```diff
- import { useSearch } from 'shared/hooks/useSeach';
```

**Motivo:** O hook `useSearch` será fornecido pelo módulo remote via Module Federation.

---

### 1.3 Limpar `vitest.setup.ts`

**Remover:**
- `import { createI18n } from 'vue-i18n'` (dependência removida)
- `import ENGLISH from './src/locales/en.json'` (caminho errado + lib removida)
- Bloco `createI18n` + `config.global.plugins = [i18n]` (sobrescreve setup correto do beforeAll)
- Mock de `vue-i18n`
- Mock de `@vue/apollo-composable` (Apollo não está no projeto)
- Mock de `motion-v` (biblioteca não está instalada)

---

### 1.4 Limpar `vitest.config.ts`

**Remover alias:**
```diff
- '@': path.resolve(__dirname, './src'),
```

**Remover exclusões inexistentes:**
```diff
- 'storybook-static',
- 'src/**/*.stories.ts',
- 'src/**/Camera.vue',
```

**Motivo:** Nenhum import usa `@/`. Storybook e `Camera.vue` não existem no projeto.

---

### 1.5 Remover `<div>` não utilizada no `index.html`

**Arquivo:** `index.html`

```diff
- <div id="certfy-onboarding-digital-configuration-web"></div>
```

**Motivo:** Nunca é referenciada no código.

---

### 1.6 Corrigir montagem do app em `src/main.ts`

**Arquivo:** `src/main.ts`

```diff
- app.mount('body');
+ app.mount('#app');
```

**Motivo:** O app estava montando em `body` ignorando o elemento `#app` definido no `index.html`.

---

### 1.7 Limpar `tsconfig.json`

**Remover paths inexistentes:**
```diff
- "generated/*": ["src/generated/*"],
- "local-design-system/*": ["../certfy-design-system/src/*"]
```

**Motivo:** `src/generated/` não existe. `local-design-system` aponta para diretório externo que quebra builds em CI.

---

### 1.8 Limpar `vite.config.ts`

**Remover alias para diretório externo:**
```diff
- 'local-design-system': path.resolve(
-   __dirname,
-   '../certfy-design-system/src'
- ),
```

**Motivo:** Alias aponta para `../certfy-design-system/src` — diretório fora do projeto que não existe em CI/CD.

---

### 1.9 Criar `.env.example`

**Arquivo a criar:** `.env.example`

```env
VITE_BFF_URL=
VITE_API_URL=
VITE_SECURITY_LOGIN_URL=
VITE_SENTRY_DSN=
VITE_REMOTE_FLOW_SERVICE_URL=
```

**Motivo:** Boas práticas — documentar variáveis esperadas sem expor valores reais.

---

## PARTE 2 — MODULE FEDERATION HOST SETUP

### 2.1 Instalar plugin de Module Federation

```bash
yarn add -D @originjs/vite-plugin-federation
```

> Plugin oficial para Module Federation com Vite + Vue 3.

---

### 2.2 Criar `src/bootstrap.ts`

Mover todo conteúdo de `src/main.ts` para `src/bootstrap.ts`.

`src/main.ts` passa a conter apenas:
```typescript
import('./bootstrap');
```

> **Obrigatório para Module Federation.** O dynamic import garante que os `shared` modules sejam inicializados antes do bootstrap da aplicação. Sem isso, a federação não funciona corretamente.

---

### 2.3 Configurar Module Federation no `vite.config.ts`

```typescript
import federation from '@originjs/vite-plugin-federation';

// Dentro de plugins[]:
federation({
  name: 'host',
  remotes: {
    // Adicionar remotes conforme necessário:
    // flow_service_remote: process.env.VITE_REMOTE_FLOW_SERVICE_URL,
  },
  shared: {
    vue: { singleton: true, requiredVersion: '^3.5.13' },
    'vue-router': { singleton: true, requiredVersion: '^4.0.3' },
    pinia: { singleton: true, requiredVersion: '^2.3.0' },
    'i18next': { singleton: true },
    'i18next-vue': { singleton: true },
    'vsoft-design-system': { singleton: true },
  },
}),
```

> O HOST **não** precisa de `exposes`. Apenas `remotes` e `shared`.  
> `singleton: true` garante uma única instância de cada lib entre host e remotes.

---

### 2.4 Adicionar `build.target: 'esnext'` no `vite.config.ts`

```typescript
build: {
  target: 'esnext',   // OBRIGATÓRIO para Module Federation
  commonjsOptions: { transformMixedEsModules: true },
  sourcemap: true,
},
```

> Module Federation com Vite exige `target: 'esnext'` para funcionar com dynamic imports.

---

### 2.5 Criar arquivo de tipos para módulos remotos

**Arquivo a criar:** `src/shared/types/remotes.d.ts`

```typescript
// Declarar módulos remotos para type safety
// Adicionar conforme os remotes forem integrados:
// declare module 'flow_service_remote/*' {
//   const component: import('vue').DefineComponent;
//   export default component;
// }
```

---

### 2.6 Adicionar variável de ambiente para remote URL

**Arquivo:** `.env`

```env
VITE_REMOTE_FLOW_SERVICE_URL=http://localhost:5001/assets/remoteEntry.js
```

---

### 2.7 Consumir `useSearch` do remote em `useServiceFlowsList.ts`

Após integrar o remote que expõe `useSearch`, atualizar o import:

```typescript
// Substituir o import local removido pelo import do remote:
import { useSearch } from 'nome_do_remote/useSearch';
```

---

## PARTE 3 — VERIFICAÇÃO

| # | Verificação | Comando |
|---|-------------|---------|
| 1 | Servidor de desenvolvimento inicia sem erros | `yarn dev` |
| 2 | Build de produção gera `dist/` sem erros | `yarn build` |
| 3 | Testes passam após limpeza do setup | `yarn test` |
| 4 | Type check passa sem erros | `yarn typecheck` |
| 5 | Remote carrega corretamente no HOST | Subir remote em outra porta e verificar no browser |

---

## Resumo de arquivos modificados

| Arquivo | Ação |
|---------|------|
| `package.json` | Remover `vue-i18n` |
| `vitest.setup.ts` | Remover mocks desnecessários (Apollo, motion-v, vue-i18n) |
| `vitest.config.ts` | Remover alias `@`, exclusões inexistentes |
| `index.html` | Remover `<div>` não utilizada |
| `src/main.ts` | Corrigir mount target + preparar para bootstrap pattern |
| `src/bootstrap.ts` | **CRIAR** — conteúdo atual de `main.ts` |
| `tsconfig.json` | Remover paths inexistentes |
| `vite.config.ts` | Remover alias externo + adicionar plugin MF |
| `src/shared/hooks/useSeach.ts` | **DELETAR** — virá do remote |
| `src/modules/service-flow/hooks/useServiceFlowsList.ts` | Remover import de `useSeach` |
| `src/shared/types/remotes.d.ts` | **CRIAR** — tipos para módulos remotos |
| `.env.example` | **CRIAR** — documentar variáveis |
