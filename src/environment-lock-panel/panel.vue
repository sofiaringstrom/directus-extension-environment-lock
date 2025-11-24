<template>
  <div class="wrapper" :class="{ 'has-header': showHeader }">
    <div v-if="status" class="status-wrapper">
      <div class="icon" :class="status.type">
        <VIcon :name="status.icon" :large="true" />
      </div>

      <div class="text-wrapper">
        <div class="title-wrapper">
          <p>
            <strong>{{ status.title }}</strong>
          </p>
          <p>
            <VChip v-if="status.environment" small class="environment-chip">
              {{ status.environment }}
            </VChip>
          </p>
        </div>

        <p class="content">{{ status.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useApi } from "@directus/extensions-sdk";
  import { PanelStatus } from "../types/panel-status";

  const props = defineProps<{
    showHeader: boolean;
  }>();

  const api = useApi();

  const status = ref<PanelStatus | null>(null);

  const getStatus = async () => {
    try {
      const { data } = await api.get("/environment-lock/get-status");
      status.value = data as PanelStatus;
    } catch (error) {
      console.error(error);
    }
  };

  getStatus();
</script>

<style scoped>
  .wrapper {
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .wrapper.has-header {
    padding-top: 0;
  }

  .status-wrapper {
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }

  .icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6.25rem;
    height: 6.25rem;
    border-radius: 50%;
    margin-bottom: 0;

    &.success {
      color: var(--theme--success);
      background-color: var(--success-alt);
    }

    &.info {
      color: var(--blue);
      background-color: var(--blue-alt);
    }

    &.warning {
      color: var(--theme--warning);
      background-color: var(--warning-alt);
    }

    &.danger {
      color: var(--theme--danger);
      background-color: var(--danger-alt);
    }
  }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
  }

  .title-wrapper {
    display: flex;
    gap: 0.5rem;
  }

  .title {
    color: var(--theme--foreground-accent);
    font-size: 1.5rem;
    font-weight: var(--theme--fonts--display--font-weight);
    font-family: var(--theme--fonts--display--font-family);
    font-style: normal;
    line-height: 2.125rem;
  }

  .environment-chip {
    font-family: monospace;
  }

  .content {
    color: var(--theme--foreground-subdued);
    line-height: 1.375rem;
  }
</style>
