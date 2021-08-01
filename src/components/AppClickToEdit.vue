<template>
  <span
    v-if="!editing && !forceEditing"
    @mouseover="showPencil = true"
    @mouseleave="showPencil = false"
    @click="startEditing"
  >
    {{ modelValue }}
    <button style="cursor: pointer" v-show="keepPencilSpace || showPencil">
      <span v-show="showPencil" class="mdi mdi-pencil text-on-surface"></span>
    </button>
  </span>
  <span v-else @mouseover="showPencil = true" @mouseleave="showPencil = false">
    <input
      class="bg-transparent border-2 border-gray-400 rounded-md outline-none"
      v-model="editValue"
      type="text"
      @keydown.esc="cancelEdit"
      @keyup.enter="applyEdit"
      v-focus
      :style="inputStyle"
    />
    <button @click="applyEdit" :disabled="!valid">
      <span class="mdi mdi-keyboard-return text-on-surface"></span>
    </button>
    <button @click="cancelEdit">
      <span class="mdi mdi-keyboard-esc text-on-surface"></span>
    </button>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, Ref, ref } from "vue";

export default defineComponent({
  props: {
    modelValue: [String, Number],
    maxInputWidth: Number,
    validate: Function,
    forceEditing: Boolean,
    keepPencilSpace: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const editing = ref(false);
    const showPencil = ref(false);
    const editValue: Ref<string | number> = ref("");

    const valid = computed(() => {
      if (!props.validate) {
        return true;
      }
      return props.validate(editValue.value);
    });

    const startEditing = () => {
      console.log("start editing");
      editValue.value = props.modelValue || "";
      editing.value = true;
    };

    const applyEdit = () => {
      console.log("apply edit");
      if (!valid.value) return;
      emit("update:modelValue", editValue.value);
      editing.value = false;
    };

    const cancelEdit = () => {
      console.log("cancel edit");
      nextTick(() => {
        console.log("cancel edit next tick");
        editing.value = false;
      });
    };

    const maxInputWidthStyle = computed(() =>
      props.maxInputWidth
        ? {
            "max-width": props.maxInputWidth + "px",
          }
        : {}
    );

    const validRuleStyle = computed(() =>
      valid.value ? {} : { color: "var(--v-error-base)" }
    );

    const inputStyle = computed(() => ({
      ...maxInputWidthStyle.value,
      ...validRuleStyle.value,
    }));

    return {
      editing,
      showPencil,
      editValue,
      valid,
      startEditing,
      applyEdit,
      cancelEdit,
      inputStyle,
    };
  },
});
</script>
