<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import JSONEditor from 'jsoneditor';

import 'jsoneditor/dist/jsoneditor.css';

const props = defineProps<{
  mode?: 'code' | 'text' | 'tree';
  value?: string;
}>();
const emit = defineEmits(['update:value']);

const isEditing = ref(false);
const container = ref<HTMLElement>();
let editor: JSONEditor | null = null;

const displayText = computed(() => {
  try {
    const parsed = JSON.parse(props.value || '{}');
    return JSON.stringify(parsed);
  } catch {
    return props.value || '';
  }
});

function createEditor() {
  editor = new JSONEditor(container.value!, {
    mode: props.mode || 'code',
    mainMenuBar: false,
    statusBar: false,
    onChange: () => {
      try {
        const json = editor!.getText();
        emit('update:value', json);
      } catch {}
    },
  });

  try {
    editor.setText(props.value || '{}');
  } catch {
    editor.setText('{}');
  }

  // 监听 JSONEditor 的文本框失焦
  nextTick(() => {
    const inputEl =
      container.value?.querySelector('textarea') || // text mode
      container.value?.querySelector('.ace_text-input'); // code mode

    if (inputEl) {
      inputEl.addEventListener('blur', handleBlur, { once: true });
    }
  });
}

function destroyEditor() {
  editor?.destroy();
  editor = null;
}

function handleBlur() {
  destroyEditor();
  isEditing.value = false;
}

watch(
  () => props.value,
  (val) => {
    if (editor && val !== editor.getText()) {
      try {
        editor.setText(val || '{}');
      } catch {}
    }
  },
);

onMounted(() => {
  if (isEditing.value) {
    nextTick(() => createEditor());
  }
});

watch(isEditing, (editing) => {
  nextTick(() => {
    if (editing) createEditor();
    else destroyEditor();
  });
});

onBeforeUnmount(() => {
  destroyEditor();
});
</script>

<template>
  <div>
    <div
      v-if="!isEditing"
      class="mini-mode"
      @click="isEditing = true"
      :title="displayText"
    >
      {{ displayText }}
    </div>
    <div v-else ref="container" class="editor-mode"></div>
  </div>
</template>

<style scoped>
.mini-mode {
  height: 40px;
  padding: 6px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: monospace;
  white-space: nowrap;
  cursor: pointer;
  background-color: #fafafa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.editor-mode {
  height: 300px;
  border: 1px solid #dcdfe6;
}
</style>
