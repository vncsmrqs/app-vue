<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import ChevronDoubleRightIcon from 'vue-material-design-icons/ChevronDoubleRight.vue';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue';
import ChevronDoubleLeftIcon from 'vue-material-design-icons/ChevronDoubleLeft.vue';
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue';
import PaginationButton from '@/components/PaginationButton.vue';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    itemsPerPage?: number;
    totalItems: number;
    showFirstButton?: boolean;
    showLastButton?: boolean;
    showPreviousButton?: boolean;
    showNextButton?: boolean;
  }>(),
  {
    itemsPerPage: 10,
    showFirstButton: true,
    showLastButton: true,
    showPreviousButton: true,
    showNextButton: true,
  },
);

const emit = defineEmits<{
  'update:model-value': [number];
  'change-page': [number];
  mounted: [void];
  unmounted: [void];
}>();

const currentPage = computed({
  get() {
    return props.modelValue;
  },
  set(value: number) {
    emit('update:model-value', value);
  },
});

const goToNextPage = () => {
  if (currentPage.value === totalPages.value) {
    return;
  }
  goToPage(currentPage.value + 1);
};

const goToPreviousPage = () => {
  if (currentPage.value === 1) {
    return;
  }
  goToPage(currentPage.value - 1);
};

const goToFirstPage = () => {
  goToPage(1);
};

const goToLastPage = () => {
  goToPage(totalPages.value);
};

const goToPage = (pageNumber: number) => {
  currentPage.value = pageNumber;
  emit('change-page', pageNumber);
};

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const pages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_value, index) => index + 1).map((value) => ({
      value,
    }));
  }

  const pages = [];

  pages.push({ value: 1 });

  if (currentPage.value === 1 || currentPage.value === 2) {
    pages.push({ value: 2 });
    pages.push({ value: 3 });
  }

  if (currentPage.value > 3) {
    pages.push({ value: null });
  }

  if (currentPage.value > 2 && currentPage.value < totalPages.value - 1) {
    pages.push({ value: currentPage.value - 1 });
    pages.push({ value: currentPage.value });
    pages.push({ value: currentPage.value + 1 });
  }

  if (currentPage.value < totalPages.value - 2) {
    pages.push({ value: null });
  }

  if (currentPage.value === totalPages.value || currentPage.value === totalPages.value - 1) {
    pages.push({ value: totalPages.value - 2 });
    pages.push({ value: totalPages.value - 1 });
  }

  pages.push({ value: totalPages.value });

  return pages;
});

defineExpose({
  goToPage,
  goToNextPage,
  goToPreviousPage,
  goToFirstPage,
  goToLastPage,
  totalPages,
});

onMounted(() => emit('mounted'));
onUnmounted(() => emit('unmounted'));
</script>

<template>
  <div v-if="totalItems > 0" class="flex gap-4 overflow-x-auto">
    <PaginationButton v-if="showFirstButton" @click="goToFirstPage" :disabled="currentPage === 1">
      <ChevronDoubleLeftIcon class="md:hidden" :size="20" />
      <span class="hidden md:block">Primeira</span>
    </PaginationButton>
    <PaginationButton
      v-if="showPreviousButton"
      @click="goToPreviousPage"
      :disabled="currentPage === 1"
    >
      <ChevronLeftIcon class="md:hidden" :size="20" />
      <span class="hidden md:block">Anterior</span>
    </PaginationButton>
    <template v-for="(page, index) in pages" :key="index">
      <PaginationButton
        v-if="page.value"
        @click="() => goToPage(page.value)"
        :active="page.value === currentPage"
      >
        {{ page.value }}
      </PaginationButton>
      <PaginationButton v-else disabled> ...</PaginationButton>
    </template>

    <PaginationButton
      v-if="showNextButton"
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
    >
      <ChevronRightIcon class="md:hidden" :size="20" />
      <span class="hidden md:block">Próxima</span>
    </PaginationButton>
    <PaginationButton
      v-if="showLastButton"
      @click="goToLastPage"
      :disabled="currentPage === totalPages"
    >
      <ChevronDoubleRightIcon class="md:hidden" :size="20" />
      <span class="hidden md:block">Última</span>
    </PaginationButton>
  </div>
</template>

<style scoped></style>
