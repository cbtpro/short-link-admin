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

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

const props = defineProps<{
  value?: string;
  mode?: 'code' | 'tree' | 'text';
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

<style scoped>
.mini-mode {
  height: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px 10px;
  font-family: monospace;
  background-color: #fafafa;
  cursor: pointer;
}

.editor-mode {
  height: 300px;
  border: 1px solid #dcdfe6;
}
</style>
